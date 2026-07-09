'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Home, MapPin, Phone, Mail, MessageCircle, Instagram } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import ContactForm from '@/components/website/ContactForm';

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface Settings {
  [key: string]: string;
}

export default function ContactContent() {
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
  const whatsappNumber = s.whatsappNumber || '+923237939393';
  const contactEmail = s.contactEmail || 'sananahmad5353@gmail.com';
  const address = s.address || 'I-8 Markaz, Islamabad, Pakistan';
  const instagramUrl = s.instagramUrl || '';
  const tiktokUrl = s.tiktokUrl || '';
  const youtubeUrl = s.youtubeUrl || '';

  return (
    <>
      {/* Page Header */}
      <section className="relative min-h-[280px] bg-gradient-to-br from-emerald-600 to-slate-900 flex items-center justify-center pt-24">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Contact Us
          </h1>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto mb-6">
            We&apos;d love to hear from you. Reach out and let&apos;s start a conversation.
          </p>
          <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-2 text-sm text-emerald-200">
            <Link href="/" className="flex items-center gap-1 hover:text-white transition-colors">
              <Home size={14} />
              Home
            </Link>
            <ChevronRight size={14} />
            <span className="text-white font-medium">Contact</span>
          </nav>
        </div>
      </section>

      {/* Contact Form + Info */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Form */}
            <div className="lg:col-span-3">
              <ContactForm
                whatsappNumber={whatsappNumber}
                contactEmail={contactEmail}
                services={data.services}
                minimal
              />
            </div>

            {/* Info Sidebar */}
            <div className="lg:col-span-2 space-y-6">
              {/* Address Card */}
              <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-emerald-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Our Office</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{address}</p>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <Phone className="text-emerald-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Phone</h3>
                    <p className="text-sm text-slate-600">{whatsappNumber}</p>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <Mail className="text-emerald-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Email</h3>
                    <p className="text-sm text-slate-600">{contactEmail}</p>
                  </div>
                </div>
              </div>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-6 rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <h3 className="font-semibold mb-0.5">Chat on WhatsApp</h3>
                  <p className="text-sm text-emerald-100">Quick response guaranteed</p>
                </div>
              </a>

              {/* Social Links */}
              <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50">
                <h3 className="font-semibold text-slate-900 mb-3">Follow Us</h3>
                <div className="flex gap-3">
                  {instagramUrl && (
                    <a
                      href={instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white hover:opacity-80 transition-opacity"
                      aria-label="Instagram"
                    >
                      <Instagram size={18} />
                    </a>
                  )}
                  {tiktokUrl && (
                    <a
                      href={tiktokUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white hover:opacity-80 transition-opacity"
                      aria-label="TikTok"
                    >
                      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V13a8.28 8.28 0 005.58 2.16v-3.44a4.85 4.85 0 01-1-.1V6.69h1z"/></svg>
                    </a>
                  )}
                  {youtubeUrl && (
                    <a
                      href={youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white hover:opacity-80 transition-opacity"
                      aria-label="YouTube"
                    >
                      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Maps */}
      <section className="bg-white pb-16 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Find Us on Map</h2>
            <p className="text-slate-500 text-sm mt-1">{address}</p>
          </div>
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
            <iframe
              src="https://www.google.com/maps?q=I-8+Markaz+Islamabad+Pakistan&output=embed&z=15"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Aurex Studio - I-8 Markaz, Islamabad"
            />
          </div>
        </div>
      </section>
    </>
  );
}