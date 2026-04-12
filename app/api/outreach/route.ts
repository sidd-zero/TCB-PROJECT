import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

type OutreachRequestBody = {
  vibe: string;
  strength: string;
  role: string;
};

export async function POST(req: Request) {
  try {
    const { vibe, strength, role } = (await req.json()) as OutreachRequestBody;

    if (!vibe || !strength || !role) {
      return NextResponse.json({ error: 'Vibe, Strength, and Role are required' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `### ROLE
You are a high-stakes Networking Strategist and Copywriter. Your goal is to write a high-conversion LinkedIn DM (Connection Request or InMail) that is under 300 characters.

### INPUT DATA
1. Job Description Analysis (Vibe): ${vibe}
2. User's Top Strength (from Resume): ${strength}
3. Target Role: ${role}

### TASK
Generate three distinct LinkedIn messages based on the "Vibe Check" results. Each message MUST be under 300 characters (including spaces).

### TONE GUIDELINES
- STARTUP VIBE: Direct, bold, and high-energy. Focus on "solving problems" and "shipping fast." No fluff.
- CORPORATE VIBE: Professional, respectful, and referral-oriented. Focus on "value-add" and "alignment with standards."
- TECH-ELITE VIBE: Engineering-centric. Focus on "scalability," "architecture," or a specific technical achievement.

### OUTPUT FORMAT (STRICT JSON)
{
  "outreach": {
    "startup": {
      "message": "string",
      "strategy": "Direct problem-solver approach"
    },
    "corporate": {
      "message": "string",
      "strategy": "Formal value-alignment approach"
    },
    "technical": {
      "message": "string",
      "strategy": "Peer-to-peer engineering approach"
    }
  },
  "characterCounts": {
    "startup": number,
    "corporate": number,
    "technical": number
  }
}

### CONSTRAINTS
- STRICT limit of 300 characters per message.
- Use the User's [Top Strength] to prove immediate relevance.
- Ensure the message includes a clear, low-friction "Ask" (e.g., "Open to a chat?" or "Would love to learn more").
- Return ONLY the JSON object. No other text.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Clean JSON response
    const cleaned = text.replace(/```(?:json)?\s*/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return NextResponse.json(parsed);

  } catch (error: unknown) {
    console.error('Outreach Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error generating outreach messages' },
      { status: 500 }
    );
  }
}
