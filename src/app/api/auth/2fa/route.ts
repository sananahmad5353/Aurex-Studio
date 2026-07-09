import { db } from '@/lib/db';
import { verifyAuthToken, createAuthToken } from '@/lib/auth';
import { generateTOTPSecret, getTOTPCode, verifyTOTPCode, getTOTPUri } from '@/lib/totp';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/auth/2fa/setup
 * Generate a new TOTP secret (requires auth).
 * Returns the secret and otpauth URI for QR scanning.
 */
export async function POST(request: NextRequest) {
  try {
    const payload = verifyAuthToken(request.headers.get('authorization')?.replace('Bearer ', '') || '');
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const admin = await db.admin.findUnique({ where: { id: payload.adminId } });
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Generate new TOTP secret
    const secret = generateTOTPSecret();
    const uri = getTOTPUri(secret, admin.email);

    // Temporarily store the secret (not enabled yet until verified)
    await db.admin.update({
      where: { id: admin.id },
      data: {
        twoFactorSecret: secret,
        twoFactorEnabled: false,
      },
    });

    // Generate a backup code for verification testing
    const testCode = getTOTPCode(secret);

    return NextResponse.json({
      success: true,
      secret,
      uri,
      testCode, // For development/testing convenience
      message: 'Scan the QR code with your authenticator app, then verify with a code.',
    });
  } catch {
    return NextResponse.json({ error: 'Failed to setup 2FA' }, { status: 500 });
  }
}

/**
 * PUT /api/auth/2fa/verify
 * Verify a TOTP code to enable or disable 2FA.
 * Body: { code: string, action: 'enable' | 'disable' }
 */
export async function PUT(request: NextRequest) {
  try {
    const payload = verifyAuthToken(request.headers.get('authorization')?.replace('Bearer ', '') || '');
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const admin = await db.admin.findUnique({ where: { id: payload.adminId } });
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { code, action } = await request.json();

    if (!code || !action) {
      return NextResponse.json({ error: 'Code and action are required' }, { status: 400 });
    }

    if (action === 'enable') {
      // Verify the TOTP code
      if (!admin.twoFactorSecret) {
        return NextResponse.json({ error: 'Please set up 2FA first' }, { status: 400 });
      }

      if (!verifyTOTPCode(admin.twoFactorSecret, code)) {
        return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 });
      }

      // Enable 2FA
      await db.admin.update({
        where: { id: admin.id },
        data: { twoFactorEnabled: true },
      });

      // Issue new token with 2FA flag
      const newToken = createAuthToken(admin.id, admin.email);

      return NextResponse.json({
        success: true,
        message: 'Two-factor authentication enabled successfully.',
        token: newToken,
      });
    }

    if (action === 'disable') {
      // Verify current 2FA code before disabling
      if (!admin.twoFactorEnabled || !admin.twoFactorSecret) {
        return NextResponse.json({ error: '2FA is not enabled' }, { status: 400 });
      }

      if (!verifyTOTPCode(admin.twoFactorSecret, code)) {
        return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 });
      }

      // Disable 2FA
      await db.admin.update({
        where: { id: admin.id },
        data: {
          twoFactorEnabled: false,
          twoFactorSecret: '',
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Two-factor authentication disabled.',
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Failed to verify 2FA' }, { status: 500 });
  }
}

/**
 * GET /api/auth/2fa/status
 * Get 2FA status for the current admin.
 */
export async function GET(request: NextRequest) {
  try {
    const payload = verifyAuthToken(request.headers.get('authorization')?.replace('Bearer ', '') || '');
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const admin = await db.admin.findUnique({
      where: { id: payload.adminId },
      select: { twoFactorEnabled: true, email: true },
    });

    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({
      enabled: admin.twoFactorEnabled,
      email: admin.email,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to get 2FA status' }, { status: 500 });
  }
}