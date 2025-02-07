import type { APIRoute } from 'astro';
import { connectToDatabase } from '../../lib/mongodb';
import { ScoreModel } from '../../models/Score';

export const post: APIRoute = async ({ request }) => {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { nickname, score, supabaseId } = body;

    // Validate input
    if (!nickname || typeof score !== 'number' || score < 0) {
      return new Response(JSON.stringify({ error: 'Invalid score data' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Create score document
    const scoreDoc = await ScoreModel.create({
      nickname,
      score,
      gameType: 'trivia',
      timestamp: new Date(),
      supabaseId
    });

    return new Response(JSON.stringify({ success: true, score: scoreDoc }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error saving score:', error);
    return new Response(JSON.stringify({ error: 'Failed to save score' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const get: APIRoute = async ({ url }) => {
  try {
    await connectToDatabase();
    const params = new URLSearchParams(url.search);
    const limit = parseInt(params.get('limit') || '100', 10);
    const supabaseId = params.get('supabaseId');

    let query = ScoreModel.find({ gameType: 'trivia' });

    // If supabaseId provided, get user's scores
    if (supabaseId) {
      query = query.find({ supabaseId });
    }

    const scores = await query
      .sort({ score: -1, timestamp: -1 })
      .limit(limit)
      .lean();

    // Add rank to each score
    const scoresWithRank = await Promise.all(scores.map(async (score) => {
      const rank = await ScoreModel.countDocuments({
        gameType: 'trivia',
        score: { $gt: score.score }
      }) + 1;
      return { ...score, rank };
    }));

    return new Response(JSON.stringify({ scores: scoresWithRank }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error getting scores:', error);
    return new Response(JSON.stringify({ error: 'Failed to get scores' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
