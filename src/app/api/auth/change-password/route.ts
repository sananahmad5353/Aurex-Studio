import { db } from '@/lib/db';
import { verifyPassword, hashPassword, verifyAuthToken, isPasswordStrong } from '@/lib/auth';
import { validateChangePassword } from '@/lib/validate';
import { NextRequest, NextResponse } from 'next/server';

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

    const body = await request.json();
    const validation = validateChangePassword(body);
    if (validation.errors.length > 0) {
      return NextResponse.json({ error: validation.errors[0] }, { status: 400 });
    }

    // Check password strength
    const strength = isPasswordStrong(validation.newPassword);
    if (!strength.strong) {
      return NextResponse.json({
        error: 'Password is too weak',
        requirements: strength.issues,
      }, { status: 400 });
    }

    const isValid = verifyPassword(validation.currentPassword, admin.password);
    if (!isValid) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });
    }

    await db.admin.update({
      where: { id: admin.id },
      data: { password: hashPassword(validation.newPassword) },
    });

    return NextResponse.json({ success: true, message: 'Password changed successfully' });
  } catch {
    return NextResponse.json({ error: 'Failed to change password' }, { status: 500 });
  }
}