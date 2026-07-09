'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavbarProps {
  siteName: string;
  logoUrl?: string;
}

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Reels', href: '/reels' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar({ siteName, logoUrl }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={siteName}
                className="h-9 w-9 rounded-lg object-contain"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900">
                <span className="text-lg font-bold text-white">A</span>
              </div>
            )}
            <span className={`text-lg sm:text-xl font-bold transition-colors ${scrolled ? 'text-slate-900' : 'text-white'}`}>
              {siteName}
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-emerald-500 ${
                  isActive(link.href)
                    ? scrolled ? 'text-emerald-600' : 'text-emerald-400'
                    : scrolled ? 'text-slate-700' : 'text-white/90'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Button
              asChild
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-full font-semibold text-sm shadow-md"
            >
              <Link href="/contact">Get a Quote</Link>
            </Button>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className={scrolled ? 'text-slate-900' : 'text-white'} size={24} />
            ) : (
              <Menu className={scrolled ? 'text-slate-900' : 'text-white'} size={24} />
            )}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden bg-white border-t rounded-b-2xl shadow-lg pb-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-6 py-3 text-sm font-medium transition-colors hover:text-emerald-500 hover:bg-slate-50 ${
                  isActive(link.href) ? 'text-emerald-600 bg-emerald-50/50' : 'text-slate-700'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="px-6 pt-2">
              <Button
                asChild
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-semibold shadow-md"
              >
                <Link href="/contact" onClick={() => setMobileOpen(false)}>Get a Quote</Link>
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}