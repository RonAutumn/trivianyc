import mongoose from 'mongoose';

const ScoreSchema = new mongoose.Schema({
  gameType: {
    type: String,
    enum: ['trivia', 'trainline'],
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const UserSchema = new mongoose.Schema({
  supabaseId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  nickname: {
    type: String,
    required: true
  },
  scores: [ScoreSchema],
  highScores: {
    trivia: {
      type: Number,
      default: 0
    },
    trainline: {
      type: Number,
      default: 0
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
});

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
