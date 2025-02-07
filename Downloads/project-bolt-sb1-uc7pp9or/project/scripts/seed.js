import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '..', '.env');

dotenv.config({ path: envPath });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/subway-trivia';

// Define Question Schema
const QuestionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correct_answer: String,
  category: {
    type: String,
    enum: ['trains', 'stops', 'culture', 'history', 'ordering'],
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
  },
});

const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

const questions = [
  {
    question: "Which subway lines stop at Times Sq–42 St?",
    options: [
      "1, 2, 3, 7, N, Q, R, W, S",
      "1, 2, 3, 7, N, R, W, S",
      "A, C, E, S",
      "1, 2, 3, 7, N, Q, R, W, E"
    ],
    correct_answer: "1, 2, 3, 7, N, Q, R, W, S",
    category: "stops",
    difficulty: "medium"
  },
  {
    question: "Which subway lines stop at 59 St–Columbus Circle?",
    options: [
      "1, A, B, C, D",
      "1, 2, A, B, C",
      "1, B, C, D, E",
      "1, 2, 3, A, B, C, D"
    ],
    correct_answer: "1, A, B, C, D",
    category: "stops",
    difficulty: "medium"
  },
  {
    question: "Which subway lines stop at 161 St–Yankee Stadium?",
    options: [
      "4, B, D",
      "2, 4, 5",
      "4, B",
      "2, 4, B, D"
    ],
    correct_answer: "4, B, D",
    category: "stops",
    difficulty: "medium"
  },
  {
    question: "Which subway lines stop at East 180 St?",
    options: [
      "2, 4, 5",
      "2, 5",
      "2, 5, 6",
      "2 only"
    ],
    correct_answer: "2, 5",
    category: "stops",
    difficulty: "medium"
  },
  {
    question: "Which subway lines stop at Atlantic Av–Barclays Center?",
    options: [
      "2, 3, 4, 5, B, D, Q, R",
      "2, 3, 4, 5, B, D, N, Q, R",
      "2, 3, 4, 5, A, C, F, R",
      "1, 2, 3, 4, 5, B, N, R"
    ],
    correct_answer: "2, 3, 4, 5, B, D, N, Q, R",
    category: "stops",
    difficulty: "hard"
  },
  {
    question: "Which subway lines stop at Jay St–MetroTech?",
    options: [
      "A, C, F",
      "A, C, F, R",
      "A, C, F, G",
      "A, C, F, N, R"
    ],
    correct_answer: "A, C, F, R",
    category: "stops",
    difficulty: "medium"
  },
  {
    question: "Which subway lines stop at Jackson Hts–Roosevelt Av?",
    options: [
      "E, F, M, R",
      "E, F, M, R, 7",
      "7, N, Q, R",
      "E, F, R, 7"
    ],
    correct_answer: "E, F, M, R, 7",
    category: "stops",
    difficulty: "hard"
  },
  {
    question: "Which subway lines stop at Flushing–Main St?",
    options: [
      "7",
      "7, E",
      "7, M, R",
      "7, LIRR"
    ],
    correct_answer: "7",
    category: "stops",
    difficulty: "easy"
  }
];

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully');
    
    console.log('Clearing existing questions...');
    await Question.deleteMany({});
    
    console.log('Adding new questions...');
    await Question.insertMany(questions);
    
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
