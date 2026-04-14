import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Resume from '@/models/Resume';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require('pdf-parse') as (buffer: Buffer) => Promise<{ text: string }>;
const mammoth = require('mammoth');

export async function POST(req: Request) {
  try {
    await dbConnect();

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Convert the File out of formData into a Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let extractedText = '';

    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      // Parse the PDF
      const parsedPdf = await pdfParse(buffer);
      extractedText = parsedPdf.text;
    } else if (
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
      file.name.endsWith('.docx')
    ) {
      // Parse the .docx Word Document
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value;
    } else {
      return NextResponse.json({ error: 'Unsupported file format. Please upload PDF or DOCX.' }, { status: 400 });
    }

    if (!extractedText || extractedText.trim() === '') {
      return NextResponse.json({ error: 'Failed to extract text from the file' }, { status: 400 });
    }

    // Save to database
    const newResume = await Resume.create({
      text: extractedText,
    });

    return NextResponse.json({
      message: 'Resume uploaded and parsed successfully!',
      resumeId: newResume._id,
      textPreview: extractedText.substring(0, 500) + '...',
    });
  } catch (error: unknown) {
    console.error('File Upload Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error processing file' },
      { status: 500 }
    );
  }
}
