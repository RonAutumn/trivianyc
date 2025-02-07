import type { APIRoute } from 'astro';
import { getLeaderboard } from '../../lib/leaderboard';
import { connectDB } from '../../lib/db';

export const GET: APIRoute = async () => {
  try {
    await connectDB();
    const leaderboard = await getLeaderboard();
    
    return new Response(JSON.stringify(leaderboard), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch leaderboard' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
