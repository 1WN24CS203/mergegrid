import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

function sanitizeSupabaseUrl(url?: string): string {
  if (!url) return '';
  return url.trim().replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const demoSession = request.cookies.get('mergegrid_demo_session')?.value;
  let user = null;

  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabaseUrl = sanitizeSupabaseUrl(rawUrl);
  const supabaseKey = (rawKey || '').trim();

  const isSupabaseConfigured =
    supabaseUrl &&
    !supabaseUrl.includes('placeholder') &&
    supabaseKey &&
    !supabaseKey.includes('placeholder');

  if (isSupabaseConfigured) {
    try {
      const supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            supabaseResponse = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      });

      const { data } = await supabase.auth.getUser();
      user = data.user;
    } catch {
      // Supabase connection error fallback
      user = null;
    }
  }

  const isAuthenticated = Boolean(user || demoSession);

  // Protected routes - redirect to login if not authenticated
  const protectedPaths = [
    '/dashboard',
    '/problems',
    '/contests',
    '/discussions',
    '/opensource',
    '/projects',
    '/placements',
    '/leaderboard',
    '/notifications',
    '/profile',
    '/settings',
  ];

  const isProtected = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (!isAuthenticated && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from auth pages
  const authPaths = ['/login', '/register'];
  const isAuthPage = authPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isAuthenticated && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
