import type { APIRoute } from 'astro';
import { connectDB } from '../../../lib/db';
import { TrainLine } from '../../../models/TrainLine';

export const GET: APIRoute = async ({ url }) => {
  try {
    await connectDB();
    
    const difficulty = url.searchParams.get('difficulty') || 'easy';
    
    // Get a random train line with the specified difficulty
    const trainLines = await TrainLine.aggregate([
      { $match: { difficulty } },
      { $sample: { size: 1 } }
    ]);

    if (!trainLines.length) {
      return new Response(JSON.stringify({
        error: 'No train lines found'
      }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(trainLines[0]), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error fetching random train line:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error'
    }), {
      status: 500,
    });
  }
};
