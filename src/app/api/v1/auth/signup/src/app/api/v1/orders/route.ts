import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// Create order from any project
export async function POST(request: Request) {
  try {
    const { user_id, visa_id, amount, project_source = 'external' } = await request.json();

    if (!user_id || !visa_id || !amount) {
      return Response.json(
        { success: false, error: 'Missing user_id, visa_id, or amount' },
        { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    const env = getRequestContext().env;
    const db = env.DB;
    const orderId = crypto.randomUUID();

    await db.prepare(
      'INSERT INTO orders (id, user_id, visa_id, amount, project_source) VALUES (?, ?, ?, ?, ?)'
    ).bind(orderId, user_id, visa_id, amount, project_source).run();

    return Response.json(
      { success: true, message: 'Order created centrally', order_id: orderId },
      { status: 201, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  } catch (err: any) {
    return Response.json(
      { success: false, error: err.message || 'Internal Server Error' },
      { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  }
}
