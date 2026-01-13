import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Simple in-memory rate limiter for edge runtime (resets on cold start)
// For production at scale, consider Upstash Redis
const loginAttempts = new Map<string, { count: number; resetTime: number }>();
const LOGIN_RATE_LIMIT = { maxAttempts: 5, windowMs: 15 * 60 * 1000 }; // 5 attempts per 15 min

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  const realIP = request.headers.get('x-real-ip');
  if (realIP) return realIP.trim();
  return 'unknown';
}

function checkLoginRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = loginAttempts.get(ip);

  if (!entry || entry.resetTime < now) {
    loginAttempts.set(ip, { count: 1, resetTime: now + LOGIN_RATE_LIMIT.windowMs });
    return { allowed: true, remaining: LOGIN_RATE_LIMIT.maxAttempts - 1 };
  }

  if (entry.count >= LOGIN_RATE_LIMIT.maxAttempts) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: LOGIN_RATE_LIMIT.maxAttempts - entry.count };
}

export async function middleware(request: NextRequest) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next({ request });
  }

  // Rate limit login POST requests
  if (request.nextUrl.pathname === '/admin/login' && request.method === 'POST') {
    const ip = getClientIP(request);
    const { allowed, remaining } = checkLoginRateLimit(ip);

    if (!allowed) {
      return new NextResponse(
        JSON.stringify({ error: 'Too many login attempts. Please try again later.' }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '900', // 15 minutes
          }
        }
      );
    }

    // Add rate limit headers to response
    const response = NextResponse.next({ request });
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    return response;
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
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
    }
  );

  // Refresh session if expired
  let user = null;
  try {
    const {
      data: { user: fetchedUser },
    } = await supabase.auth.getUser();
    user = fetchedUser;
  } catch (error) {
    console.warn('Supabase auth refresh failed:', error);
  }

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Allow access to login page and unauthorized page
    if (request.nextUrl.pathname === '/admin/login' || request.nextUrl.pathname === '/admin/unauthorized') {
      // If already logged in, redirect to admin dashboard
      if (user) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      return supabaseResponse;
    }

    // All other admin routes require authentication
    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // SECURITY: Verify admin role in middleware for defense-in-depth
    // Note: The admin layout also checks this, but middleware provides an additional layer
    const { data: isAdmin } = await supabase.rpc('is_admin');
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/admin/unauthorized', request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
