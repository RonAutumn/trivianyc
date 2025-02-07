import type { APIRoute } from 'astro';
import { connectToDatabase } from '../../../lib/mongodb';
import { ScoreModel } from '../../../models/Score';

export const get: APIRoute = async ({ url }) => {
  try {
    await connectToDatabase();
    const params = new URLSearchParams(url.search);
    const score = parseInt(params.get('score') || '0', 10);

    // Count how many scores are higher than this one
    const higherScores = await ScoreModel.countDocuments({
      gameType: 'trivia',
      score: { $gt: score }
    });

    return new Response(JSON.stringify({ rank: higherScores + 1 }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error getting rank:', error);
    return new Response(JSON.stringify({ error: 'Failed to get rank' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
