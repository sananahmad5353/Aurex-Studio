import { db } from '@/lib/db';
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
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const decoded = Buffer.from(authHeader.replace('Bearer ', ''), 'base64').toString('utf-8');
    const admin = await db.admin.findUnique({ where: { id: decoded.split(':')[0] } });
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const data = await request.json();
    if (!data.name || !data.content) return NextResponse.json({ error: 'Name and content are required' }, { status: 400 });

    const testimonial = await db.testimonial.create({
      data: {
        name: data.name, role: data.role || '', company: data.company || '',
        content: data.content, rating: data.rating || 5, imageUrl: data.imageUrl || '',
        order: data.order ?? 0, active: data.active ?? true,
      },
    });
    return NextResponse.json(testimonial, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
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
    const testimonial = await db.testimonial.update({ where: { id }, data: updates });
    return NextResponse.json(testimonial);
  } catch {
    return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 });
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
    await db.testimonial.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 });
  }
}