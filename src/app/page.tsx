'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/website/Navbar';
import HeroSlider from '@/components/website/HeroSlider';
import TrustedPartners from '@/components/website/TrustedPartners';
import ServicesSection from '@/components/website/ServicesSection';
import AboutSection from '@/components/website/AboutSection';
import ClientReviews from '@/components/website/ClientReviews';
import ContactForm from '@/components/website/ContactForm';
import CTASection from '@/components/website/CTASection';
import SocialReels from '@/components/website/SocialReels';
import Footer from '@/components/website/Footer';
import WhatsAppButton from '@/components/website/WhatsAppButton';
import AdminPanel from '@/components/admin/AdminPanel';
import { Skeleton } from '@/components/ui/skeleton';

interface Slide { id: string; title: string; subtitle: string; imageUrl: string; ctaText: string; ctaLink: string; }
interface ServiceItem { id: string; title: string; description: string; icon: string; }
interface TestimonialItem { id: string; name: string; role: string; company: string; content: string; rating: number; imageUrl: string; }
interface PartnerItem { id: string; name: string; imageUrl: string; website: string; }
interface ReelItem { id: string; platform: string; reelUrl: string; }
interface SiteSettings { siteName: string; tagline: string; whatsappNumber: string; contactEmail: string; aboutTitle: string; aboutDescription: string; aboutStats: string; ctaTitle: string; ctaDescription: string; ctaButtonText: string; [key: string]: string; }

export default function Home() {
  const [data, setData] = useState<{
    settings: SiteSettings; slides: Slide[]; services: ServiceItem[];
    testimonials: TestimonialItem[]; partners: PartnerItem[]; reels: ReelItem[];
  } | null>(null);
  const [adminOpen, setAdminOpen] = useState(false);

  useEffect(() => {
    fetch('/api/public')
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => setData({
        settings: { siteName: 'Aurex Studio', tagline: 'Elevate Your Digital Presence', whatsappNumber: '+923237939393', contactEmail: 'sananahmad5353@gmail.com', aboutTitle: 'About Aurex Studio', aboutDescription: '', aboutStats: '[]', ctaTitle: '', ctaDescription: '', ctaButtonText: '' },
        slides: [], services: [], testimonials: [], partners: [], reels: [],
      }));
  }, []);

  const settings = data?.settings;
  const slides = data?.slides || [];
  const services = data?.services || [];
  const testimonials = data?.testimonials || [];
  const partners = data?.partners || [];
  const reels = data?.reels || [];

  let aboutStats: { label: string; value: string }[] = [];
  let aboutImages: string[] = [];
  try { aboutStats = JSON.parse(settings?.aboutStats || '[]'); } catch { aboutStats = []; }
  try { aboutImages = JSON.parse(settings?.aboutImages || '[]'); } catch { aboutImages = []; }

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
        <TrustedPartners partners={partners} />
        <ServicesSection services={services} />
        <AboutSection
          title={settings?.aboutTitle || 'About Aurex Studio'}
          description={settings?.aboutDescription || ''}
          stats={aboutStats}
          images={aboutImages}
        />
        <ClientReviews testimonials={testimonials} />
        <SocialReels reels={reels} />
        <ContactForm
          whatsappNumber={settings?.whatsappNumber || '+923237939393'}
          contactEmail={settings?.contactEmail || 'sananahmad5353@gmail.com'}
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