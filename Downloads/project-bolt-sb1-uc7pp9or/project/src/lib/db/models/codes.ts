import mongoose from 'mongoose';

const codeSchema = new mongoose.Schema({
  code: { type: String, required: true },
  type: { type: String, enum: ['regular', 'top_score'], required: true },
  description: { type: String, required: true },
  expiryDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export const Code = mongoose.models.Code || mongoose.model('Code', codeSchema);
