---
Task ID: 1
Agent: Main Agent
Task: Implement comprehensive security features for Aurex Studio website

Work Log:
- Reviewed entire codebase: schema, auth, API routes, admin panel, components
- Created /src/lib/rate-limit.ts: In-memory sliding-window rate limiter with configurable limits per endpoint
- Created /src/lib/validate.ts: Input sanitization (XSS prevention), email/URL/phone validators, contact/login/password form validators
- Created /src/lib/totp.ts: Pure Node.js TOTP implementation (no external deps) with QR code URI generation, timing-safe comparisons
- Created /src/lib/admin-auth.ts: Centralized admin auth verification helper with requireAdmin() and isValidCuid()
- Rewrote /src/lib/auth.ts: HMAC-signed tokens (payload.signature format), 24h expiry, PBKDF2 increased to 600K iterations, 32-byte salt, timing-safe comparisons, password strength checker
- Created /src/middleware.ts: Rate limiting (login 5/15min, contact 3/min, API 60/min), security headers (HSTS, X-Frame-Options DENY, X-Content-Type-Options, CSP, Referrer-Policy, Permissions-Policy), request size validation, sensitive path blocking (/prisma, .env, .db), nonce-based CSP
- Updated /prisma/schema.prisma: Added 2FA fields (twoFactorEnabled, twoFactorSecret, lastLoginAt, lastLoginIp, failedLoginAttempts, lockedUntil, role) to Admin model
- Created /api/auth/2fa/route.ts: POST setup, PUT verify enable/disable, GET status endpoints
- Rewrote /api/auth/login/route.ts: Input validation, account lockout (5 attempts, 30min lock), 2FA flow (twoFactorRequired response), last login tracking
- Rewrote /api/auth/change-password/route.ts: Centralized auth, password strength validation (8+ chars, uppercase, lowercase, number, special)
- Updated all 7 CRUD API routes (settings, hero-slides, services, testimonials, partners, reels, contact) to use requireAdmin() and input sanitization
- Created /components/website/SecurityGuard.tsx: Client-side protection (disable right-click, text selection, drag-and-drop, copy/cut, Ctrl+C/U/S/A/P/Shift+I/J/C, F12, image drag prevention with MutationObserver)
- Updated /app/layout.tsx: Added SecurityGuard component, cache-control meta tags, robots metadata
- Updated AdminPanel.tsx: Added Security tab with 2FA setup (QR code via api.qrserver.com), verification, disable flow, security features status display; updated login for 2FA code entry; updated password minimum to 8 chars
- Updated next.config.ts: Added security headers config, poweredByHeader:false, QR code API domain in images
- Updated .env: Added AUTH_SECRET for HMAC signing
- Updated db.ts: Disabled query logging in production

Stage Summary:
- All 9 security layers implemented and verified
- Zero lint errors, clean production build
- Security headers confirmed working (X-Frame-Options, HSTS, CSP, X-Content-Type-Options, etc.)
- Auth system verified: correct login returns 200 with HMAC token, wrong password returns 401 with remaining attempts, old base64 tokens rejected
- 2FA optional: QR code setup, TOTP verification, enable/disable flow in admin Security tab