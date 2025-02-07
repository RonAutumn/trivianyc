const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const MONGODB_URI = 'mongodb://localhost:27017/subway-trivia';

async function setupCodes() {
  try {
    const db = await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const codesCollection = db.connection.collection('codes');

    // First, deactivate all existing codes
    await codesCollection.updateMany({}, { $set: { isActive: false } });

    // Create regular code
    await codesCollection.insertOne({
      code: 'HHNYC2024',
      type: 'regular',
      description: "Thanks for playing! Here's your code to use in our shop.",
      expiryDate: new Date('2024-12-31'),
      isActive: true,
      createdAt: new Date()
    });

    // Create top score code
    await codesCollection.insertOne({
      code: 'HHNYC2024PRO',
      type: 'top_score',
      description: "Congratulations on your amazing score! Here's your special shop code.",
      expiryDate: new Date('2024-12-31'),
      isActive: true,
      createdAt: new Date()
    });

    console.log('Codes setup completed successfully!');
    await db.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error setting up codes:', error);
    process.exit(1);
  }
}

setupCodes();
