import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Resume from '@/models/Resume';
import Analysis from '@/models/Analysis';
import { GoogleGenerativeAI } from "@google/generative-ai";

type AnalyzeRequestBody = {
  resumeId?: string;
  jobDescription?: string;
};

type AnalyzeResponsePayload = {
  matchScore?: number;
  missingSkills?: string[];
  suggestions?: string;
};

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Fallback logic
function fallbackAnalysis(resumeText: string, jobDesc: string) {
  const normalize = (text: string) => text.toLowerCase().replace(/[^a-z0-9]/g, ' ');
  const resWords = new Set(normalize(resumeText).split(' ').filter(w => w.length > 2));
  const jobWords = normalize(jobDesc).split(' ').filter(w => w.length > 2);

  const jobWordFreq: Record<string, number> = {};
  for (const w of jobWords) {
    jobWordFreq[w] = (jobWordFreq[w] || 0) + 1;
  }

  const topJobKeywords = Object.entries(jobWordFreq)
    .sort((a, b) => b[1] - a[1])
    .map(i => i[0])
    .slice(0, 15);

  const missingSkills = topJobKeywords.filter(w => !resWords.has(w));
  const matchedSkills = topJobKeywords.length - missingSkills.length;

  const matchScore = Math.round((matchedSkills / topJobKeywords.length) * 100) || 10;

  return {
    matchScore,
    missingSkills,
    suggestions: "This is a fallback analysis. Add more of the missing keywords to your resume to increase visibility.",
  };
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { resumeId, jobDescription } = (await req.json()) as AnalyzeRequestBody;

    if (!resumeId || !jobDescription) {
      return NextResponse.json({ error: 'Resume ID and Job Description are required' }, { status: 400 });
    }

    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    const { text: resumeText } = resume;

    let matchScore = 0;
    let missingSkills: string[] = [];
    let suggestions = '';

    try {
      // If no Gemini key then fallback
      if (!process.env.GEMINI_API_KEY) {
        throw new Error('Gemini API Key missing');
      }

      let model;
      try {
        model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      } catch {
        model = genAI.getGenerativeModel({ model: "gemini-pro" });
      }

      const prompt = `Act as an expert recruiter and ATS system.

Compare the resume with the job description and return ONLY valid JSON:

{
  "matchScore": number,
  "missingSkills": string[],
  "suggestions": string
}

Job Description:
${jobDescription}

Resume:
${resumeText}`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();

      // Strip markdown code fences if Gemini wraps its JSON in them
      const cleaned = text.replace(/```(?:json)?\s*/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned) as AnalyzeResponsePayload;

      matchScore = parsed.matchScore || 0;
      missingSkills = parsed.missingSkills || [];
      suggestions = parsed.suggestions || '';

    } catch (aiError: unknown) {
      console.warn("Gemini failed, using fallback.", aiError);
      if (aiError instanceof Error && aiError.message.includes('404')) {
        console.error('ERROR: Gemini API not accessible. Check your API key and that Generative Language API is enabled.');
      }

      const fallbackResult = fallbackAnalysis(resumeText, jobDescription);
      matchScore = fallbackResult.matchScore;
      missingSkills = fallbackResult.missingSkills;
      suggestions = fallbackResult.suggestions;
    }

    // Save to DB
    const newAnalysis = await Analysis.create({
      resumeId,
      jobDescription,
      matchScore,
      missingSkills,
      suggestions,
    });

    return NextResponse.json({
      analysisId: newAnalysis._id,
      matchScore,
      missingSkills,
      suggestions,
    });

  } catch (error: unknown) {
    console.error('Analyze Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error running analysis' },
      { status: 500 }
    );
  }
}
