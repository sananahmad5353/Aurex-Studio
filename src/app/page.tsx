'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/website/Navbar';
import HeroSlider from '@/components/website/HeroSlider';
import TrustedPartners from '@/components/website/TrustedPartners';
import ServicesSection from '@/components/website/ServicesSection';
import AboutSection from '@/components/website/AboutSection';
import CTASection from '@/components/website/CTASection';
import Footer from '@/components/website/Footer';
import WhatsAppButton from '@/components/website/WhatsAppButton';
import AdminPanel from '@/components/admin/AdminPanel';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, ArrowRight, Play, Quote } from 'lucide-react';

interface Slide { id: string; title: string; subtitle: string; imageUrl: string; ctaText: string; ctaLink: string; }
interface ServiceItem { id: string; title: string; description: string; icon: string; }
interface TestimonialItem { id: string; name: string; role: string; company: string; content: string; rating: number; imageUrl: string; }
interface PartnerItem { id: string; name: string; imageUrl: string; website: string; }
interface ReelItem { id: string; platform: string; reelUrl: string; }
interface SiteSettings { [key: string]: string; }

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
        settings: { siteName: 'Aurex Studio', tagline: 'Elevate Your Digital Presence', whatsappNumber: '+923237939393', contactEmail: 'sananahmad5353@gmail.com', aboutTitle: 'About Aurex Studio', aboutDescription: '', aboutStats: '[]', ctaTitle: '', ctaDescription: '', ctaButtonText: '', instagramUrl: '', tiktokUrl: '', youtubeUrl: '' },
        slides: [], services: [], testimonials: [], partners: [], reels: [],
      }));
  }, []);

  const settings = data?.settings;
  const slides = data?.slides || [];
  const services = data?.services || [];
  const testimonials = data?.testimonials || [];
  const partners = data?.partners || [];

  let aboutStats: { label: string; value: string }[] = [];
  let aboutImages: string[] = [];
  try { aboutStats = JSON.parse(settings?.aboutStats || '[]'); } catch { aboutStats = []; }
  try { aboutImages = JSON.parse(settings?.aboutImages || '[]'); } catch { aboutImages = []; }

  // Show only 3 testimonials on home page
  const previewTestimonials = testimonials.slice(0, 3);

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
      <Navbar
        siteName={settings?.siteName || 'Aurex Studio'}
        logoUrl={settings?.logoUrl || ''}
      />
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

        {/* Latest Reviews Preview */}
        {previewTestimonials.length > 0 && (
          <section className="py-20 sm:py-28 bg-slate-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-14">
                <span className="inline-block mb-4 px-4 py-1.5 bg-emerald-50 text-emerald-600 text-sm font-semibold rounded-full">
                  Testimonials
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                  Latest Reviews
                </h2>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                  See what our clients have to say about working with us.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {previewTestimonials.map((t) => (
                  <div
                    key={t.id}
                    className="h-full p-6 sm:p-8 rounded-2xl border border-slate-100 bg-white hover:shadow-lg hover:border-emerald-100 transition-all duration-300 relative"
                  >
                    <Quote className="absolute top-6 right-6 w-8 h-8 text-emerald-100" />

                    {/* Stars */}
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < t.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}
                        />
                      ))}
                    </div>

                    <p className="text-slate-600 leading-relaxed mb-6 text-sm sm:text-base line-clamp-4">
                      &ldquo;{t.content}&rdquo;
                    </p>

                    <div className="flex items-center gap-3 mt-auto">
                      <div className="w-11 h-11 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        {t.imageUrl ? (
                          <img src={t.imageUrl} alt={t.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <span className="text-emerald-700 font-bold text-sm">
                            {t.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{t.name}</p>
                        <p className="text-xs text-slate-500">
                          {t.role}{t.company ? `, ${t.company}` : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {testimonials.length > 3 && (
                <div className="text-center mt-10">
                  <Link
                    href="/reviews"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors"
                  >
                    Read More Reviews
                    <ArrowRight size={16} />
                  </Link>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Watch Our Reels CTA Banner */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-3xl bg-gradient-to-r from-emerald-600 to-emerald-500 overflow-hidden">
              {/* Background decoration */}
              <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl" />
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-800/20 rounded-full translate-y-1/2 -translate-x-1/3 blur-2xl" />
              </div>

              <div className="relative z-10 px-6 sm:px-12 lg:px-16 py-12 sm:py-16 flex flex-col sm:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                    <Play className="text-white" size={28} />
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                      Watch Our Reels
                    </h3>
                    <p className="text-emerald-100 text-sm sm:text-base">
                      Check out our latest creative work on social media
                    </p>
                  </div>
                </div>
                <Link
                  href="/reels"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-emerald-700 font-semibold hover:bg-emerald-50 transition-colors flex-shrink-0"
                >
                  View Reels
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>

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
        instagramUrl={settings?.instagramUrl || ''}
        tiktokUrl={settings?.tiktokUrl || ''}
        youtubeUrl={settings?.youtubeUrl || ''}
        onAdminClick={() => setAdminOpen(true)}
      />
      <WhatsAppButton number={settings?.whatsappNumber || '+923237939393'} />
      <AdminPanel open={adminOpen} onClose={() => setAdminOpen(false)} />
    </div>
  );
}