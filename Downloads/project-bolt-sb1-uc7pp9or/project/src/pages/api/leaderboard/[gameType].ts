import type { APIRoute } from 'astro';
import { connectDB } from '../../../lib/db';
import { Leaderboard } from '../../../models/Leaderboard';

// This is a server-side endpoint
export const GET: APIRoute = async ({ params, request }) => {
  try {
    const { gameType } = params;
    const url = new URL(request.url);
    const timeframe = url.searchParams.get('timeframe') || 'allTime';
    const limit = parseInt(url.searchParams.get('limit') || '10');

    if (!['trivia', 'trainline'].includes(gameType as string)) {
      return new Response(JSON.stringify({ error: 'Invalid game type' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    if (!['daily', 'weekly', 'monthly', 'allTime'].includes(timeframe)) {
      return new Response(JSON.stringify({ error: 'Invalid timeframe' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Connect to MongoDB only on the server side
    await connectDB();

    // Mock data for development
    const mockData = {
      entries: [
        { nickname: "Player 1", score: 1000, timestamp: new Date().toISOString() },
        { nickname: "Player 2", score: 800, timestamp: new Date().toISOString() },
        { nickname: "Player 3", score: 600, timestamp: new Date().toISOString() },
      ],
      lastUpdated: new Date().toISOString()
    };

    return new Response(JSON.stringify(mockData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
