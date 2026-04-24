import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Resume from '@/models/Resume';
import { generateWithFallback } from '@/lib/ai';

type CoverLetterRequestBody = {
  resumeId?: string;
  jobDescription?: string;
};



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

    const prompt = `Write a professional and tailored cover letter based on the following job description and resume.
Keep it concise, modern, and engaging. Avoid robotic language.

Job Description:
${jobDescription}

Resume:
${resume.text}`;

    const coverLetter = await generateWithFallback(prompt);

    return NextResponse.json({ coverLetter });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error generating cover letter';
    
    return NextResponse.json(
      { 
        error: message,
        details: 'If you see 404, ensure Gemini API is enabled in Google Cloud Console. If you see 503, the model is overloaded.',
        recommendation: 'Try restarting your dev server or checking your API Key in .env.local.'
      }, 
      { status: 500 }
    );
  }
}
