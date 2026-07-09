import { db } from '@/lib/db';
import { requireAdmin, isValidCuid } from '@/lib/admin-auth';
import { sanitizeString, sanitizeUrl, sanitizeInt, sanitizeBool } from '@/lib/validate';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const posts = await db.instagramPost.findMany({ where: { active: true }, orderBy: { order: 'asc' } });
    return NextResponse.json(posts);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { admin, error } = await requireAdmin(request);
  if (error) return error;

  try {
    const data = await request.json();
    const postUrl = sanitizeUrl(data.postUrl);
    const imageUrl = sanitizeUrl(data.imageUrl || '');
    const caption = sanitizeString(data.caption || '');
    const order = sanitizeInt(data.order);
    const active = sanitizeBool(data.active);

    if (!postUrl) {
      return NextResponse.json({ error: 'Post URL is required' }, { status: 400 });
    }

    const post = await db.instagramPost.create({
      data: { postUrl, imageUrl, caption, order, active },
    });
    return NextResponse.json(post, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
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
    if (rawUpdates.postUrl !== undefined) updates.postUrl = sanitizeUrl(rawUpdates.postUrl);
    if (rawUpdates.imageUrl !== undefined) updates.imageUrl = sanitizeUrl(rawUpdates.imageUrl || '');
    if (rawUpdates.caption !== undefined) updates.caption = sanitizeString(rawUpdates.caption || '');
    if (rawUpdates.order !== undefined) updates.order = sanitizeInt(rawUpdates.order);
    if (rawUpdates.active !== undefined) updates.active = sanitizeBool(rawUpdates.active);

    const post = await db.instagramPost.update({ where: { id }, data: updates });
    return NextResponse.json(post);
  } catch {
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
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
    await db.instagramPost.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}