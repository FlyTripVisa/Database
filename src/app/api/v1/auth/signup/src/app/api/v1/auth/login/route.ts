import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

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
    const { email, password_hash } = await request.json();

    if (!email || !password_hash) {
      return Response.json(
        { success: false, error: 'Email and password_hash are required' },
        { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    const env = getRequestContext().env;
    const db = env.DB;

    // Fetch user from central DB
    const user = await db.prepare(
      'SELECT id, name, email, password_hash, role, metadata FROM users WHERE email = ?'
    ).bind(email).first();

    if (!user || user.password_hash !== password_hash) {
      return Response.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    return Response.json(
      {
        success: true,
        message: 'Authentication successful',
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          metadata: JSON.parse((user.metadata as string) || '{}')
        }
      },
      { status: 200, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  } catch (err: any) {
    return Response.json(
      { success: false, error: err.message || 'Internal Server Error' },
      { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  }
}
