import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

// Request Body-এর টাইপ ইন্টারফেস
interface SignupRequestBody {
  name?: string;
  email?: string;
  password_hash?: string;
  role?: string;
  metadata?: Record<string, unknown>;
}

export async function POST(request: Request) {
  try {
    // request.json() কে explicit type casting করা হয়েছে
    const body = (await request.json()) as SignupRequestBody;
    const { name, email, password_hash, role = 'user', metadata = {} } = body;

    if (!name || !email || !password_hash) {
      return Response.json(
        { error: 'Missing required fields: name, email, password_hash' },
        { status: 400 }
      );
    }

    const myDb = getRequestContext().env.DB;

    // ১. চেক করা ইউজার আগে থেকে আছে কিনা
    const existingUser = await myDb
      .prepare('SELECT id FROM users WHERE email = ?1')
      .bind(email)
      .first();

    if (existingUser) {
      return Response.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // ২. নতুন ইউজার ইনসার্ট করা
    const id = crypto.randomUUID();
    const metadataString = JSON.stringify(metadata);

    await myDb
      .prepare(
        'INSERT INTO users (id, name, email, password_hash, role, metadata) VALUES (?1, ?2, ?3, ?4, ?5, ?6)'
      )
      .bind(id, name, email, password_hash, role, metadataString)
      .run();

    return Response.json(
      {
        message: 'User created successfully',
        user: { id, name, email, role }
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Internal Server Error';
    return Response.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
