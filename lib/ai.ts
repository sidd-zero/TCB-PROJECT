import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Modern model list for April 2026 - Prioritizing aliases that are confirmed to work
const MODELS = [
  "gemini-flash-latest",
  "gemini-2.5-flash",
  "gemini-3.1-flash",
  "gemini-1.5-flash-latest",
  "gemini-pro-latest"
];

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function generateWithFallback(prompt: string) {
  let lastError: any = null;
  let attempt = 0;

  for (const modelName of MODELS) {
    attempt++;
    try {
      // Logic for retrying the SAME model or different models with backoff
      if (attempt > 1) {
        // If the last error was a 503, we should wait longer
        const isTransient = lastError?.message?.includes("503") || lastError?.message?.includes("429");
        const baseDelay = isTransient ? 2000 : 500; 
        const delay = Math.min(baseDelay * Math.pow(2, attempt - 2), 10000) + Math.random() * 1000;
        
        console.log(`[AI Utility] ${isTransient ? 'Server busy' : 'Retrying'}... waiting ${Math.round(delay)}ms...`);
        await sleep(delay);
      }

      console.log(`[AI Utility] Attempt ${attempt}: Using model ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      
      // Add a timeout to the request if possible (not directly supported in SDK easily, but we can wrap)
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      
      if (text) {
        console.log(`[AI Utility] Success with model: ${modelName}`);
        return text;
      }
    } catch (error: any) {
      const is404 = error.message?.includes("404");
      const is503 = error.message?.includes("503");
      const is429 = error.message?.includes("429");
      
      console.warn(`[AI Utility] Model ${modelName} failed (${is404 ? '404' : is503 ? '503' : is429 ? '429' : 'Error'}):`, error.message);
      lastError = error;
      
      // If it's a 404, we don't wait much, just move on
      // If it's a 503 or 429, the next attempt will have a longer delay
      continue;
    }
  }

  throw new Error(`AI generation failed after ${MODELS.length} attempts. Last error: ${lastError?.message || 'Unknown error'}`);
}
