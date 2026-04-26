import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

const ADMIN_COOKIE = 'nsaas_admin_session';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  let response = NextResponse.next({ request: req });

  // ── Admin routes ────────────────────────────────────────────────────────
  if (pathname.startsWith('/admin')) {
    const adminSession = req.cookies.get(ADMIN_COOKIE);
    if (adminSession?.value !== 'authenticated') {
      const loginUrl = new URL('/login/admin', req.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return response;
  }

  // ── Dashboard routes — require Supabase auth ─────────────────────────
  if (pathname.startsWith('/dashboard')) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return req.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              req.cookies.set(name, value)
            );
            response = NextResponse.next({ request: req });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
  ],
};
