import { db } from '@/lib/db';
import { requireAdmin, isValidCuid } from '@/lib/admin-auth';
import { sanitizeString, sanitizeInt, sanitizeBool } from '@/lib/validate';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const services = await db.service.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(services);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { admin, error } = await requireAdmin(request);
  if (error) return error;

  try {
    const data = await request.json();
    const title = sanitizeString(data.title, 200);
    const description = sanitizeString(data.description, 2000);
    const icon = sanitizeString(data.icon, 50);
    const order = sanitizeInt(data.order);
    const active = sanitizeBool(data.active);

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }

    const service = await db.service.create({
      data: { title, description, icon: icon || 'TrendingUp', order, active },
    });
    return NextResponse.json(service, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const { admin, error } = await requireAdmin(request);
  if (error) return error;

  try {
    const data = await request.json();
    const { id, ...rawUpdates } = data;

    if (!id || !isValidCuid(id)) {
      return NextResponse.json({ error: 'Valid service ID is required' }, { status: 400 });
    }

    const updates: Record<string, unknown> = {};
    if (rawUpdates.title !== undefined) updates.title = sanitizeString(rawUpdates.title, 200);
    if (rawUpdates.description !== undefined) updates.description = sanitizeString(rawUpdates.description, 2000);
    if (rawUpdates.icon !== undefined) updates.icon = sanitizeString(rawUpdates.icon, 50);
    if (rawUpdates.order !== undefined) updates.order = sanitizeInt(rawUpdates.order);
    if (rawUpdates.active !== undefined) updates.active = sanitizeBool(rawUpdates.active);

    const service = await db.service.update({ where: { id }, data: updates });
    return NextResponse.json(service);
  } catch {
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { admin, error } = await requireAdmin(request);
  if (error) return error;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id || !isValidCuid(id)) {
      return NextResponse.json({ error: 'Valid service ID is required' }, { status: 400 });
    }
    await db.service.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
  }
}