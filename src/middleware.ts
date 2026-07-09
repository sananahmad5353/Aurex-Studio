import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory rate limiter (no external imports)
const limits: Record<string, { count: number; resetAt: number }> = {};

function isRateLimited(key: string, maxReq: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = limits[key];
  if (!entry || now > entry.resetAt) {
    limits[key] = { count: 1, resetAt: now + windowMs };
    return false;
  }
  entry.count++;
  return entry.count > maxReq;
}

function getClientIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown';
}

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Only rate-limit POST/PUT/DELETE API routes
  if (path.startsWith('/api/') && request.method !== 'GET') {
    const ip = getClientIp(request);
    if (isRateLimited(`api:${ip}`, 30, 60000)) {
      return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });
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