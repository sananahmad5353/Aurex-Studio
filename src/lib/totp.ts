/**
 * TOTP (Time-based One-Time Password) implementation for 2FA.
 * Compatible with Google Authenticator, Authy, etc.
 * No external dependencies - pure Node.js crypto.
 */
import { createHmac } from 'crypto';

const TOTP_PERIOD = 30; // 30-second time step
const TOTP_DIGITS = 6;
const TOTP_ALGORITHM = 'sha1';

// Base32 alphabet
const BASE32_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

/**
 * Generate a random base32-encoded secret for TOTP.
 */
export function generateTOTPSecret(length = 20): string {
  const bytes = Buffer.alloc(length);
  crypto.getRandomValues(bytes);
  return base32Encode(bytes);
}

/**
 * Encode a buffer to base32 string.
 */
function base32Encode(buffer: Buffer): string {
  let bits = '';
  for (const byte of buffer) {
    bits += byte.toString(2).padStart(8, '0');
  }
  let result = '';
  for (let i = 0; i + 5 <= bits.length; i += 5) {
    const index = parseInt(bits.substring(i, i + 5), 2);
    result += BASE32_CHARS[index];
  }
  return result;
}

/**
 * Get the current TOTP code for a secret.
 */
export function getTOTPCode(secret: string, time?: number): string {
  const epoch = time || Math.floor(Date.now() / 1000);
  const counter = Math.floor(epoch / TOTP_PERIOD);

  // Decode base32 secret to bytes
  const key = base32Decode(secret);

  // Create HMAC
  const counterBuffer = Buffer.alloc(8);
  counterBuffer.writeBigInt64BE(BigInt(counter));

  const hmac = createHmac(TOTP_ALGORITHM, key).update(counterBuffer).digest();

  // Dynamic truncation
  const offset = hmac[hmac.length - 1] & 0x0f;
  const code = (
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff)
  ) % Math.pow(10, TOTP_DIGITS);

  return code.toString().padStart(TOTP_DIGITS, '0');
}

/**
 * Verify a TOTP code against a secret.
 * Allows a 1-step window (30 seconds before/after) for clock drift.
 */
export function verifyTOTPCode(secret: string, code: string): boolean {
  if (!code || code.length !== TOTP_DIGITS) return false;

  const epoch = Math.floor(Date.now() / 1000);
  const counter = Math.floor(epoch / TOTP_PERIOD);

  // Check current, previous, and next counter values
  for (const offset of [-1, 0, 1]) {
    const checkCounter = counter + offset;
    const key = base32Decode(secret);
    const counterBuffer = Buffer.alloc(8);
    counterBuffer.writeBigInt64BE(BigInt(checkCounter));
    const hmac = createHmac(TOTP_ALGORITHM, key).update(counterBuffer).digest();
    const hmacOffset = hmac[hmac.length - 1] & 0x0f;
    const generatedCode = (
      ((hmac[hmacOffset] & 0x7f) << 24) |
      ((hmac[hmacOffset + 1] & 0xff) << 16) |
      ((hmac[hmacOffset + 2] & 0xff) << 8) |
      (hmac[hmacOffset + 3] & 0xff)
    ) % Math.pow(10, TOTP_DIGITS);

    // Constant-time comparison
    const generatedStr = generatedCode.toString().padStart(TOTP_DIGITS, '0');
    if (timingSafeEqualStrings(code, generatedStr)) return true;
  }

  return false;
}

/**
 * Generate otpauth:// URI for QR code scanning.
 */
export function getTOTPUri(secret: string, email: string, issuer = 'Aurex Studio'): string {
  const encodedIssuer = encodeURIComponent(issuer);
  const encodedEmail = encodeURIComponent(email);
  return `otpauth://totp/${encodedIssuer}:${encodedEmail}?secret=${secret}&issuer=${encodedIssuer}&algorithm=${TOTP_ALGORITHM.toUpperCase()}&digits=${TOTP_DIGITS}&period=${TOTP_PERIOD}`;
}

/**
 * Constant-time string comparison to prevent timing attacks.
 */
function timingSafeEqualStrings(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  const bufA = Buffer.from(a, 'utf-8');
  const bufB = Buffer.from(b, 'utf-8');
  try {
    return crypto.subtle.timingSafeEqual(bufA, bufB);
  } catch {
    // Fallback for environments where subtle is not available
    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return result === 0;
  }
}

/**
 * Decode a base32 string to a Buffer.
 */
function base32Decode(str: string): Buffer {
  const cleanStr = str.replace(/=+$/, '').toUpperCase();
  let bits = '';
  for (const char of cleanStr) {
    const index = BASE32_CHARS.indexOf(char);
    if (index === -1) continue;
    bits += index.toString(2).padStart(5, '0');
  }
  const bytes = Buffer.alloc(Math.floor(bits.length / 8));
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(bits.substring(i * 8, i * 8 + 8), 2);
  }
  return bytes;
}