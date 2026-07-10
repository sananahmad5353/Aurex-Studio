import { pbkdf2Sync, randomBytes, createHmac, timingSafeEqual } from 'crypto';

const ITERATIONS = 600000; // Increased from 100K to OWASP 2023 recommendation
const KEY_LENGTH = 64;
const DIGEST = 'sha512';

// Token configuration
const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours
const HMAC_SECRET = process.env.AUTH_SECRET || randomBytes(32).toString('hex');

/**
 * Hash a password using PBKDF2 with high iterations.
 * Format: salt:hash (both hex-encoded)
 */
export function hashPassword(password: string): string {
  const salt = randomBytes(32).toString('hex'); // Increased from 16 to 32 bytes
  const hash = pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST).toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Verify a password against a stored hash.
 * Uses constant-time comparison to prevent timing attacks.
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, hash] = storedHash.split(':');
  if (!salt || !hash) return false;
  const verifyHash = pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST).toString('hex');
  try {
    return timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(verifyHash, 'hex'));
  } catch {
    return false;
  }
}

interface TokenPayload {
  adminId: string;
  email: string;
  createdAt: number;
  expiresAt: number;
}

/**
 * Create an HMAC-signed authentication token.
 * Token format: base64(payload).base64(signature)
 */
export function createAuthToken(adminId: string, email: string): string {
  const now = Date.now();
  const payload: TokenPayload = {
    adminId,
    email,
    createdAt: now,
    expiresAt: now + TOKEN_EXPIRY_MS,
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = createHmac('sha256', HMAC_SECRET).update(payloadB64).digest('base64url');
  return `${payloadB64}.${signature}`;
}

/**
 * Verify and decode an authentication token.
 * Returns null if token is invalid, expired, or tampered.
 */
export function verifyAuthToken(token: string): TokenPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;

    const [payloadB64, signature] = parts;

    // Verify HMAC signature using timing-safe comparison
    const expectedSig = createHmac('sha256', HMAC_SECRET).update(payloadB64).digest('base64url');
    try {
      if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) return null;
    } catch {
      return null;
    }

    // Decode payload
    const payload: TokenPayload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf-8'));

    // Check expiration
    if (Date.now() > payload.expiresAt) return null;

    // Validate required fields
    if (!payload.adminId || !payload.email) return null;

    return payload;
  } catch {
    return null;
  }
}

/**
 * Extract and verify auth token from request headers.
 * Returns null if unauthorized.
 */
export function extractAuthFromRequest(request: Request): TokenPayload | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.slice(7).trim();
  return verifyAuthToken(token);
}

/**
 * Check if a password meets minimum strength requirements.
 */
export function isPasswordStrong(password: string): { strong: boolean; issues: string[] } {
  const issues: string[] = [];
  if (password.length < 8) issues.push('At least 8 characters');
  if (!/[A-Z]/.test(password)) issues.push('At least one uppercase letter');
  if (!/[a-z]/.test(password)) issues.push('At least one lowercase letter');
  if (!/[0-9]/.test(password)) issues.push('At least one number');
  if (!/[^A-Za-z0-9]/.test(password)) issues.push('At least one special character');
  return { strong: issues.length === 0, issues };
}