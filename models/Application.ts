import mongoose, { Schema, Document, models } from 'mongoose';

export interface IApplication extends Document {
  company: string;
  role: string;
  status: 'Applied' | 'Interview' | 'Rejected' | 'Offer';
  date: Date;
  matchScore?: number;
  notes?: string;
}

const ApplicationSchema = new Schema<IApplication>({
  company: {
    type: String,
    required: [true, 'Company name is required'],
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
  },
  status: {
    type: String,
    enum: ['Applied', 'Interview', 'Rejected', 'Offer'],
    default: 'Applied',
  },
  date: {
    type: Date,
    default: Date.now,
  },
  matchScore: {
    type: Number,
    required: false,
  },
  notes: {
    type: String,
    required: false,
  },
});

export default models.Application || mongoose.model<IApplication>('Application', ApplicationSchema);
