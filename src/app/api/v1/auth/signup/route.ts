import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

// Handle CORS Preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(request: Request) {
  try {
    const { name, email, password_hash, role = 'user', metadata = {} } = await request.json();

    if (!name || !email || !password_hash) {
      return Response.json(
        { success: false, error: 'Missing required fields: name, email, or password_hash' },
        { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    const env = getRequestContext().env;
    const db = env.DB;

    // Check if user exists
    const existingUser = await db.prepare('SELECT id FROM users WHERE email = ?').bind(email).first();
    if (existingUser) {
      return Response.json(
        { success: false, error: 'User already exists' },
        { status: 409, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    const userId = crypto.randomUUID();
    const metadataString = JSON.stringify(metadata);

    // Insert user into central DB
    await db.prepare(
      'INSERT INTO users (id, name, email, password_hash, role, metadata) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(userId, name, email, password_hash, role, metadataString).run();

    return Response.json(
      {
        success: true,
        message: 'User registered successfully',
        data: { id: userId, name, email, role }
      },
      { status: 201, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  } catch (err: any) {
    return Response.json(
      { success: false, error: err.message || 'Internal Server Error' },
      { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  }
}
