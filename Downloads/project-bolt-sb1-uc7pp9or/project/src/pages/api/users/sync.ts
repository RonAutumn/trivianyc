import type { APIRoute } from 'astro';
import { connectDB } from '../../../lib/db';
import { User } from '../../../models/User';
import { supabase } from '../../../lib/supabase';

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

    await connectDB();

    // Find or create user in MongoDB
    let user = await User.findOne({ supabaseId: supabaseUser.id });
    
    if (!user) {
      // Create new user
      user = await User.create({
        supabaseId: supabaseUser.id,
        email: supabaseUser.email,
        nickname: supabaseUser.user_metadata?.nickname || 'Player',
      });
    } else {
      // Update last login
      user.lastLogin = new Date();
      await user.save();
    }

    return new Response(JSON.stringify({
      user: {
        id: user._id,
        supabaseId: user.supabaseId,
        email: user.email,
        nickname: user.nickname,
        highScores: user.highScores,
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error syncing user:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500
    });
  }
};
