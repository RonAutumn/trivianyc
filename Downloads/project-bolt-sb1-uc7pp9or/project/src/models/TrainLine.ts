import mongoose from 'mongoose';

const StopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
  borough: {
    type: String,
    enum: ['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island'],
    required: true,
  },
  transfers: {
    type: [String],
    default: [],
  }
});

const TrainLineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  color: {
    type: String,
    required: true,
  },
  stops: [StopSchema],
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true,
  }
});

export const TrainLine = mongoose.models.TrainLine || mongoose.model('TrainLine', TrainLineSchema);
