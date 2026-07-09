'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import AboutSection from '@/components/website/AboutSection';
import ClientReviews from '@/components/website/ClientReviews';

interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  imageUrl: string;
}

interface Settings {
  [key: string]: string;
}

export default function AboutContent() {
  const [data, setData] = useState<{
    settings: Settings;
    testimonials: TestimonialItem[];
  } | null>(null);

  useEffect(() => {
    fetch('/api/public')
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => setData({ settings: {}, testimonials: [] }));
  }, []);

  if (!data) {
    return (
      <div className="space-y-8">
        <div className="min-h-[280px] bg-gradient-to-br from-emerald-600 to-slate-900 pt-24" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  const s = data.settings;

  let aboutStats: { label: string; value: string }[] = [];
  let aboutImages: string[] = [];
  try { aboutStats = JSON.parse(s.aboutStats || '[]'); } catch { aboutStats = []; }
  try { aboutImages = JSON.parse(s.aboutImages || '[]'); } catch { aboutImages = []; }

  return (
    <>
      {/* Page Header */}
      <section className="relative min-h-[280px] bg-gradient-to-br from-emerald-600 to-slate-900 flex items-center justify-center pt-24">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            About Us
          </h1>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto mb-6">
            {s.aboutTitle ? `Discover ${s.aboutTitle}` : 'Discover who we are and what drives us'}
          </p>
          <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-2 text-sm text-emerald-200">
            <Link href="/" className="flex items-center gap-1 hover:text-white transition-colors">
              <Home size={14} />
              Home
            </Link>
            <ChevronRight size={14} />
            <span className="text-white font-medium">About</span>
          </nav>
        </div>
      </section>

      {/* About Section */}
      <AboutSection
        title={s.aboutTitle || 'About Us'}
        description={s.aboutDescription || ''}
        stats={aboutStats}
        images={aboutImages}
      />

      {/* Client Reviews */}
      <ClientReviews testimonials={data.testimonials} />
    </>
  );
}