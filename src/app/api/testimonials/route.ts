import { db } from '@/lib/db';
import { requireAdmin, isValidCuid } from '@/lib/admin-auth';
import { sanitizeString, sanitizeUrl, sanitizeInt, sanitizeBool } from '@/lib/validate';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const testimonials = await db.testimonial.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(testimonials);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { admin, error } = await requireAdmin(request);
  if (error) return error;

  try {
    const data = await request.json();
    const name = sanitizeString(data.name, 100);
    const content = sanitizeString(data.content, 2000);
    const role = sanitizeString(data.role, 100);
    const company = sanitizeString(data.company, 100);
    const imageUrl = sanitizeUrl(data.imageUrl);
    const order = sanitizeInt(data.order);
    const active = sanitizeBool(data.active);
    const rating = sanitizeInt(data.rating, 1, 5);

    if (!name || !content) {
      return NextResponse.json({ error: 'Name and content are required' }, { status: 400 });
    }

    const testimonial = await db.testimonial.create({
      data: { name, role, company, content, rating, imageUrl: imageUrl || '', order, active },
    });
    return NextResponse.json(testimonial, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
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
    if (rawUpdates.content !== undefined) updates.content = sanitizeString(rawUpdates.content, 2000);
    if (rawUpdates.role !== undefined) updates.role = sanitizeString(rawUpdates.role, 100);
    if (rawUpdates.company !== undefined) updates.company = sanitizeString(rawUpdates.company, 100);
    if (rawUpdates.imageUrl !== undefined) updates.imageUrl = sanitizeUrl(rawUpdates.imageUrl);
    if (rawUpdates.order !== undefined) updates.order = sanitizeInt(rawUpdates.order);
    if (rawUpdates.active !== undefined) updates.active = sanitizeBool(rawUpdates.active);
    if (rawUpdates.rating !== undefined) updates.rating = sanitizeInt(rawUpdates.rating, 1, 5);

    const testimonial = await db.testimonial.update({ where: { id }, data: updates });
    return NextResponse.json(testimonial);
  } catch {
    return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 });
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
    await db.testimonial.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 });
  }
}