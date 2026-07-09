import { db } from '@/lib/db';
import type { Metadata } from 'next';
import SiteShell from '@/components/website/SiteShell';
import ReelsContent from './ReelsContent';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await db.siteSetting.findMany();
    const map: Record<string, string> = {};
    for (const s of settings) map[s.key] = s.value;
    return {
      title: `${map.siteName || 'Aurex Studio'} | Reels & Content`,
      description: 'Check out our latest reels, behind-the-scenes content, and creative work across social media platforms.',
      keywords: map.metaKeywords ? map.metaKeywords.split(',').map(k => k.trim()) : [],
      openGraph: {
        title: `${map.siteName || 'Aurex Studio'} | Reels & Content`,
        description: 'Check out our latest reels, behind-the-scenes content, and creative work across social media platforms.',
        images: map.ogImageUrl ? [{ url: map.ogImageUrl, width: 1200, height: 630 }] : [],
      },
    };
  } catch {
    return { title: 'Aurex Studio | Reels & Content' };
  }
}

export default function ReelsPage() {
  return (
    <SiteShell>
      <ReelsContent />
    </SiteShell>
  );
}