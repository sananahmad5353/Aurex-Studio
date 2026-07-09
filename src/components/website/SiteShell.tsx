'use client';

import { useState, useEffect, ReactNode } from 'react';
import Navbar from '@/components/website/Navbar';
import Footer from '@/components/website/Footer';
import WhatsAppButton from '@/components/website/WhatsAppButton';
import AdminPanel from '@/components/admin/AdminPanel';

interface SiteData {
  settings: Record<string, string>;
  services: { id: string; title: string; description: string; icon: string }[];
}

const DEFAULT_DATA: SiteData = {
  settings: {
    siteName: 'Aurex Studio',
    whatsappNumber: '+923237939393',
    contactEmail: 'sananahmad5353@gmail.com',
    instagramUrl: '',
    tiktokUrl: '',
    youtubeUrl: '',
    logoUrl: '',
    address: 'I-8 Markaz, Islamabad, Pakistan',
  },
  services: [],
};

export default function SiteShell({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteData | null>(null);
  const [adminOpen, setAdminOpen] = useState(false);

  useEffect(() => {
    fetch('/api/public')
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => setData(DEFAULT_DATA));
  }, []);

  const s = data?.settings || DEFAULT_DATA.settings;
  const svc = data?.services || DEFAULT_DATA.services;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar
        siteName={s.siteName || 'Aurex Studio'}
        logoUrl={s.logoUrl || ''}
      />
      <main className="flex-1">{children}</main>
      <Footer
        siteName={s.siteName || 'Aurex Studio'}
        whatsappNumber={s.whatsappNumber || '+923237939393'}
        instagramUrl={s.instagramUrl || ''}
        tiktokUrl={s.tiktokUrl || ''}
        youtubeUrl={s.youtubeUrl || ''}
        onAdminClick={() => setAdminOpen(true)}
      />
      <WhatsAppButton number={s.whatsappNumber || '+923237939393'} />
      <AdminPanel open={adminOpen} onClose={() => setAdminOpen(false)} />
    </div>
  );
}

export type { SiteData };