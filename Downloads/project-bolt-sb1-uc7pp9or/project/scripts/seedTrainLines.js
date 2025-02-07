import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '..', '.env');

dotenv.config({ path: envPath });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/subway-trivia';

// Define schemas
const StopSchema = new mongoose.Schema({
  name: String,
  order: Number,
  borough: String,
  transfers: [String]
});

const TrainLineSchema = new mongoose.Schema({
  name: String,
  color: String,
  stops: [StopSchema],
  difficulty: String
});

const TrainLine = mongoose.models.TrainLine || mongoose.model('TrainLine', TrainLineSchema);

const trainLines = [
  {
    name: '1',
    color: '#EE352E',
    difficulty: 'easy',
    stops: [
      { name: 'South Ferry', order: 1, borough: 'Manhattan', transfers: ['R', 'W'] },
      { name: 'Rector Street', order: 2, borough: 'Manhattan', transfers: [] },
      { name: 'Cortlandt Street', order: 3, borough: 'Manhattan', transfers: ['R', 'W'] },
      { name: 'Chambers Street', order: 4, borough: 'Manhattan', transfers: ['2', '3', 'A', 'C'] },
      { name: '14th Street', order: 5, borough: 'Manhattan', transfers: ['F', 'L', 'M'] },
      { name: '34th Street-Penn Station', order: 6, borough: 'Manhattan', transfers: ['2', '3', 'A', 'C', 'E'] }
    ]
  },
  {
    name: 'L',
    color: '#A7A9AC',
    difficulty: 'medium',
    stops: [
      { name: '8th Avenue', order: 1, borough: 'Manhattan', transfers: ['A', 'C', 'E'] },
      { name: '6th Avenue', order: 2, borough: 'Manhattan', transfers: ['F', 'M'] },
      { name: 'Union Square', order: 3, borough: 'Manhattan', transfers: ['4', '5', '6', 'N', 'Q', 'R', 'W'] },
      { name: '1st Avenue', order: 4, borough: 'Manhattan', transfers: [] },
      { name: 'Bedford Avenue', order: 5, borough: 'Brooklyn', transfers: [] },
      { name: 'Lorimer Street', order: 6, borough: 'Brooklyn', transfers: ['G'] }
    ]
  },
  {
    name: '7',
    color: '#B933AD',
    difficulty: 'hard',
    stops: [
      { name: '34th Street-Hudson Yards', order: 1, borough: 'Manhattan', transfers: [] },
      { name: 'Times Square', order: 2, borough: 'Manhattan', transfers: ['1', '2', '3', 'A', 'C', 'E', 'N', 'Q', 'R', 'W'] },
      { name: '5th Avenue', order: 3, borough: 'Manhattan', transfers: [] },
      { name: 'Grand Central', order: 4, borough: 'Manhattan', transfers: ['4', '5', '6', 'S'] },
      { name: 'Court Square', order: 5, borough: 'Queens', transfers: ['E', 'G', 'M'] },
      { name: 'Queensboro Plaza', order: 6, borough: 'Queens', transfers: ['N', 'W'] },
      { name: 'Flushing-Main Street', order: 7, borough: 'Queens', transfers: [] }
    ]
  }
];

async function seedTrainLines() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully');
    
    console.log('Clearing existing train lines...');
    await TrainLine.deleteMany({});
    
    console.log('Adding new train lines...');
    await TrainLine.insertMany(trainLines);
    
    console.log('Train lines seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding train lines:', error);
    process.exit(1);
  }
}

seedTrainLines();
