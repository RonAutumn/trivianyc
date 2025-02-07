import { connectDB } from '../src/lib/db';
import { Question } from '../src/models/Question';

const questions = [
  {
    question: 'Which subway line runs along 7th Avenue in Manhattan?',
    options: ['1 Train', '2 Train', '3 Train', 'All of the above'],
    correct_answer: 'All of the above',
    category: 'trains',
    difficulty: 'medium'
  },
  {
    question: 'What year did the NYC subway system open?',
    options: ['1894', '1904', '1914', '1924'],
    correct_answer: '1904',
    category: 'history',
    difficulty: 'easy'
  },
  {
    question: 'Which is the longest subway line in the NYC system?',
    options: ['A Train', '7 Train', 'F Train', 'N Train'],
    correct_answer: 'A Train',
    category: 'trains',
    difficulty: 'medium'
  },
  {
    question: 'What is the busiest subway station in NYC?',
    options: [
      'Times Square-42nd Street',
      'Grand Central-42nd Street',
      'Herald Square',
      'Union Square'
    ],
    correct_answer: 'Times Square-42nd Street',
    category: 'stops',
    difficulty: 'easy'
  },
  {
    question: 'Which NYC subway station has the deepest platform?',
    options: [
      '191st Street',
      '181st Street',
      'Clark Street',
      'Roosevelt Island'
    ],
    correct_answer: '191st Street',
    category: 'stops',
    difficulty: 'hard'
  },
  {
    question: 'What does the letter "L" stand for in the L train?',
    options: [
      'Local',
      'Lower',
      '14th Street-Canarsie',
      'Limited'
    ],
    correct_answer: '14th Street-Canarsie',
    category: 'trains',
    difficulty: 'hard'
  },
  {
    question: 'Which famous artist created the "Life Underground" bronze sculptures in the 14th Street station?',
    options: [
      'Tom Otterness',
      'Keith Haring',
      'Jean-Michel Basquiat',
      'Roy Lichtenstein'
    ],
    correct_answer: 'Tom Otterness',
    category: 'culture',
    difficulty: 'medium'
  },
  {
    question: 'What was the original fare when the NYC subway opened?',
    options: [
      '5 cents',
      '10 cents',
      '15 cents',
      '25 cents'
    ],
    correct_answer: '5 cents',
    category: 'history',
    difficulty: 'medium'
  },
  {
    question: 'Which subway line is known as "The International Express"?',
    options: [
      '7 Train',
      'F Train',
      'Q Train',
      'N Train'
    ],
    correct_answer: '7 Train',
    category: 'culture',
    difficulty: 'medium'
  },
  {
    question: 'What is unique about the Franklin Avenue Shuttle (S)?',
    options: [
      'It's the shortest line',
      'It only runs in Brooklyn',
      'Both A and B',
      'It runs 24/7'
    ],
    correct_answer: 'Both A and B',
    category: 'trains',
    difficulty: 'hard'
  },
  {
    question: 'Level 1: Arrange these three 4 train stops in order from north to south',
    options: ['Bedford Park Blvd', 'Woodlawn', 'Mosholu Parkway'],
    correct_answer: 'Woodlawn, Bedford Park Blvd, Mosholu Parkway',
    category: 'ordering',
    difficulty: 'easy'
  },
  {
    question: 'Level 2: Arrange these four L train stops from west to east',
    options: ['8 Av', '3 Av', '14 St–Union Sq', '6 Av'],
    correct_answer: '8 Av, 6 Av, 14 St–Union Sq, 3 Av',
    category: 'ordering',
    difficulty: 'medium'
  },
  {
    question: 'Level 3: Arrange these F train stations from north to south',
    options: ['42 St–Bryant Pk', '34 St–Herald Sq', '23 St', '14 St'],
    correct_answer: '42 St–Bryant Pk, 34 St–Herald Sq, 23 St, 14 St',
    category: 'ordering',
    difficulty: 'medium'
  },
  {
    question: 'Level 4: Arrange these A train stations from south to north',
    options: ['125 St', '145 St', '168 St', '175 St', '181 St'],
    correct_answer: '125 St, 145 St, 168 St, 175 St, 181 St',
    category: 'ordering',
    difficulty: 'hard'
  },
  {
    question: 'Level 5: Arrange these 2 train stops from north to south',
    options: ['Wakefield–241 St', 'Nereid Av', '233 St', '225 St', '219 St'],
    correct_answer: 'Wakefield–241 St, Nereid Av, 233 St, 225 St, 219 St',
    category: 'ordering',
    difficulty: 'hard'
  },
  {
    question: 'Level 6: Arrange these 1 train stations from south to north',
    options: ['125 St', '137 St–City College', '145 St', '157 St', '168 St', '181 St'],
    correct_answer: '125 St, 137 St–City College, 145 St, 157 St, 168 St, 181 St',
    category: 'ordering',
    difficulty: 'hard'
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();
    
    // Clear existing questions
    await Question.deleteMany({});
    
    // Insert new questions
    await Question.insertMany(questions);
    
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
