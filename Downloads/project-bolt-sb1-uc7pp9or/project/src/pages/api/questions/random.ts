import type { APIRoute } from 'astro';
import { connectDB } from '../../../lib/db';
import { Question } from '../../../models/Question';

export const GET: APIRoute = async () => {
  try {
    await connectDB();
    
    // Get a random question
    const questions = await Question.aggregate([
      { $sample: { size: 1 } }
    ]);

    if (!questions.length) {
      return new Response(JSON.stringify({
        error: 'No questions found'
      }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(questions[0]), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error fetching random question:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error'
    }), {
      status: 500,
    });
  }
};
