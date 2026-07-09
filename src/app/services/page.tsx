import { db } from '@/lib/db';
import type { Metadata } from 'next';
import SiteShell from '@/components/website/SiteShell';
import ServicesContent from './ServicesContent';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await db.siteSetting.findMany();
    const map: Record<string, string> = {};
    for (const s of settings) map[s.key] = s.value;
    return {
      title: `${map.siteName || 'Aurex Studio'} | Our Services`,
      description: `Explore our comprehensive range of professional services. From digital marketing to web development, we deliver results that matter.`,
      keywords: map.metaKeywords ? map.metaKeywords.split(',').map(k => k.trim()) : [],
      openGraph: {
        title: `${map.siteName || 'Aurex Studio'} | Our Services`,
        description: `Explore our comprehensive range of professional services. From digital marketing to web development, we deliver results that matter.`,
        images: map.ogImageUrl ? [{ url: map.ogImageUrl, width: 1200, height: 630 }] : [],
      },
    };
  } catch {
    return { title: 'Aurex Studio | Our Services' };
  }
}

export default function ServicesPage() {
  return (
    <SiteShell>
      <ServicesContent />
    </SiteShell>
  );
}