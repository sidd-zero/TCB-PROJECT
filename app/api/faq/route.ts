import { NextResponse } from 'next/server';
import { generateWithFallback } from '@/lib/ai';

type FAQRequestBody = {
  jobDescription: string;
  role?: string;
};

export async function POST(req: Request) {
  try {
    const { jobDescription, role } = (await req.json()) as FAQRequestBody;

    if (!jobDescription) {
      return NextResponse.json({ error: 'Job Description is required' }, { status: 400 });
    }

    const prompt = `### ROLE
You are a Senior HR Recruitment Specialist and Interview Coach. Your goal is to provide 5 standard, frequently asked interview questions based on the provided Job Description (JD).

### CONTEXT
The user is preparing for an interview for a role described in this JD. They need REAL questions that are commonly found on the internet (Glassdoor, LinkedIn, Indeed) for this type of position, NOT creative or AI-generated questions.

### INPUT DATA
- Job Description: ${jobDescription}
${role ? `- Target Role: ${role}` : ''}

### TASK
1. Identify the core role and industry from the JD.
2. Provide 5 standard HR-based interview questions (a mix of behavioral, situational, and technical/role-specific) that are widely considered "industry standard" for this position.
3. For each question, provide a brief "Insight" (the hidden intent behind the question).

### OUTPUT FORMAT (STRICT JSON)
{
  "faq": [
    {
      "question": "string",
      "insight": "string",
      "category": "Behavioral | Technical | Cultural"
    }
  ]
}

### CONSTRAINTS
- Return ONLY the JSON object.
- Questions must feel "authentic" and "standard."
- Avoid complex or overly niche questions unless the JD specifically demands it.
- Ensure the questions are distinct and cover different aspects of the role.`;

    const aiResponse = await generateWithFallback(prompt);

    // Clean JSON response
    const cleaned = aiResponse.replace(/```(?:json)?\s*/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return NextResponse.json(parsed);

  } catch (error: unknown) {
    console.error('FAQ Generation Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error generating FAQ questions' },
      { status: 500 }
    );
  }
}
