'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Instagram, Play, Youtube, X, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';

interface ReelItem { id: string; platform: string; reelUrl: string; }

interface SocialReelsProps {
  reels: ReelItem[];
  instagramUrl?: string;
  tiktokUrl?: string;
  youtubeUrl?: string;
}

function getEmbedUrl(reelUrl: string, platform: string): string {
  if (platform === 'tiktok') {
    const m = reelUrl.match(/video\/(\d+)/);
    if (m) return `https://www.tiktok.com/embed/v2/${m[1]}`;
    const m2 = reelUrl.match(/\/(\d{15,25})/);
    if (m2) return `https://www.tiktok.com/embed/v2/${m2[1]}`;
  }
  if (platform === 'youtube') {
    const sm = reelUrl.match(/\/shorts\/([a-zA-Z0-9_-]+)/);
    if (sm) return `https://www.youtube.com/embed/${sm[1]}`;
    const vm = reelUrl.match(/(?:v=|\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    if (vm) return `https://www.youtube.com/embed/${vm[1]}`;
  }
  const rm = reelUrl.match(/\/(reel|p)\/([^/?]+)/);
  if (rm) return `https://www.instagram.com/${rm[1]}/${rm[2]}/embed`;
  return reelUrl;
}

const PLATFORM_CFG = {
  instagram: {
    label: 'Instagram Reels',
    gradient: 'from-pink-500 via-purple-500 to-orange-400',
    icon: <Instagram size={20} className="text-white" />,
    badge: 'bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600',
    follow: 'hover:from-pink-500 hover:via-purple-500 hover:to-orange-400',
  },
  tiktok: {
    label: 'TikTok Reels',
    gradient: 'from-slate-800 via-slate-700 to-cyan-400',
    icon: <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-white"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V13a8.28 8.28 0 005.58 2.16v-3.44a4.85 4.85 0 01-1-.1V6.69h1z"/></svg>,
    badge: 'bg-slate-900',
    follow: 'hover:from-slate-800 hover:to-cyan-500',
  },
  youtube: {
    label: 'YouTube Shorts',
    gradient: 'from-red-500 via-red-600 to-red-700',
    icon: <Youtube size={20} className="text-white" />,
    badge: 'bg-red-600',
    follow: 'hover:from-red-500 hover:to-red-600',
  },
} as const;

function ReelCard({ reel, platform, index }: { reel: ReelItem; platform: string; index: number }) {
  const cfg = PLATFORM_CFG[platform as keyof typeof PLATFORM_CFG] || PLATFORM_CFG.instagram;
  const embedUrl = getEmbedUrl(reel.reelUrl, reel.platform);

  return (
    <div className="flex-shrink-0 w-[220px] sm:w-[240px] snap-start group">
      <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300">
        {/* 9:16 embed card */}
        <div className="relative w-full" style={{ paddingBottom: '150%' }}>
          <iframe
            src={embedUrl}
            className="absolute inset-0 w-full h-full"
            allowFullScreen
            allow="autoplay; encrypted-media"
            loading="lazy"
            title={`${cfg.label} ${index + 1}`}
            style={{ border: 'none' }}
          />
        </div>
        {/* Card footer */}
        <div className="px-3 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-md ${cfg.badge} flex items-center justify-center`}>
              {cfg.icon}
            </div>
            <span className="text-xs font-medium text-slate-500">Reel {index + 1}</span>
          </div>
          <a
            href={reel.reelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-emerald-500 transition-colors"
          >
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}

function PlatformRow({
  platform,
  reels,
  profileUrl,
}: {
  platform: string;
  reels: ReelItem[];
  profileUrl?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 5);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 5);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    return () => el.removeEventListener('scroll', checkScroll);
  }, [checkScroll, reels.length]);

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });
  };

  if (!reels.length) return null;
  const cfg = PLATFORM_CFG[platform as keyof typeof PLATFORM_CFG] || PLATFORM_CFG.instagram;

  return (
    <div className="mb-10 last:mb-0">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${cfg.gradient} flex items-center justify-center shadow-lg`}>
            {cfg.icon}
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">{cfg.label}</h3>
            <p className="text-xs text-slate-400">{reels.length} reels</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {profileUrl && (
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold transition-all duration-300 ${cfg.follow} text-white`}
            >
              Follow Us
            </a>
          )}
          {canLeft && (
            <button onClick={() => scroll('left')} className="w-9 h-9 rounded-full bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md flex items-center justify-center transition-all" aria-label="Left">
              <ChevronLeft size={16} className="text-slate-600" />
            </button>
          )}
          {canRight && (
            <button onClick={() => scroll('right')} className="w-9 h-9 rounded-full bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md flex items-center justify-center transition-all" aria-label="Right">
              <ChevronRight size={16} className="text-slate-600" />
            </button>
          )}
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {reels.map((reel, idx) => (
          <ReelCard key={reel.id} reel={reel} platform={platform} index={idx} />
        ))}
      </div>
    </div>
  );
}

export default function SocialReels({ reels, instagramUrl, tiktokUrl, youtubeUrl }: SocialReelsProps) {
  if (!reels.length) return null;

  const grouped: Record<string, ReelItem[]> = {};
  for (const r of reels) {
    if (!grouped[r.platform]) grouped[r.platform] = [];
    grouped[r.platform].push(r);
  }

  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block mb-4 px-4 py-1.5 bg-emerald-50 text-emerald-600 text-sm font-semibold rounded-full">
            Our Work
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Reels &amp; Content
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Watch our latest creative work across social media platforms.
          </p>
        </div>

        {grouped['instagram'] && (
          <PlatformRow platform="instagram" reels={grouped['instagram']} profileUrl={instagramUrl} />
        )}
        {grouped['tiktok'] && (
          <PlatformRow platform="tiktok" reels={grouped['tiktok']} profileUrl={tiktokUrl} />
        )}
        {grouped['youtube'] && (
          <PlatformRow platform="youtube" reels={grouped['youtube']} profileUrl={youtubeUrl} />
        )}

        <div className="text-center mt-10">
          <p className="text-sm text-slate-400 mb-3">Follow us for more content</p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {instagramUrl && (
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-slate-100 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-pink-500 hover:to-purple-600 text-slate-600 hover:text-white text-sm font-medium transition-all duration-300">
                <Instagram size={16} /> Instagram
              </a>
            )}
            {tiktokUrl && (
              <a href={tiktokUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-900 text-slate-600 hover:text-white text-sm font-medium transition-all duration-300">
                <Play size={16} /> TikTok
              </a>
            )}
            {youtubeUrl && (
              <a href={youtubeUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-slate-100 hover:bg-red-600 text-slate-600 hover:text-white text-sm font-medium transition-all duration-300">
                <Youtube size={16} /> YouTube
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}