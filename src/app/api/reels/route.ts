import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const reels = await db.reel.findMany({ where: { active: true }, orderBy: { order: 'asc' } });
    return NextResponse.json(reels);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch reels' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const decoded = Buffer.from(authHeader.replace('Bearer ', ''), 'base64').toString('utf-8');
    const admin = await db.admin.findUnique({ where: { id: decoded.split(':')[0] } });
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const data = await request.json();
    if (!data.reelUrl) return NextResponse.json({ error: 'Reel URL is required' }, { status: 400 });

    const reel = await db.reel.create({
      data: { platform: data.platform || 'instagram', reelUrl: data.reelUrl, order: data.order ?? 0, active: data.active ?? true },
    });
    return NextResponse.json(reel, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create reel' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const decoded = Buffer.from(authHeader.replace('Bearer ', ''), 'base64').toString('utf-8');
    const admin = await db.admin.findUnique({ where: { id: decoded.split(':')[0] } });
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const data = await request.json();
    if (!data.id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    const { id, ...updates } = data;
    const reel = await db.reel.update({ where: { id }, data: updates });
    return NextResponse.json(reel);
  } catch {
    return NextResponse.json({ error: 'Failed to update reel' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const decoded = Buffer.from(authHeader.replace('Bearer ', ''), 'base64').toString('utf-8');
    const admin = await db.admin.findUnique({ where: { id: decoded.split(':')[0] } });
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    await db.reel.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete reel' }, { status: 500 });
  }
}