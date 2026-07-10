import { db } from '@/lib/db';
import { requireAdmin, isValidCuid } from '@/lib/admin-auth';
import { sanitizeString, sanitizeUrl, sanitizeInt, sanitizeBool } from '@/lib/validate';
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
  const { admin, error } = await requireAdmin(request);
  if (error) return error;

  try {
    const data = await request.json();
    const name = sanitizeString(data.name, 100);
    const imageUrl = sanitizeUrl(data.imageUrl);
    const website = sanitizeUrl(data.website);
    const order = sanitizeInt(data.order);
    const active = sanitizeBool(data.active);

    if (!name || !imageUrl) {
      return NextResponse.json({ error: 'Name and image URL are required' }, { status: 400 });
    }

    const partner = await db.partner.create({
      data: { name, imageUrl, website: website || '', order, active },
    });
    return NextResponse.json(partner, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create partner' }, { status: 500 });
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
    if (rawUpdates.name !== undefined) updates.name = sanitizeString(rawUpdates.name, 100);
    if (rawUpdates.imageUrl !== undefined) updates.imageUrl = sanitizeUrl(rawUpdates.imageUrl);
    if (rawUpdates.website !== undefined) updates.website = sanitizeUrl(rawUpdates.website);
    if (rawUpdates.order !== undefined) updates.order = sanitizeInt(rawUpdates.order);
    if (rawUpdates.active !== undefined) updates.active = sanitizeBool(rawUpdates.active);

    const partner = await db.partner.update({ where: { id }, data: updates });
    return NextResponse.json(partner);
  } catch {
    return NextResponse.json({ error: 'Failed to update partner' }, { status: 500 });
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
    await db.partner.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete partner' }, { status: 500 });
  }
}