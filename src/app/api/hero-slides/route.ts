import { db } from '@/lib/db';
import { requireAdmin, isValidCuid } from '@/lib/admin-auth';
import { sanitizeString, sanitizeUrl, sanitizeInt, sanitizeBool } from '@/lib/validate';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const slides = await db.heroSlide.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(slides);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch slides' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { admin, error } = await requireAdmin(request);
  if (error) return error;

  try {
    const data = await request.json();
    const title = sanitizeString(data.title, 200);
    const subtitle = sanitizeString(data.subtitle, 500);
    const imageUrl = sanitizeUrl(data.imageUrl);
    const ctaText = sanitizeString(data.ctaText, 50);
    const ctaLink = sanitizeString(data.ctaLink, 200);
    const order = sanitizeInt(data.order);
    const active = sanitizeBool(data.active);

    if (!title || !subtitle || !imageUrl) {
      return NextResponse.json({ error: 'Title, subtitle, and image URL are required' }, { status: 400 });
    }

    const slide = await db.heroSlide.create({
      data: { title, subtitle, imageUrl, ctaText: ctaText || 'Get Started', ctaLink: ctaLink || '#contact', order, active },
    });
    return NextResponse.json(slide, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create slide' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const { admin, error } = await requireAdmin(request);
  if (error) return error;

  try {
    const data = await request.json();
    const { id, ...rawUpdates } = data;

    if (!id || !isValidCuid(id)) {
      return NextResponse.json({ error: 'Valid slide ID is required' }, { status: 400 });
    }

    const updates: Record<string, unknown> = {};
    if (rawUpdates.title !== undefined) updates.title = sanitizeString(rawUpdates.title, 200);
    if (rawUpdates.subtitle !== undefined) updates.subtitle = sanitizeString(rawUpdates.subtitle, 500);
    if (rawUpdates.imageUrl !== undefined) updates.imageUrl = sanitizeUrl(rawUpdates.imageUrl);
    if (rawUpdates.ctaText !== undefined) updates.ctaText = sanitizeString(rawUpdates.ctaText, 50);
    if (rawUpdates.ctaLink !== undefined) updates.ctaLink = sanitizeString(rawUpdates.ctaLink, 200);
    if (rawUpdates.order !== undefined) updates.order = sanitizeInt(rawUpdates.order);
    if (rawUpdates.active !== undefined) updates.active = sanitizeBool(rawUpdates.active);

    const slide = await db.heroSlide.update({ where: { id }, data: updates });
    return NextResponse.json(slide);
  } catch {
    return NextResponse.json({ error: 'Failed to update slide' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { admin, error } = await requireAdmin(request);
  if (error) return error;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id || !isValidCuid(id)) {
      return NextResponse.json({ error: 'Valid slide ID is required' }, { status: 400 });
    }
    await db.heroSlide.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete slide' }, { status: 500 });
  }
}