import type { APIRoute } from 'astro';
import { connectDB } from '../../../lib/db';
import { User } from '../../../models/User';
import { supabase } from '../../../lib/supabase';
import { updateLeaderboards } from '../../../lib/leaderboard';

export const post: APIRoute = async ({ request }) => {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401
      });
    }

    // Verify the Supabase token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user: supabaseUser }, error } = await supabase.auth.getUser(token);

    if (error || !supabaseUser) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401
      });
    }

    const body = await request.json();
    const { gameType, score } = body;

    if (!gameType || score === undefined) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400
      });
    }

    await connectDB();

    // Find user and update scores
    const user = await User.findOne({ supabaseId: supabaseUser.id });
    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404
      });
    }

    // Add new score
    user.scores.push({
      gameType,
      score,
      timestamp: new Date()
    });

    // Update high score if necessary
    if (score > user.highScores[gameType]) {
      user.highScores[gameType] = score;
    }

    await user.save();

    // Update leaderboards
    await updateLeaderboards({
      userId: user._id,
      supabaseId: user.supabaseId,
      nickname: user.nickname,
      score,
      gameType
    });

    return new Response(JSON.stringify({
      success: true,
      highScores: user.highScores
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error updating score:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500
    });
  }
};
