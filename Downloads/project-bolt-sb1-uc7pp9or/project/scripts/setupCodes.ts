import { connectToDatabase } from '../src/lib/mongodb';
import { Db } from 'mongodb';

interface ShopCode {
  code: string;
  type: 'regular' | 'top_score';
  description: string;
  expiryDate: Date;
  isActive: boolean;
  createdAt: Date;
}

const codeSchema = {
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
};

async function setupCodes() {
  try {
    const db: Db = await connectToDatabase();
    console.log('Connected to MongoDB');

    // Create codes collection if it doesn't exist
    if (!db.collection('codes')) {
      await db.createCollection('codes', codeSchema);
    }

    const codesCollection = db.collection<ShopCode>('codes');

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
