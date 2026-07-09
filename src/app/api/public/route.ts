import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const settings = await db.siteSetting.findMany();
    const settingsMap: Record<string, string> = {};
    for (const s of settings) { settingsMap[s.key] = s.value; }

    const [slides, services, testimonials, partners, reels] = await Promise.all([
      db.heroSlide.findMany({ where: { active: true }, orderBy: { order: 'asc' } }),
      db.service.findMany({ where: { active: true }, orderBy: { order: 'asc' } }),
      db.testimonial.findMany({ where: { active: true }, orderBy: { order: 'asc' } }),
      db.partner.findMany({ where: { active: true }, orderBy: { order: 'asc' } }),
      db.reel.findMany({ where: { active: true }, orderBy: { order: 'asc' } }),
    ]);

    return NextResponse.json({ settings: settingsMap, slides, services, testimonials, partners, reels });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}