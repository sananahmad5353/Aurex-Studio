'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavbarProps {
  siteName: string;
}

export default function Navbar({ siteName }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Services', href: '#services' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          <a href="#home" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900">
              <span className="text-lg font-bold text-white">A</span>
            </div>
            <span className={`text-lg sm:text-xl font-bold transition-colors ${scrolled ? 'text-slate-900' : 'text-white'}`}>
              {siteName}
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-emerald-500 ${
                  scrolled ? 'text-slate-700' : 'text-white/90'
                }`}
              >
                {link.label}
              </a>
            ))}
            <Button
              asChild
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 rounded-full"
            >
              <a href="#contact">Get a Quote</a>
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
              <a
                key={link.href}
                href={link.href}
                className="block px-6 py-3 text-sm font-medium text-slate-700 hover:text-emerald-500 hover:bg-slate-50 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="px-6 pt-2">
              <Button
                asChild
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-full"
              >
                <a href="#contact" onClick={() => setMobileOpen(false)}>Get a Quote</a>
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}