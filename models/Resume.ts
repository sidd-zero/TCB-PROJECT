import mongoose, { Schema, Document, models } from 'mongoose';

export interface IResume extends Document {
  text: string;
  uploadDate: Date;
}

const ResumeSchema = new Schema<IResume>({
  text: {
    type: String,
    required: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
});

export default models.Resume || mongoose.model<IResume>('Resume', ResumeSchema);
