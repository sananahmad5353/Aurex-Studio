import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIp, RATE_LIMITS } from '@/lib/rate-limit';

// Maximum request body size (1MB for most, 10MB for specific)
const MAX_BODY_SIZE = 1 * 1024 * 1024;

/**
 * Build security response headers.
 * These are applied to every response.
 */
function getSecurityHeaders(): Record<string, string> {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
    'X-Permitted-Cross-Domain-Policies': 'none',
    'X-Download-Options': 'noopen',
    'X-DNS-Prefetch-Control': 'on',
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    'Surrogate-Control': 'no-store',
    // HSTS - Force HTTPS (1 year, include subdomains)
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  };
}

/**
 * Build Content Security Policy header.
 * Allows specific sources for scripts, styles, images, etc.
 */
function getContentSecurityPolicy(nonce: string): string {
  return [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com`,
    `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
    `img-src 'self' data: blob: https://images.unsplash.com https://sfile.chatglm.cn https://*.unsplash.com https://wa.me https://api.qrserver.com`,
    `font-src 'self' https://fonts.gstatic.com data:`,
    `connect-src 'self' https://images.unsplash.com https://sfile.chatglm.cn https://api.stripe.com`,
    `frame-src https://www.instagram.com https://www.tiktok.com https://www.youtube.com`,
    `media-src https://www.instagram.com https://www.tiktok.com https://*.cdninstagram.com`,
    `base-uri 'self'`,
    `form-action 'self' https://wa.me`,
    `frame-ancestors 'none'`,
    `object-src 'none'`,
    `require-trusted-types-for 'script'`,
  ].join('; ');
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const url = request.nextUrl;

  // ===== Apply Security Headers to all responses =====
  const securityHeaders = getSecurityHeaders();
  for (const [key, value] of Object.entries(securityHeaders)) {
    response.headers.set(key, value);
  }

  // ===== Content Security Policy =====
  const nonce = Buffer.from(Array.from({ length: 16 }, () => Math.floor(Math.random() * 256))).toString('base64');
  response.headers.set('Content-Security-Policy', getContentSecurityPolicy(nonce));
  response.headers.set('x-nonce', nonce);

  // ===== Remove server info headers =====
  response.headers.delete('x-powered-by');
  response.headers.delete('X-Powered-By');

  // ===== Rate limiting for login endpoint =====
  if (url.pathname === '/api/auth/login') {
    const ip = getClientIp(request);
    const result = checkRateLimit(`login:${ip}`, RATE_LIMITS.login);

    response.headers.set('X-RateLimit-Remaining', String(result.remaining));
    response.headers.set('X-RateLimit-Reset', String(result.resetAt));

    if (!result.allowed) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(result.retryAfter),
            ...securityHeaders,
          },
        }
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
        {
          status: 429,
          headers: { 'Retry-After': String(result.retryAfter), ...securityHeaders },
        }
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
        {
          status: 429,
          headers: { 'Retry-After': String(result.retryAfter), ...securityHeaders },
        }
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
        {
          status: 429,
          headers: { 'Retry-After': String(result.retryAfter), ...securityHeaders },
        }
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
        {
          status: 429,
          headers: { 'Retry-After': String(result.retryAfter), ...securityHeaders },
        }
      );
    }
  }

  // ===== Block access to sensitive files =====
  const sensitivePaths = [
    '/prisma/', '.env', '.db', '.sqlite', '/api/auth/secret',
  ];
  const pathLower = url.pathname.toLowerCase();
  for (const sensitive of sensitivePaths) {
    if (pathLower.includes(sensitive)) {
      return new NextResponse(null, { status: 404 });
    }
  }

  // ===== Request size validation for POST/PUT =====
  const contentLength = request.headers.get('content-length');
  if (contentLength) {
    const size = parseInt(contentLength, 10);
    if (size > MAX_BODY_SIZE) {
      return NextResponse.json(
        { error: 'Request body too large' },
        { status: 413, headers: securityHeaders }
      );
    }
  }

  return response;
}

export const config = {
  matcher: [
    // Match all API routes and pages, but skip static files and _next internals
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};