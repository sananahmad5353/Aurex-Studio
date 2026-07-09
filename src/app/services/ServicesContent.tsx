'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import ServicesSection from '@/components/website/ServicesSection';
import CTASection from '@/components/website/CTASection';

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface Settings {
  [key: string]: string;
}

export default function ServicesContent() {
  const [data, setData] = useState<{
    settings: Settings;
    services: ServiceItem[];
  } | null>(null);

  useEffect(() => {
    fetch('/api/public')
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => setData({ settings: {}, services: [] }));
  }, []);

  if (!data) {
    return (
      <div className="space-y-8">
        <div className="min-h-[280px] bg-gradient-to-br from-emerald-600 to-slate-900 pt-24" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  const s = data.settings;

  return (
    <>
      {/* Page Header */}
      <section className="relative min-h-[280px] bg-gradient-to-br from-emerald-600 to-slate-900 flex items-center justify-center pt-24">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Our Services
          </h1>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto mb-6">
            Comprehensive solutions tailored to elevate your brand and grow your business
          </p>
          <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-2 text-sm text-emerald-200">
            <Link href="/" className="flex items-center gap-1 hover:text-white transition-colors">
              <Home size={14} />
              Home
            </Link>
            <ChevronRight size={14} />
            <span className="text-white font-medium">Services</span>
          </nav>
        </div>
      </section>

      {/* Services */}
      <ServicesSection services={data.services} />

      {/* CTA */}
      <CTASection
        title={s.ctaTitle || 'Ready to Get Started?'}
        description={s.ctaDescription || 'Let us help you transform your business with our expert services.'}
        buttonText={s.ctaButtonText || 'Contact Us'}
        whatsappNumber={s.whatsappNumber || '+923115139781'}
      />
    </>
  );
}