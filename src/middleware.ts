import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIp, RATE_LIMITS } from '@/lib/rate-limit';

const MAX_BODY_SIZE = 1 * 1024 * 1024;

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const url = request.nextUrl;

  // ===== Rate limiting for login endpoint =====
  if (url.pathname === '/api/auth/login') {
    const ip = getClientIp(request);
    const result = checkRateLimit(`login:${ip}`, RATE_LIMITS.login);
    response.headers.set('X-RateLimit-Remaining', String(result.remaining));
    response.headers.set('X-RateLimit-Reset', String(result.resetAt));
    if (!result.allowed) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(result.retryAfter) } }
      );
    }
  }

  // ===== Rate limiting for change password =====
  if (url.pathname === '/api/auth/change-password') {
    const ip = getClientIp(request);
    const result = checkRateLimit(`changepw:${ip}`, RATE_LIMITS.changePassword);
    response.headers.set('X-RateLimit-Remaining', String(result.remaining));
    response.headers.set('X-RateLimit-Reset', String(result.resetAt));
    if (!result.allowed) {
      return NextResponse.json(
        { error: 'Too many password change attempts. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(result.retryAfter) } }
      );
    }
  }

  // ===== Rate limiting for contact form =====
  if (url.pathname === '/api/contact' && request.method === 'POST') {
    const ip = getClientIp(request);
    const result = checkRateLimit(`contact:${ip}`, RATE_LIMITS.contact);
    response.headers.set('X-RateLimit-Remaining', String(result.remaining));
    response.headers.set('X-RateLimit-Reset', String(result.resetAt));
    if (!result.allowed) {
      return NextResponse.json(
        { error: 'Too many messages. Please wait before sending another.' },
        { status: 429, headers: { 'Retry-After': String(result.retryAfter) } }
      );
    }
  }

  // ===== Rate limiting for 2FA endpoints =====
  if (url.pathname.startsWith('/api/auth/2fa')) {
    const ip = getClientIp(request);
    const result = checkRateLimit(`2fa:${ip}`, RATE_LIMITS.twoFactor);
    response.headers.set('X-RateLimit-Remaining', String(result.remaining));
    response.headers.set('X-RateLimit-Reset', String(result.resetAt));
    if (!result.allowed) {
      return NextResponse.json(
        { error: 'Too many 2FA attempts. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(result.retryAfter) } }
      );
    }
  }

  // ===== General API rate limiting =====
  if (url.pathname.startsWith('/api/') && request.method !== 'GET') {
    const ip = getClientIp(request);
    const result = checkRateLimit(`api:${ip}`, RATE_LIMITS.generalApi);
    response.headers.set('X-RateLimit-Remaining', String(result.remaining));
    response.headers.set('X-RateLimit-Reset', String(result.resetAt));
    if (!result.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please slow down.' },
        { status: 429, headers: { 'Retry-After': String(result.retryAfter) } }
      );
    }
  }

  // ===== Block access to sensitive files =====
  const sensitivePaths = ['/prisma/', '.env', '.db', '.sqlite', '/api/auth/secret'];
  const pathLower = url.pathname.toLowerCase();
  for (const sensitive of sensitivePaths) {
    if (pathLower.includes(sensitive)) {
      return new NextResponse(null, { status: 404 });
    }
  }

  // ===== Request size validation =====
  const contentLength = request.headers.get('content-length');
  if (contentLength) {
    const size = parseInt(contentLength, 10);
    if (size > MAX_BODY_SIZE) {
      return NextResponse.json({ error: 'Request body too large' }, { status: 413 });
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};