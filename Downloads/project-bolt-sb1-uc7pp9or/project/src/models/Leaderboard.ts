import mongoose from 'mongoose';

const LeaderboardEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  supabaseId: {
    type: String,
    required: true
  },
  nickname: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  gameType: {
    type: String,
    enum: ['trivia', 'trainline'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const LeaderboardSchema = new mongoose.Schema({
  gameType: {
    type: String,
    enum: ['trivia', 'trainline'],
    required: true
  },
  timeframe: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'allTime'],
    required: true
  },
  entries: [LeaderboardEntrySchema],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Compound index for quick lookups
LeaderboardSchema.index({ gameType: 1, timeframe: 1 });

export const Leaderboard = mongoose.models.Leaderboard || mongoose.model('Leaderboard', LeaderboardSchema);
