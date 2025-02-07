import type { APIRoute } from 'astro';
import { connectDB } from '../../../lib/db';
import { Leaderboard } from '../../../models/Leaderboard';
import { User } from '../../../models/User';

export const post: APIRoute = async ({ request }) => {
  try {
    const { nickname, score, supabaseId } = await request.json();

    if (!nickname || score === undefined) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400
      });
    }

    await connectDB();

    // Create or update user
    let user = await User.findOne({ supabaseId });
    if (!user && supabaseId) {
      user = await User.create({
        supabaseId,
        nickname
      });
    }

    // Update all timeframes
    const timeframes: ('daily' | 'weekly' | 'monthly' | 'allTime')[] = ['daily', 'weekly', 'monthly', 'allTime'];
    const gameTypes: ('trivia' | 'trainline')[] = ['trivia'];

    for (const gameType of gameTypes) {
      for (const timeframe of timeframes) {
        let leaderboard = await Leaderboard.findOne({ gameType, timeframe });
        
        if (!leaderboard) {
          leaderboard = new Leaderboard({
            gameType,
            timeframe,
            entries: []
          });
        }

        // Add new entry
        leaderboard.entries.push({
          userId: user?._id,
          supabaseId,
          nickname,
          score,
          gameType,
          timestamp: new Date()
        });

        // Sort entries by score (descending) and limit to top 100
        leaderboard.entries.sort((a, b) => b.score - a.score);
        leaderboard.entries = leaderboard.entries.slice(0, 100);
        
        // Update lastUpdated timestamp
        leaderboard.lastUpdated = new Date();
        
        await leaderboard.save();
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200
    });
  } catch (error) {
    console.error('Error saving score:', error);
    return new Response(JSON.stringify({ error: 'Failed to save score' }), {
      status: 500
    });
  }
};
