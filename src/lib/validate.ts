/**
 * Input validation and sanitization utilities.
 * Prevents XSS, injection attacks, and validates data types.
 */

/**
 * Sanitize a string by removing potential XSS vectors.
 * Strips HTML tags, trims whitespace, and limits length.
 */
export function sanitizeString(input: unknown, maxLength = 10000): string {
  if (typeof input !== 'string') return '';
  // Remove null bytes
  let sanitized = input.replace(/\0/g, '');
  // Remove common XSS patterns
  sanitized = sanitized
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<\s*\/?script[^>]*>/gi, '')
    .replace(/javascript\s*:/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/<\s*iframe[^>]*>/gi, '')
    .replace(/<\s*object[^>]*>/gi, '')
    .replace(/<\s*embed[^>]*>/gi, '')
    .replace(/<\s*form[^>]*>/gi, '')
    .replace(/<\s*input[^>]*>/gi, '')
    .replace(/<\s*link[^>]*>/gi, '')
    .replace(/<\s*meta[^>]*>/gi, '')
    .replace(/<\s*style[^>]*>.*?<\s*\/style[^>]*>/gi, '')
    .replace(/<\s*img[^>]*on\w+\s*=[^>]*>/gi, '');
  // Trim and limit length
  return sanitized.trim().slice(0, maxLength);
}

/**
 * Sanitize an email address.
 */
export function sanitizeEmail(input: unknown): string {
  if (typeof input !== 'string') return '';
  const sanitized = input.trim().toLowerCase().slice(0, 254);
  // Basic email format check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitized)) return '';
  return sanitized;
}

/**
 * Validate and sanitize a URL.
 * Only allows http, https protocols.
 */
export function sanitizeUrl(input: unknown): string {
  if (typeof input !== 'string') return '';
  const sanitized = input.trim().slice(0, 2048);
  try {
    const url = new URL(sanitized);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return '';
    return sanitized;
  } catch {
    // Allow relative URLs starting with # or /
    if (/^(#|\/)[\w/-]*$/.test(sanitized)) return sanitized;
    return '';
  }
}

/**
 * Validate a phone number (allows international formats).
 */
export function sanitizePhone(input: unknown): string {
  if (typeof input !== 'string') return '';
  const sanitized = input.replace(/[^\d+\-\s()]/g, '').trim().slice(0, 20);
  return sanitized;
}

/**
 * Sanitize a number field (ensures it's a valid integer).
 */
export function sanitizeInt(input: unknown, min = 0, max = 2147483647): number {
  const num = parseInt(String(input), 10);
  if (isNaN(num)) return min;
  return Math.max(min, Math.min(max, num));
}

/**
 * Sanitize a boolean field.
 */
export function sanitizeBool(input: unknown): boolean {
  if (typeof input === 'boolean') return input;
  if (typeof input === 'string') return input === 'true' || input === '1';
  return false;
}

/**
 * Validate contact form input.
 */
export interface ValidatedContact {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  errors: string[];
}

export function validateContactForm(data: Record<string, unknown>): ValidatedContact {
  const errors: string[] = [];
  const name = sanitizeString(data.name, 100);
  const email = sanitizeEmail(data.email);
  const phone = sanitizePhone(data.phone);
  const subject = sanitizeString(data.subject, 200);
  const message = sanitizeString(data.message, 5000);

  if (!name) errors.push('Name is required');
  if (!email) errors.push('Valid email is required');
  if (!message) errors.push('Message is required');
  if (message.length > 0 && message.length < 10) errors.push('Message must be at least 10 characters');

  return { name, email, phone, subject, message, errors };
}

/**
 * Validate login input.
 */
export function validateLogin(data: Record<string, unknown>): { email: string; password: string; errors: string[] } {
  const errors: string[] = [];
  const email = sanitizeEmail(data.email);
  const password = typeof data.password === 'string' ? data.password : '';

  if (!email) errors.push('Valid email is required');
  if (!password) errors.push('Password is required');
  if (password.length > 128) errors.push('Password is too long');

  return { email, password, errors };
}

/**
 * Validate change password input.
 */
export function validateChangePassword(data: Record<string, unknown>): { currentPassword: string; newPassword: string; errors: string[] } {
  const errors: string[] = [];
  const currentPassword = typeof data.currentPassword === 'string' ? data.currentPassword : '';
  const newPassword = typeof data.newPassword === 'string' ? data.newPassword : '';

  if (!currentPassword) errors.push('Current password is required');
  if (!newPassword) errors.push('New password is required');
  if (newPassword.length > 0 && newPassword.length < 8) errors.push('New password must be at least 8 characters');
  if (newPassword.length > 128) errors.push('New password is too long');

  return { currentPassword, newPassword, errors };
}