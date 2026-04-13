import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Resume from '@/models/Resume';
import Analysis from '@/models/Analysis';
import { GoogleGenerativeAI } from "@google/generative-ai";

type AnalyzeRequestBody = {
  resumeId?: string;
  jobDescription?: string;
};

type DeepDiveAnalysisPayload = {
  atsScore: {
    score: number;
    foundKeywords: string[];
    missingKeywords: string[];
    parsingWarnings: string[];
    scoreJustification: string;
  };
  analyzerScore: {
    score: number;
    vibeMatch: string;
    impactRating: string;
    cultureFitSuggestions: string;
    scoreJustification: string;
  };
  overallShortlistProbability: 'High' | 'Medium' | 'Low';
};

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Fallback logic
function fallbackAnalysis(resumeText: string, jobDesc: string): DeepDiveAnalysisPayload {
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

  const foundKeywords = topJobKeywords.filter(w => resWords.has(w));
  const missingKeywords = topJobKeywords.filter(w => !resWords.has(w));
  
  const ats_score = Math.round((foundKeywords.length / topJobKeywords.length) * 100) || 10;

  return {
    atsScore: {
      score: ats_score,
      foundKeywords,
      missingKeywords,
      parsingWarnings: ["Fallback mode: Visual structure not fully parsed."],
      scoreJustification: "Brutally honest: Your keyword density is low. You are likely being filtered out because your language doesn't mirror the JD expectations.",
    },
    analyzerScore: {
      score: Math.max(0, ats_score - 10),
      vibeMatch: "Neutral/Corporate",
      impactRating: "Low: Data points are missing.",
      cultureFitSuggestions: "Adopt more active, results-oriented language used in modern tech environments.",
      scoreJustification: "Your bullet points focus on tasks, not outcomes. Recruiters want to see how you moved the needle, not just what was on your calendar.",
    },
    overallShortlistProbability: ats_score > 70 ? 'High' : ats_score > 40 ? 'Medium' : 'Low',
  };
}

function sanitizeAndValidatePayload(payload: any): DeepDiveAnalysisPayload {
  return {
    atsScore: {
      score: Math.max(0, Math.min(100, Number(payload?.atsScore?.score) || 0)),
      foundKeywords: Array.isArray(payload?.atsScore?.foundKeywords) ? payload.atsScore.foundKeywords : [],
      missingKeywords: Array.isArray(payload?.atsScore?.missingKeywords) ? payload.atsScore.missingKeywords : [],
      parsingWarnings: Array.isArray(payload?.atsScore?.parsingWarnings) ? payload.atsScore.parsingWarnings : [],
      scoreJustification: payload?.atsScore?.scoreJustification || 'No justification provided.',
    },
    analyzerScore: {
      score: Math.max(0, Math.min(100, Number(payload?.analyzerScore?.score) || 0)),
      vibeMatch: payload?.analyzerScore?.vibeMatch || 'N/A',
      impactRating: payload?.analyzerScore?.impactRating || 'N/A',
      cultureFitSuggestions: payload?.analyzerScore?.cultureFitSuggestions || 'N/A',
      scoreJustification: payload?.analyzerScore?.scoreJustification || 'No recruiter feedback provided.',
    },
    overallShortlistProbability: payload?.overallShortlistProbability || 'Low',
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

    let deepDiveAnalysis: DeepDiveAnalysisPayload;

    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error('Gemini API Key missing');
      }

      let model;
      try {
        model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      } catch {
        model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
      }

      const prompt = `### ROLE
You are a dual-mode AI System: 
1. An ATS (Applicant Tracking System) Parser.
2. A Senior Executive Recruiter.

### TASK
Analyze the provided Job Description (JD) and Resume. You must return TWO distinct scores and a detailed breakdown in a single JSON object.

### INPUTS
- Job Description:
${jobDescription}

- Resume:
${resumeText}

### CRITERIA
1. ATS COMPATIBILITY SCORE (0-100):
   - Keyword Density: How many hard skills from the JD are present?
   - Formatting Check: Are there complex tables/images that might break a parser?
   - Section Headings: Are standard headings used (Experience, Education, etc.)?

2. STRATEGIC ANALYZER SCORE (0-100):
   - Vibe/Tone Match: Does the language match the company culture?
   - Impact Assessment: Are bullet points result-oriented (numbers/metrics)?
   - Seniority Alignment: Does the experience level match the JD requirements?

### OUTPUT FORMAT (STRICT JSON)
{
  "atsScore": {
    "score": number,
    "foundKeywords": ["string"],
    "missingKeywords": ["string"],
    "parsingWarnings": ["string"],
    "scoreJustification": "string"
  },
  "analyzerScore": {
    "score": number,
    "vibeMatch": "string",
    "impactRating": "string",
    "cultureFitSuggestions": "string",
    "scoreJustification": "string"
  },
  "overallShortlistProbability": "High/Medium/Low"
}

### CONSTRAINTS
- Be precise. If a keyword is missing, list it.
- The 'scoreJustification' must be direct and 'brutally honest.'
- No conversational filler, output ONLY the JSON.`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();

      const cleaned = text.replace(/```(?:json)?\s*/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      deepDiveAnalysis = sanitizeAndValidatePayload(parsed);

    } catch (aiError: unknown) {
      console.warn("Gemini failed, using fallback.", aiError);
      deepDiveAnalysis = fallbackAnalysis(resumeText, jobDescription);
    }

    const overallMatchScore = Math.round((deepDiveAnalysis.atsScore.score + deepDiveAnalysis.analyzerScore.score) / 2);
    const missingSkills = deepDiveAnalysis.atsScore.missingKeywords;
    const suggestions = deepDiveAnalysis.analyzerScore.cultureFitSuggestions;

    // Save to DB
    const newAnalysis = await Analysis.create({
      resumeId,
      jobDescription,
      matchScore: overallMatchScore,
      missingSkills,
      suggestions,
      overallMatchScore,
      report: deepDiveAnalysis,
    });

    return NextResponse.json({
      analysisId: newAnalysis._id,
      ...deepDiveAnalysis,
      matchScore: overallMatchScore,
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
