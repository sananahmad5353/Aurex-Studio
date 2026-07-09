import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const partners = await db.partner.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(partners);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch partners' }, { status: 500 });
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
    if (!data.name || !data.imageUrl) return NextResponse.json({ error: 'Name and image URL are required' }, { status: 400 });

    const partner = await db.partner.create({
      data: { name: data.name, imageUrl: data.imageUrl, website: data.website || '', order: data.order ?? 0, active: data.active ?? true },
    });
    return NextResponse.json(partner, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create partner' }, { status: 500 });
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
    const partner = await db.partner.update({ where: { id }, data: updates });
    return NextResponse.json(partner);
  } catch {
    return NextResponse.json({ error: 'Failed to update partner' }, { status: 500 });
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
    await db.partner.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete partner' }, { status: 500 });
  }
}