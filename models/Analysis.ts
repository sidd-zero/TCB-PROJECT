import mongoose, { Schema, Document, models } from 'mongoose';

export interface IAnalysis extends Document {
  resumeId: mongoose.Types.ObjectId;
  jobDescription: string;
  matchScore: number;
  missingSkills: string[];
  suggestions: string;
  overallMatchScore?: number;
  report?: {
    atsScore: {
      score: number;
      foundKeywords: string[];
      missingKeywords: string[];
      parsingWarnings: string[];
      scoreJustification: string;
    };
    analyzerScore: {
      score: number;
      vibeMatch: string;
      impactRating: string;
      cultureFitSuggestions: string;
      scoreJustification: string;
    };
    overallShortlistProbability: 'High' | 'Medium' | 'Low';
  };
  createdAt: Date;
}

const AnalysisSchema = new Schema<IAnalysis>({
  resumeId: {
    type: Schema.Types.ObjectId,
    ref: 'Resume',
  },
  jobDescription: {
    type: String,
    required: true,
  },
  matchScore: {
    type: Number,
    required: true,
  },
  missingSkills: {
    type: [String],
    default: [],
  },
  suggestions: {
    type: String,
    default: '',
  },
  overallMatchScore: {
    type: Number,
    required: false,
  },
  report: {
    type: Schema.Types.Mixed,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default models.Analysis || mongoose.model<IAnalysis>('Analysis', AnalysisSchema);
