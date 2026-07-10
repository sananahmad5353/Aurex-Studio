'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Instagram, Play, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';

interface ReelItem { id: string; platform: string; reelUrl: string; }

interface SocialReelsProps {
  reels: ReelItem[];
  instagramUrl?: string;
}

function ThumbnailCard({ reel, index }: { reel: ReelItem; index: number }) {
  return (
    <a
      href={reel.reelUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex-shrink-0 w-[155px] sm:w-[175px] lg:w-[195px] snap-start group"
    >
      <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-xl hover:border-slate-300 hover:-translate-y-1 transition-all duration-300">
        <div className="relative w-full aspect-[9/16] bg-gradient-to-br from-pink-600 via-purple-600 to-orange-500 flex items-center justify-center overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full border-2 border-white" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full border-2 border-white" />
          </div>

          {/* Platform icon badge */}
          <div className="absolute top-2.5 left-2.5">
            <div className="w-6 h-6 rounded-md bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 flex items-center justify-center opacity-80">
              <Instagram size={14} className="text-white" />
            </div>
          </div>

          {/* Reel number */}
          <div className="absolute top-2.5 right-2.5">
            <span className="text-white/70 text-[10px] font-medium bg-black/20 px-1.5 py-0.5 rounded-full backdrop-blur-sm">
              #{index + 1}
            </span>
          </div>

          {/* Play button */}
          <div className="relative z-10 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/35 group-hover:scale-110 transition-all duration-300 border border-white/30">
            <Play size={20} className="text-white ml-0.5" fill="white" />
          </div>

          {/* Bottom gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-2.5 left-2.5">
            <p className="text-white text-[11px] font-semibold drop-shadow-lg">Reel</p>
          </div>
        </div>

        <div className="px-3 py-2 flex items-center justify-between">
          <span className="text-[11px] font-medium text-slate-500">Reel {index + 1}</span>
          <span className="text-slate-400 group-hover:text-emerald-500 transition-colors">
            <ExternalLink size={12} />
          </span>
        </div>
      </div>
    </a>
  );
}

export default function SocialReels({ reels, instagramUrl }: SocialReelsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll, reels.length]);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  if (!reels.length) return null;

  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="inline-block mb-4 px-4 py-1.5 bg-emerald-50 text-emerald-600 text-sm font-semibold rounded-full">
              Our Work
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-2">
              Instagram Reels
            </h2>
            <p className="text-base sm:text-lg text-slate-500 max-w-xl">
              Watch our latest creative reels and short-form content.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <button onClick={() => scroll('left')} disabled={!canScrollLeft}
              className="p-2.5 rounded-full border border-slate-200 text-slate-400 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              aria-label="Scroll left"><ChevronLeft size={20} /></button>
            <button onClick={() => scroll('right')} disabled={!canScrollRight}
              className="p-2.5 rounded-full border border-slate-200 text-slate-400 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              aria-label="Scroll right"><ChevronRight size={20} /></button>
          </div>
        </div>

        {/* Single row slider */}
        <div className="relative group/slider">
          {canScrollLeft && <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />}
          {canScrollRight && <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory hide-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {reels.map((reel, idx) => (
              <ThumbnailCard key={reel.id} reel={reel} index={idx} />
            ))}
          </div>
        </div>

        {/* Follow button */}
        {instagramUrl && (
          <div className="text-center mt-10">
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-colors">
              <Instagram size={18} /> Follow @aurexstudio_pk
            </a>
          </div>
        )}
      </div>
    </section>
  );
}