'use client';

import { useState, useEffect } from 'react';
import { ArrowUp, MapPin, Mail, Phone, Clock, Send } from 'lucide-react';

interface FooterProps {
  siteName: string;
  logoUrl?: string;
  whatsappNumber: string;
  instagramUrl?: string;
  facebookUrl?: string;
  tiktokUrl?: string;
  youtubeUrl?: string;
  onAdminClick: () => void;
}

export default function Footer({ siteName, logoUrl, whatsappNumber, instagramUrl, facebookUrl, tiktokUrl, youtubeUrl, onAdminClick }: FooterProps) {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`;
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const services = [
    { label: 'Digital Marketing Strategy', href: '/services' },
    { label: 'Performance Marketing', href: '/services' },
    { label: 'Business Development', href: '/services' },
    { label: 'Brand Growth Strategy', href: '/services' },
    { label: 'Lead Generation', href: '/services' },
    { label: 'Social Media Marketing', href: '/services' },
  ];

  const quickLinks = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'About Us', href: '/about' },
    { label: 'Reels', href: '/reels' },
    { label: 'Reviews', href: '/reviews' },
    { label: 'Contact', href: '/contact' },
  ];

  const socials = [
    { url: facebookUrl, icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
    ), label: 'Facebook', hoverBg: 'hover:bg-blue-600' },
    { url: instagramUrl, icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
    ), label: 'Instagram', hoverBg: 'hover:bg-gradient-to-tr hover:from-amber-500 hover:via-pink-500 hover:to-purple-600' },
    { url: tiktokUrl, icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V13.2a8.27 8.27 0 005.58 2.17V11.9a4.85 4.85 0 01-3.77-1.86V6.69h3.77z"/></svg>
    ), label: 'TikTok', hoverBg: 'hover:bg-slate-700' },
    { url: youtubeUrl, icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
    ), label: 'YouTube', hoverBg: 'hover:bg-red-600' },
  ];

  return (
    <footer className="relative bg-slate-950 text-white">
      {/* Top decorative gradient line */}
      <div className="h-1 bg-gradient-to-r from-[#1e88e5] via-[#34b3d1] to-[#1e88e5]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main footer grid */}
        <div className="py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand column */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-5">
              {logoUrl ? (
                <img src={logoUrl} alt={siteName} className="h-10 w-auto object-contain" />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1e88e5]">
                  <span className="text-lg font-bold text-white">A</span>
                </div>
              )}
              <span className="text-2xl font-bold tracking-tight">{siteName}</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-xs">
              Full-service digital marketing agency dedicated to helping businesses grow their online presence with data-driven strategies.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2.5">
              {socials.map((s) => s.url && (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white ${s.hoverBg} flex items-center justify-center transition-all duration-300`}
                  aria-label={s.label}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Services column */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-5">Services</h3>
            <ul className="space-y-3">
              {services.map((s) => (
                <li key={s.label}>
                  <a href={s.href} className="text-slate-400 hover:text-white text-sm transition-colors duration-200 flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-slate-600 group-hover:bg-[#34b3d1] transition-colors" />
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links column */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-5">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-slate-400 hover:text-white text-sm transition-colors duration-200 flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-slate-600 group-hover:bg-[#34b3d1] transition-colors" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info column */}
          <div className="lg:col-span-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-5">Contact Info</h3>
            <div className="space-y-4">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3.5 group">
                <div className="w-9 h-9 rounded-lg bg-slate-800/80 flex items-center justify-center flex-shrink-0 group-hover:bg-[#1e88e5]/20 transition-colors">
                  <Phone size={16} className="text-slate-400 group-hover:text-[#34b3d1] transition-colors" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">WhatsApp / Call</p>
                  <p className="text-sm text-slate-300 font-medium">{whatsappNumber}</p>
                </div>
              </a>

              <a href="mailto:sananahmad5353@gmail.com" className="flex items-start gap-3.5 group">
                <div className="w-9 h-9 rounded-lg bg-slate-800/80 flex items-center justify-center flex-shrink-0 group-hover:bg-[#1e88e5]/20 transition-colors">
                  <Mail size={16} className="text-slate-400 group-hover:text-[#34b3d1] transition-colors" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Email</p>
                  <p className="text-sm text-slate-300 font-medium">sananahmad5353@gmail.com</p>
                </div>
              </a>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-slate-800/80 flex items-center justify-center flex-shrink-0">
                  <MapPin size={16} className="text-slate-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Office</p>
                  <p className="text-sm text-slate-300 font-medium">I8 Markaz, Islamabad</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-slate-800/80 flex items-center justify-center flex-shrink-0">
                  <Clock size={16} className="text-slate-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Working Hours</p>
                  <p className="text-sm text-slate-300 font-medium">Mon - Sat, 9 AM - 7 PM</p>
                </div>
              </div>
            </div>

            {/* Newsletter mini */}
            <div className="mt-6">
              <p className="text-xs text-slate-500 mb-2.5">Stay updated with our latest work</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="flex-1 h-10 rounded-lg bg-slate-800/80 border border-slate-700/50 text-sm text-white placeholder:text-slate-500 px-3 focus:outline-none focus:border-[#1e88e5]/50 focus:ring-1 focus:ring-[#1e88e5]/20 transition-all"
                />
                <button
                  onClick={() => { if (email) setEmail(''); }}
                  className="h-10 w-10 rounded-lg bg-[#1e88e5] hover:bg-[#1565c0] text-white flex items-center justify-center transition-colors flex-shrink-0"
                  aria-label="Subscribe"
                >
                  <Send size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-xs">
            &copy; {new Date().getFullYear()} {siteName}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#home" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">Privacy Policy</a>
            <a href="#home" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">Terms of Service</a>
            <span className="text-slate-700 hover:text-slate-500 text-[10px] cursor-pointer transition-colors" onClick={onAdminClick}>
              manage
            </span>
          </div>
        </div>
      </div>

      {/* Scroll to top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 right-6 z-40 p-3 rounded-full bg-[#1e88e5] text-white hover:bg-[#1565c0] shadow-lg shadow-[#1e88e5]/20 transition-all hover:scale-105"
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </footer>
  );
}