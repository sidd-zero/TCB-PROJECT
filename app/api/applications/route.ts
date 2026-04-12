import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Application from '@/models/Application';

type ApplicationRequestBody = {
  company?: string;
  role?: string;
  status?: 'Applied' | 'Interview' | 'Offer' | 'Rejected';
  matchScore?: number;
  notes?: string;
};

export async function GET() {
  try {
    await dbConnect();
    const applications = await Application.find({}).sort({ date: -1 });
    return NextResponse.json({ applications });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = (await req.json()) as ApplicationRequestBody;
    const { company, role, status, matchScore, notes } = body;

    if (!company || !role) {
      return NextResponse.json({ error: 'Company and role are required' }, { status: 400 });
    }

    const newApplication = await Application.create({
      company,
      role,
      status: status || 'Applied',
      matchScore,
      notes,
    });

    return NextResponse.json({
      message: 'Application tracked successfully',
      application: newApplication,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create application' },
      { status: 500 }
    );
  }
}
