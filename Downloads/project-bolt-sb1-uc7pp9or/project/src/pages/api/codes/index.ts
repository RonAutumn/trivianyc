import type { APIRoute } from 'astro';
import { connectToDatabase } from '../../../lib/db/mongodb';
import { Code } from '../../../lib/db/models/codes';

export const GET: APIRoute = async ({ request }) => {
  try {
    await connectToDatabase();

    // Get query parameters
    const url = new URL(request.url);
    const type = url.searchParams.get('type') || 'regular';
    const score = parseInt(url.searchParams.get('score') || '0', 10);

    // Get active code based on type
    const query = { type, isActive: true };
    const code = await Code.findOne(query).sort({ createdAt: -1 });

    if (!code) {
      return new Response(JSON.stringify({ error: 'No active codes found' }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({
      code: code.code,
      description: code.description,
      expiryDate: code.expiryDate,
      type: code.type
    }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error fetching code:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }
};
