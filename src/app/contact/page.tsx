import { db } from '@/lib/db';
import type { Metadata } from 'next';
import SiteShell from '@/components/website/SiteShell';
import ContactContent from './ContactContent';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await db.siteSetting.findMany();
    const map: Record<string, string> = {};
    for (const s of settings) map[s.key] = s.value;
    return {
      title: `${map.siteName || 'Aurex Studio'} | Contact Us`,
      description: `Get in touch with ${map.siteName || 'Aurex Studio'}. We'd love to hear from you and discuss how we can help your business grow.`,
      keywords: map.metaKeywords ? map.metaKeywords.split(',').map(k => k.trim()) : [],
      openGraph: {
        title: `${map.siteName || 'Aurex Studio'} | Contact Us`,
        description: `Get in touch with ${map.siteName || 'Aurex Studio'}. We'd love to hear from you and discuss how we can help your business grow.`,
        images: map.ogImageUrl ? [{ url: map.ogImageUrl, width: 1200, height: 630 }] : [],
      },
    };
  } catch {
    return { title: 'Aurex Studio | Contact Us' };
  }
}

export default function ContactPage() {
  return (
    <SiteShell>
      <ContactContent />
    </SiteShell>
  );
}