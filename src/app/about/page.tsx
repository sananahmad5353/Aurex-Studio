import { db } from '@/lib/db';
import type { Metadata } from 'next';
import SiteShell from '@/components/website/SiteShell';
import AboutContent from './AboutContent';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await db.siteSetting.findMany();
    const map: Record<string, string> = {};
    for (const s of settings) map[s.key] = s.value;
    return {
      title: `${map.siteName || 'Aurex Studio'} | About Us - ${map.metaTitle || 'Who We Are'}`,
      description: map.aboutDescription || map.metaDescription || 'Learn about our story, mission, and the team behind our success.',
      keywords: map.metaKeywords ? map.metaKeywords.split(',').map(k => k.trim()) : [],
      openGraph: {
        title: `${map.siteName || 'Aurex Studio'} | About Us`,
        description: map.aboutDescription || map.metaDescription || 'Learn about our story, mission, and the team behind our success.',
        images: map.ogImageUrl ? [{ url: map.ogImageUrl, width: 1200, height: 630 }] : [],
      },
    };
  } catch {
    return { title: 'Aurex Studio | About Us' };
  }
}

export default function AboutPage() {
  return (
    <SiteShell>
      <AboutContent />
    </SiteShell>
  );
}