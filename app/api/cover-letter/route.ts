import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dbConnect from '@/lib/mongodb';
import Resume from '@/models/Resume';

type CoverLetterRequestBody = {
  resumeId?: string;
  jobDescription?: string;
};

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { resumeId, jobDescription } = (await req.json()) as CoverLetterRequestBody;

    if (!resumeId || !jobDescription) {
      return NextResponse.json(
        { error: 'Resume ID and Job Description are required' },
        { status: 400 }
      );
    }

    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        coverLetter: `[Fallback Mode: Missing Gemini Key]\n\nDear Hiring Manager,\n\nI am writing to express my interest in the position described in the provided job description.\n\nBased on my resume, I believe I have the skills and experience necessary to succeed in this role. Although an AI-generated letter could not be produced, I look forward to discussing my qualifications with you in an interview.\n\nSincerely,\n[Your Name]`,
      });
    }

    let model;
    try {
      model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    } catch {
      model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
    }

    const prompt = `Write a professional and tailored cover letter based on the following job description and resume.
Keep it concise, modern, and engaging. Avoid robotic language.

Job Description:
${jobDescription}

Resume:
${resume.text}`;

    const result = await model.generateContent(prompt);
    const coverLetter = result.response.text() || 'Could not generate cover letter.';

    return NextResponse.json({ coverLetter });
  } catch (error: unknown) {
    console.error('Cover Letter Gen Error:', error);
    const message = error instanceof Error ? error.message : 'Error generating cover letter';

    if (message.includes('404') && message.includes('Not Found')) {
      return NextResponse.json(
        {
          error:
            'Gemini API not accessible. Check: 1) API key is valid 2) Generative Language API is enabled 3) You have quota available',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
