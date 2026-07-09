import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIp, RATE_LIMITS } from '@/lib/rate-limit';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const path = url.pathname;

  // Rate limiting - login
  if (path === '/api/auth/login') {
    const ip = getClientIp(request);
    const result = checkRateLimit(`login:${ip}`, RATE_LIMITS.login);
    if (!result.allowed) {
      return NextResponse.json(
        { error: 'Too many login attempts.' },
        { status: 429, headers: { 'Retry-After': String(result.retryAfter) } }
      );
    }
  }

  // Rate limiting - change password
  if (path === '/api/auth/change-password') {
    const ip = getClientIp(request);
    const result = checkRateLimit(`changepw:${ip}`, RATE_LIMITS.changePassword);
    if (!result.allowed) {
      return NextResponse.json(
        { error: 'Too many attempts.' },
        { status: 429, headers: { 'Retry-After': String(result.retryAfter) } }
      );
    }
  }

  // Rate limiting - contact form
  if (path === '/api/contact' && request.method === 'POST') {
    const ip = getClientIp(request);
    const result = checkRateLimit(`contact:${ip}`, RATE_LIMITS.contact);
    if (!result.allowed) {
      return NextResponse.json(
        { error: 'Too many messages.' },
        { status: 429, headers: { 'Retry-After': String(result.retryAfter) } }
      );
    }
  }

  // Rate limiting - 2FA
  if (path.startsWith('/api/auth/2fa')) {
    const ip = getClientIp(request);
    const result = checkRateLimit(`2fa:${ip}`, RATE_LIMITS.twoFactor);
    if (!result.allowed) {
      return NextResponse.json(
        { error: 'Too many 2FA attempts.' },
        { status: 429, headers: { 'Retry-After': String(result.retryAfter) } }
      );
    }
  }

  // Rate limiting - non-GET API
  if (path.startsWith('/api/') && request.method !== 'GET') {
    const ip = getClientIp(request);
    const result = checkRateLimit(`api:${ip}`, RATE_LIMITS.generalApi);
    if (!result.allowed) {
      return NextResponse.json(
        { error: 'Too many requests.' },
        { status: 429, headers: { 'Retry-After': String(result.retryAfter) } }
      );
    }
  }

  // Block sensitive paths
  if (path.startsWith('/prisma') || path === '/api/auth/secret') {
    return new NextResponse(null, { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};