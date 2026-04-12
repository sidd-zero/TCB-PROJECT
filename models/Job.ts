import mongoose, { Schema, Document, models } from 'mongoose';

export interface IJob extends Document {
  title: string;
  description: string;
  createdAt: Date;
}

const JobSchema = new Schema<IJob>({
  title: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default models.Job || mongoose.model<IJob>('Job', JobSchema);
