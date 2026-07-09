'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/website/Navbar';
import HeroSlider from '@/components/website/HeroSlider';
import ServicesSection from '@/components/website/ServicesSection';
import AboutSection from '@/components/website/AboutSection';
import CTASection from '@/components/website/CTASection';
import Footer from '@/components/website/Footer';
import WhatsAppButton from '@/components/website/WhatsAppButton';
import AdminPanel from '@/components/admin/AdminPanel';
import { Skeleton } from '@/components/ui/skeleton';

interface Slide {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
}

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface SiteSettings {
  siteName: string;
  tagline: string;
  whatsappNumber: string;
  aboutTitle: string;
  aboutDescription: string;
  aboutStats: string;
  ctaTitle: string;
  ctaDescription: string;
  ctaButtonText: string;
  [key: string]: string;
}

export default function Home() {
  const [data, setData] = useState<{
    settings: SiteSettings;
    slides: Slide[];
    services: ServiceItem[];
  } | null>(null);
  const [adminOpen, setAdminOpen] = useState(false);

  useEffect(() => {
    fetch('/api/public')
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch(() => {
        // Fallback defaults
        setData({
          settings: {
            siteName: 'Aurex Studio',
            tagline: 'Elevate Your Digital Presence',
            whatsappNumber: '+923237939393',
            aboutTitle: 'About Aurex Studio',
            aboutDescription: 'We are a full-service digital marketing agency dedicated to helping businesses grow their online presence.',
            aboutStats: JSON.stringify([{ label: 'Projects', value: '500+' }, { label: 'Clients', value: '200+' }, { label: 'Team', value: '50+' }, { label: 'Years', value: '8+' }]),
            ctaTitle: 'Ready to Transform Your Business?',
            ctaDescription: "Let's discuss how our digital marketing expertise can help you achieve your business goals.",
            ctaButtonText: 'Start Your Project',
          },
          slides: [],
          services: [],
        });
      });
  }, []);

  const settings = data?.settings;
  const slides = data?.slides || [];
  const services = data?.services || [];

  let aboutStats: { label: string; value: string }[] = [];
  try {
    aboutStats = JSON.parse(settings?.aboutStats || '[]');
  } catch {
    aboutStats = [];
  }

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-screen w-full" />
        <div className="flex-1" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar siteName={settings?.siteName || 'Aurex Studio'} />
      <main className="flex-1">
        <HeroSlider slides={slides} />
        <ServicesSection services={services} />
        <AboutSection
          title={settings?.aboutTitle || 'About Aurex Studio'}
          description={settings?.aboutDescription || ''}
          stats={aboutStats}
        />
        <CTASection
          title={settings?.ctaTitle || 'Ready to Transform Your Business?'}
          description={settings?.ctaDescription || ''}
          buttonText={settings?.ctaButtonText || 'Get Started'}
          whatsappNumber={settings?.whatsappNumber || '+923237939393'}
        />
      </main>
      <Footer
        siteName={settings?.siteName || 'Aurex Studio'}
        whatsappNumber={settings?.whatsappNumber || '+923237939393'}
        onAdminClick={() => setAdminOpen(true)}
      />
      <WhatsAppButton number={settings?.whatsappNumber || '+923237939393'} />
      <AdminPanel open={adminOpen} onClose={() => setAdminOpen(false)} />
    </div>
  );
}