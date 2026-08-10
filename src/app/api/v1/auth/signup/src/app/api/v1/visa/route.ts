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

// Fetch all active visa options
export async function GET() {
  try {
    const env = getRequestContext().env;
    const db = env.DB;

    const { results } = await db.prepare(
      'SELECT * FROM visa_catalog WHERE status = "active" ORDER BY created_at DESC'
    ).all();

    return Response.json(
      { success: true, count: results.length, data: results },
      { status: 200, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  } catch (err: any) {
    return Response.json(
      { success: false, error: err.message || 'Internal Server Error' },
      { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  }
}

// Add/Update a visa service centrally
export async function POST(request: Request) {
  try {
    const { country, visa_type, price, processing_time, requirements = [] } = await request.json();

    if (!country || !visa_type || !price) {
      return Response.json(
        { success: false, error: 'Missing country, visa_type, or price' },
        { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    const env = getRequestContext().env;
    const db = env.DB;
    const visaId = crypto.randomUUID();

    await db.prepare(
      'INSERT INTO visa_catalog (id, country, visa_type, price, processing_time, requirements) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(visaId, country, visa_type, price, processing_time, JSON.stringify(requirements)).run();

    return Response.json(
      { success: true, message: 'Visa service created successfully', id: visaId },
      { status: 201, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  } catch (err: any) {
    return Response.json(
      { success: false, error: err.message || 'Internal Server Error' },
      { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  }
}
