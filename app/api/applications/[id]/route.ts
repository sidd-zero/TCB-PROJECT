import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Application from '@/models/Application';

type ApplicationRouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(req: Request, { params }: ApplicationRouteContext) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    const updatedApplication = await Application.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    );

    if (!updatedApplication) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Application updated',
      application: updatedApplication,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update application' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: ApplicationRouteContext) {
  try {
    await dbConnect();
    const { id } = await params;

    const deleted = await Application.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Application deleted successfully' });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete application' },
      { status: 500 }
    );
  }
}
