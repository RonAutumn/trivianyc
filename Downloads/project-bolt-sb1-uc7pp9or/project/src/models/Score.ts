import mongoose from 'mongoose';

export interface Score {
  nickname: string;
  score: number;
  gameType: 'trivia';
  timestamp: Date;
  supabaseId?: string;  // Optional, for registered users
}

const ScoreSchema = new mongoose.Schema<Score>({
  nickname: {
    type: String,
    required: true,
    index: true
  },
  score: {
    type: Number,
    required: true,
    index: true
  },
  gameType: {
    type: String,
    enum: ['trivia'],
    required: true,
    default: 'trivia'
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  supabaseId: {
    type: String,
    sparse: true,
    index: true
  }
});

// Create compound indexes for efficient queries
ScoreSchema.index({ score: -1, timestamp: -1 });
ScoreSchema.index({ supabaseId: 1, score: -1 });

export const ScoreModel = mongoose.models.Score || mongoose.model<Score>('Score', ScoreSchema);
