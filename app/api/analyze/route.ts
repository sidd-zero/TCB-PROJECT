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
  vibeCheck: {
    jdStyle: string;
    resumeTone: string;
    vibeMatchScore: number;
    toneAdjustmentAdvice: string;
  };
  gapAnalysis: {
    missingHardSkills: string[];
    experienceGaps: string[];
    theHarshTruth: string;
  };
  actionPlan: string[];
  overallMatchScore: number;
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

  const missingHardSkills = topJobKeywords.filter(w => !resWords.has(w));
  const matchedSkills = topJobKeywords.length - missingHardSkills.length;

  const overallMatchScore = Math.round((matchedSkills / topJobKeywords.length) * 100) || 10;
  const vibeMatchScore = Math.max(0, Math.min(100, overallMatchScore - 5));

  return {
    vibeCheck: {
      jdStyle: 'General corporate (fallback inference)',
      resumeTone: 'Neutral resume tone (fallback inference)',
      vibeMatchScore,
      toneAdjustmentAdvice:
        'Use direct, results-first wording that mirrors the JD language and trims generic claims.',
    },
    gapAnalysis: {
      missingHardSkills: missingHardSkills.map((skill) => `CRITICAL: ${skill}`),
      experienceGaps: [
        'Project scale and ownership depth are unclear from fallback parsing.',
        'Industry context alignment is not explicit in the resume text.',
      ],
      theHarshTruth:
        'A recruiter will pass if your resume does not clearly map to the JD requirements with evidence.',
    },
    actionPlan: [
      'Add 2 role-relevant projects that directly prove missing skills from the JD.',
      'Quantify outcomes in bullet points using metrics, scope, and business impact.',
      'Rewrite summary and top bullets using the JD terminology and priority keywords.',
    ],
    overallMatchScore,
  };
}

function sanitizeAndValidatePayload(payload: DeepDiveAnalysisPayload): DeepDiveAnalysisPayload {
  return {
    vibeCheck: {
      jdStyle: payload?.vibeCheck?.jdStyle || '',
      resumeTone: payload?.vibeCheck?.resumeTone || '',
      vibeMatchScore: Math.max(0, Math.min(100, Number(payload?.vibeCheck?.vibeMatchScore) || 0)),
      toneAdjustmentAdvice: payload?.vibeCheck?.toneAdjustmentAdvice || '',
    },
    gapAnalysis: {
      missingHardSkills: Array.isArray(payload?.gapAnalysis?.missingHardSkills)
        ? payload.gapAnalysis.missingHardSkills
        : [],
      experienceGaps: Array.isArray(payload?.gapAnalysis?.experienceGaps)
        ? payload.gapAnalysis.experienceGaps
        : [],
      theHarshTruth: payload?.gapAnalysis?.theHarshTruth || '',
    },
    actionPlan: Array.isArray(payload?.actionPlan) ? payload.actionPlan : [],
    overallMatchScore: Math.max(0, Math.min(100, Number(payload?.overallMatchScore) || 0)),
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
      // If no Gemini key then fallback
      if (!process.env.GEMINI_API_KEY) {
        throw new Error('Gemini API Key missing');
      }

      let model;
      try {
        model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      } catch {
        model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
      }

      const prompt = `ROLE
You are an expert Technical Recruiter and Career Strategist known for "brutal honesty" and high-level "Culture-Fit" matching.

TASK
Analyze the Job Description and Resume and return ONLY strict valid JSON in this exact shape:

{
  "vibeCheck": {
    "jdStyle": "string",
    "resumeTone": "string",
    "vibeMatchScore": number,
    "toneAdjustmentAdvice": "string"
  },
  "gapAnalysis": {
    "missingHardSkills": ["string"],
    "experienceGaps": ["string"],
    "theHarshTruth": "string"
  },
  "actionPlan": ["string"],
  "overallMatchScore": number
}

CONSTRAINTS
- No conversational filler.
- Be direct and constructive.
- If a missing skill is required, prefix with "CRITICAL:".
- If a missing skill is preferred, prefix with "Preferred:".
- Ensure numbers are between 0 and 100 where applicable.

INPUTS
Job Description:
${jobDescription}

User Resume:
${resumeText}`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();

      // Strip markdown code fences if Gemini wraps its JSON in them
      const cleaned = text.replace(/```(?:json)?\s*/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned) as DeepDiveAnalysisPayload;
      deepDiveAnalysis = sanitizeAndValidatePayload(parsed);

    } catch (aiError: unknown) {
      console.warn("Gemini failed, using fallback.", aiError);
      if (aiError instanceof Error && aiError.message.includes('404')) {
        console.error('ERROR: Gemini API not accessible. Check your API key and that Generative Language API is enabled.');
      }

      deepDiveAnalysis = fallbackAnalysis(resumeText, jobDescription);
    }

    const overallMatchScore = deepDiveAnalysis.overallMatchScore;
    const missingSkills = deepDiveAnalysis.gapAnalysis.missingHardSkills;
    const suggestions = deepDiveAnalysis.actionPlan.join(' ');

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
