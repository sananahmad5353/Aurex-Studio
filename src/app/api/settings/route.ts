import { db } from '@/lib/db';
import { requireAdmin, isValidCuid } from '@/lib/admin-auth';
import { sanitizeString, sanitizeUrl, sanitizeInt, sanitizeBool } from '@/lib/validate';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const settings = await db.siteSetting.findMany();
    const settingsMap: Record<string, string> = {};
    for (const s of settings) {
      settingsMap[s.key] = s.value;
    }
    return NextResponse.json(settingsMap);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const { admin, error } = await requireAdmin(request);
  if (error) return error;

  try {
    const updates = await request.json();
    if (!updates || typeof updates !== 'object') {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    for (const [key, value] of Object.entries(updates)) {
      const sanitizedKey = sanitizeString(key, 100);
      const sanitizedValue = sanitizeString(value, 5000);
      if (!sanitizedKey) continue;
      await db.siteSetting.upsert({
        where: { key: sanitizedKey },
        update: { value: sanitizedValue },
        create: { key: sanitizedKey, value: sanitizedValue },
      });
    }

    return NextResponse.json({ success: true, message: 'Settings updated' });
  } catch {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}