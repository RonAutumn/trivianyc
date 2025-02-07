import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
  },
  correct_answer: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['trains', 'stops', 'culture', 'history'],
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['easy', 'medium', 'hard'],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

export const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);
