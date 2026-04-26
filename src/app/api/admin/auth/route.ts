import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { checkRateLimit } from '@/lib/rate-limit';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'nsaas-admin-2024';
const COOKIE_NAME = 'nsaas_admin_session';

// POST /api/admin/auth - Login
export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimit = checkRateLimit(`admin-login:${ip}`);

    if (!rateLimit.allowed) {
      const minutes = Math.ceil((rateLimit.resetTime - Date.now()) / 60000);
      return NextResponse.json(
        { 
          error: rateLimit.blocked 
            ? `Too many attempts. Try again in ${minutes} minutes.` 
            : 'Rate limit exceeded. Please slow down.',
          retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000),
        },
        { status: 429 }
      );
    }

    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: 'Password required' },
        { status: 400 }
      );
    }

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { 
          error: 'Invalid password',
          remainingAttempts: rateLimit.remaining,
        },
        { status: 401 }
      );
    }

    // Set session cookie with secure defaults
    const cookieStore = await cookies();
    const isProduction = process.env.NODE_ENV === 'production';
    cookieStore.set(COOKIE_NAME, 'authenticated', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: 60 * 60 * 8, // 8 hours
      path: '/',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/auth - Logout
export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  return NextResponse.json({ success: true });
}

// GET /api/admin/auth - Check auth status
export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME);

  if (session?.value === 'authenticated') {
    return NextResponse.json({ authenticated: true });
  }

  return NextResponse.json(
    { authenticated: false },
    { status: 401 }
  );
}
