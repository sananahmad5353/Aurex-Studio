/**
 * Shared admin auth verification helper.
 * All protected API routes should use this instead of manual base64 decoding.
 */
import { db } from '@/lib/db';
import { verifyAuthToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Verify admin authentication from a request.
 * Returns the admin record if valid, or null if unauthorized.
 */
export async function requireAdmin(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { admin: null, error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }

  const token = authHeader.slice(7).trim();
  const payload = verifyAuthToken(token);
  if (!payload) {
    return { admin: null, error: NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 }) };
  }

  try {
    const admin = await db.admin.findUnique({
      where: { id: payload.adminId },
      select: { id: true, email: true, role: true },
    });

    if (!admin) {
      return { admin: null, error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
    }

    return { admin, error: null };
  } catch {
    return { admin: null, error: NextResponse.json({ error: 'Authentication error' }, { status: 500 }) };
  }
}

/**
 * Validate that a string is a valid CUID (for ID parameters).
 */
export function isValidCuid(id: string): boolean {
  return typeof id === 'string' && /^[a-z0-9]{20,}$/.test(id);
}