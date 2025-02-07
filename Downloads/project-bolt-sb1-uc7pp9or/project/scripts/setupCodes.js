import { connectToDatabase } from '../src/lib/mongodb.ts';

const codeSchema = {
  code: { type: String, required: true },
  type: { type: String, enum: ['regular', 'top_score'], required: true },
  description: { type: String, required: true },
  expiryDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
};

async function setupCodes() {
  try {
    const db = await connectToDatabase();
    console.log('Connected to MongoDB');

    // Create codes collection if it doesn't exist
    if (!db.collection('codes')) {
      await db.createCollection('codes', {
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['code', 'type', 'description', 'expiryDate', 'isActive'],
            properties: {
              code: { bsonType: 'string' },
              type: { enum: ['regular', 'top_score'] },
              description: { bsonType: 'string' },
              expiryDate: { bsonType: 'date' },
              isActive: { bsonType: 'bool' },
              createdAt: { bsonType: 'date' }
            }
          }
        }
      });
    }

    const codesCollection = db.collection('codes');

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
    process.exit(0);
  } catch (error) {
    console.error('Error setting up codes:', error);
    process.exit(1);
  }
}

setupCodes();
