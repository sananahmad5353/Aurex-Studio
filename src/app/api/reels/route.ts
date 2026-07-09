import { db } from '@/lib/db';
import { requireAdmin, isValidCuid } from '@/lib/admin-auth';
import { sanitizeString, sanitizeUrl, sanitizeInt, sanitizeBool } from '@/lib/validate';
import { NextRequest, NextResponse } from 'next/server';

const VALID_PLATFORMS = ['instagram', 'tiktok', 'youtube', 'facebook'];

export async function GET() {
  try {
    const reels = await db.reel.findMany({ where: { active: true }, orderBy: { order: 'asc' } });
    return NextResponse.json(reels);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch reels' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { admin, error } = await requireAdmin(request);
  if (error) return error;

  try {
    const data = await request.json();
    const platform = VALID_PLATFORMS.includes(data.platform) ? data.platform : 'instagram';
    const reelUrl = sanitizeUrl(data.reelUrl);
    const order = sanitizeInt(data.order);
    const active = sanitizeBool(data.active);

    if (!reelUrl) {
      return NextResponse.json({ error: 'Reel URL is required' }, { status: 400 });
    }

    const reel = await db.reel.create({
      data: { platform, reelUrl, order, active },
    });
    return NextResponse.json(reel, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create reel' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const { admin, error } = await requireAdmin(request);
  if (error) return error;

  try {
    const data = await request.json();
    const { id, ...rawUpdates } = data;

    if (!id || !isValidCuid(id)) {
      return NextResponse.json({ error: 'Valid ID required' }, { status: 400 });
    }

    const updates: Record<string, unknown> = {};
    if (rawUpdates.platform !== undefined && VALID_PLATFORMS.includes(rawUpdates.platform)) {
      updates.platform = rawUpdates.platform;
    }
    if (rawUpdates.reelUrl !== undefined) updates.reelUrl = sanitizeUrl(rawUpdates.reelUrl);
    if (rawUpdates.order !== undefined) updates.order = sanitizeInt(rawUpdates.order);
    if (rawUpdates.active !== undefined) updates.active = sanitizeBool(rawUpdates.active);

    const reel = await db.reel.update({ where: { id }, data: updates });
    return NextResponse.json(reel);
  } catch {
    return NextResponse.json({ error: 'Failed to update reel' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { admin, error } = await requireAdmin(request);
  if (error) return error;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id || !isValidCuid(id)) {
      return NextResponse.json({ error: 'Valid ID required' }, { status: 400 });
    }
    await db.reel.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete reel' }, { status: 500 });
  }
}