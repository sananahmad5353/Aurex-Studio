import { db } from '@/lib/db';
import { verifyPassword, createAuthToken, verifyAuthToken } from '@/lib/auth';
import { verifyTOTPCode } from '@/lib/totp';
import { validateLogin, sanitizeString } from '@/lib/validate';
import { getClientIp } from '@/lib/rate-limit';
import { NextRequest, NextResponse } from 'next/server';

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 30 * 60 * 1000; // 30 minutes

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, twoFactorCode } = body;

    const validation = validateLogin({ email, password });
    if (validation.errors.length > 0) {
      return NextResponse.json({ error: validation.errors[0] }, { status: 400 });
    }

    const admin = await db.admin.findUnique({ where: { email: validation.email } });
    if (!admin) {
      // Don't reveal whether the email exists
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Check if account is locked
    if (admin.lockedUntil && new Date(admin.lockedUntil) > new Date()) {
      const remainingMs = new Date(admin.lockedUntil).getTime() - Date.now();
      const remainingMin = Math.ceil(remainingMs / 60000);
      return NextResponse.json(
        { error: `Account is temporarily locked. Try again in ${remainingMin} minutes.` },
        { status: 423 }
      );
    }

    const isValid = verifyPassword(validation.password, admin.password);
    if (!isValid) {
      // Increment failed attempts
      const newFailedAttempts = admin.failedLoginAttempts + 1;
      const updateData: Record<string, unknown> = { failedLoginAttempts: newFailedAttempts };

      if (newFailedAttempts >= MAX_FAILED_ATTEMPTS) {
        updateData.lockedUntil = new Date(Date.now() + LOCKOUT_DURATION_MS);
        await db.admin.update({ where: { id: admin.id }, data: updateData });
        return NextResponse.json(
          { error: `Account locked due to too many failed attempts. Try again in 30 minutes.` },
          { status: 423 }
        );
      }

      await db.admin.update({ where: { id: admin.id }, data: updateData });
      return NextResponse.json(
        { error: `Invalid credentials. ${MAX_FAILED_ATTEMPTS - newFailedAttempts} attempts remaining.` },
        { status: 401 }
      );
    }

    // === If 2FA is enabled, require 2FA code ===
    if (admin.twoFactorEnabled && admin.twoFactorSecret) {
      if (!twoFactorCode) {
        // First step: password correct, need 2FA
        // Don't issue a full token yet, issue a "pending" token
        const pendingToken = createAuthToken(admin.id, admin.email);
        return NextResponse.json({
          twoFactorRequired: true,
          message: 'Please enter your 2FA code.',
          // Return a temp token that only allows 2FA verification
          pendingToken,
        });
      }

      // Verify the 2FA code
      const sanitizedCode = sanitizeString(twoFactorCode, 6).replace(/\s/g, '');
      if (!verifyTOTPCode(admin.twoFactorSecret, sanitizedCode)) {
        return NextResponse.json({ error: 'Invalid 2FA code' }, { status: 401 });
      }
    }

    // === Successful login ===
    const ip = getClientIp(request);
    const token = createAuthToken(admin.id, admin.email);

    // Reset failed attempts and update last login
    await db.admin.update({
      where: { id: admin.id },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
        lastLoginIp: ip,
      },
    });

    return NextResponse.json({
      success: true,
      token,
      admin: { id: admin.id, email: admin.email },
    });
  } catch {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}