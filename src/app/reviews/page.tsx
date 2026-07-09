import { db } from '@/lib/db';
import type { Metadata } from 'next';
import SiteShell from '@/components/website/SiteShell';
import ReviewsContent from './ReviewsContent';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await db.siteSetting.findMany();
    const map: Record<string, string> = {};
    for (const s of settings) map[s.key] = s.value;
    return {
      title: `${map.siteName || 'Aurex Studio'} | Client Reviews`,
      description: 'Read what our clients say about working with us. Real stories, real results, real satisfaction.',
      keywords: map.metaKeywords ? map.metaKeywords.split(',').map(k => k.trim()) : [],
      openGraph: {
        title: `${map.siteName || 'Aurex Studio'} | Client Reviews`,
        description: 'Read what our clients say about working with us. Real stories, real results, real satisfaction.',
        images: map.ogImageUrl ? [{ url: map.ogImageUrl, width: 1200, height: 630 }] : [],
      },
    };
  } catch {
    return { title: 'Aurex Studio | Client Reviews' };
  }
}

export default function ReviewsPage() {
  return (
    <SiteShell>
      <ReviewsContent />
    </SiteShell>
  );
}