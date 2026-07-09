'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Instagram, Play, Youtube, X, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';

interface ReelItem {
  id: string;
  platform: string;
  reelUrl: string;
}

interface SocialReelsProps {
  reels: ReelItem[];
  instagramUrl?: string;
  tiktokUrl?: string;
  youtubeUrl?: string;
}

function getEmbedUrl(reelUrl: string, platform: string): string {
  if (platform === 'tiktok') {
    const match = reelUrl.match(/video\/(\d+)/);
    if (match) return `https://www.tiktok.com/embed/v2/${match[1]}`;
    const match2 = reelUrl.match(/\/(\d{15,25})/);
    if (match2) return `https://www.tiktok.com/embed/v2/${match2[1]}`;
  }
  if (platform === 'youtube') {
    const shortMatch = reelUrl.match(/\/shorts\/([a-zA-Z0-9_-]+)/);
    if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
    const videoMatch = reelUrl.match(/(?:v=|\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    if (videoMatch) return `https://www.youtube.com/embed/${videoMatch[1]}`;
  }
  const reelMatch = reelUrl.match(/\/(reel|p)\/([^/?]+)/);
  if (reelMatch) return `https://www.instagram.com/${reelMatch[1]}/${reelMatch[2]}/embed`;
  return reelUrl;
}

/* ── Platform visual config ── */
const PLATFORM = {
  instagram: {
    label: 'Instagram Reels',
    gradient: 'from-pink-500 via-purple-500 to-orange-400',
    thumbGrad: 'from-pink-600/90 via-purple-600/80 to-orange-500/90',
    icon: <Instagram size={20} className="text-white" />,
    thumbIcon: <Instagram size={28} className="text-white/90" />,
    followGrad: 'hover:from-pink-500 hover:via-purple-500 hover:to-orange-400',
  },
  tiktok: {
    label: 'TikTok Reels',
    gradient: 'from-slate-800 via-slate-700 to-cyan-400',
    thumbGrad: 'from-slate-900/90 via-slate-800/80 to-cyan-500/90',
    icon: <Play size={20} className="text-white" />,
    thumbIcon: <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white/90"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V13a8.28 8.28 0 005.58 2.16v-3.44a4.85 4.85 0 01-1-.1V6.69h1z"/></svg>,
    followGrad: 'hover:from-slate-800 hover:to-cyan-500',
  },
  youtube: {
    label: 'YouTube Shorts',
    gradient: 'from-red-500 via-red-600 to-red-700',
    thumbGrad: 'from-red-700/90 via-red-600/80 to-red-500/90',
    icon: <Youtube size={20} className="text-white" />,
    thumbIcon: <Youtube size={28} className="text-white/90" />,
    followGrad: 'hover:from-red-500 hover:to-red-600',
  },
} as const;

/* ── Reel Modal ── */
function ReelModal({
  reel,
  platform,
  onClose,
}: {
  reel: ReelItem;
  platform: string;
  onClose: () => void;
}) {
  const embedUrl = getEmbedUrl(reel.reelUrl, reel.platform);
  const cfg = PLATFORM[platform as keyof typeof PLATFORM] || PLATFORM.instagram;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[400px] rounded-3xl overflow-hidden bg-slate-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors"
        >
          <X size={18} className="text-white" />
        </button>

        {/* Platform badge */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md">
          {cfg.icon}
          <span className="text-white text-xs font-medium">{cfg.label}</span>
        </div>

        {/* 9:16 Embed */}
        <div className="relative w-full" style={{ paddingBottom: '177.78%' }}>
          <iframe
            src={embedUrl}
            className="absolute inset-0 w-full h-full"
            allowFullScreen
            allow="autoplay; encrypted-media"
            title={`${cfg.label}`}
            style={{ border: 'none' }}
          />
        </div>

        {/* Bottom bar */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
          <a
            href={reel.reelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 text-white text-sm font-medium transition-colors backdrop-blur-sm"
          >
            <ExternalLink size={14} />
            Open on {platform.charAt(0).toUpperCase() + platform.slice(1)}
          </a>
        </div>
      </div>
    </div>
  );
}

/* ── Platform Slider Row ── */
function PlatformSlider({
  platform,
  reels,
  profileUrl,
  onPlay,
}: {
  platform: string;
  reels: ReelItem[];
  profileUrl?: string;
  onPlay: (reel: ReelItem, platform: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 5);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 5);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    return () => el.removeEventListener('scroll', checkScroll);
  }, [checkScroll]);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });
  };

  if (!reels.length) return null;
  const cfg = PLATFORM[platform as keyof typeof PLATFORM] || PLATFORM.instagram;

  return (
    <div className="mb-10 last:mb-0">
      {/* Header */}
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
              className={`hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold transition-all duration-300 ${cfg.followGrad} text-white`}
            >
              Follow Us
            </a>
          )}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="w-9 h-9 rounded-full bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md flex items-center justify-center transition-all"
              aria-label="Scroll left"
            >
              <ChevronLeft size={16} className="text-slate-600" />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="w-9 h-9 rounded-full bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md flex items-center justify-center transition-all"
              aria-label="Scroll right"
            >
              <ChevronRight size={16} className="text-slate-600" />
            </button>
          )}
        </div>
      </div>

      {/* Thumbnails Slider */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {reels.map((reel, idx) => (
          <button
            key={reel.id}
            onClick={() => onPlay(reel, platform)}
            className="group flex-shrink-0 w-[200px] sm:w-[220px] snap-start focus:outline-none"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group-hover:scale-[1.03] group-hover:-translate-y-1">
              {/* 9:16 thumbnail card */}
              <div className="relative w-full" style={{ paddingBottom: '160%' }}>
                {/* Gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${cfg.thumbGrad}`} />

                {/* Decorative circles */}
                <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-white/10 blur-xl" />
                <div className="absolute bottom-8 left-4 w-16 h-16 rounded-full bg-white/5 blur-lg" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  {/* Platform icon */}
                  <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/25 transition-colors">
                    {cfg.thumbIcon}
                  </div>

                  {/* Reel number */}
                  <span className="text-white/80 text-sm font-semibold tracking-wide">
                    Reel {idx + 1}
                  </span>

                  {/* Play button */}
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/35 group-hover:scale-110 transition-all duration-300">
                    <Play size={22} className="text-white ml-0.5" fill="white" />
                  </div>

                  {/* Platform label at bottom */}
                  <span className="text-white/50 text-[10px] uppercase tracking-widest font-medium">
                    {platform}
                  </span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Main Component ── */
export default function SocialReels({ reels, instagramUrl, tiktokUrl, youtubeUrl }: SocialReelsProps) {
  const [modal, setModal] = useState<{ reel: ReelItem; platform: string } | null>(null);

  if (!reels.length) return null;

  const grouped: Record<string, ReelItem[]> = {};
  for (const r of reels) {
    if (!grouped[r.platform]) grouped[r.platform] = [];
    grouped[r.platform].push(r);
  }

  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block mb-4 px-4 py-1.5 bg-emerald-50 text-emerald-600 text-sm font-semibold rounded-full">
            Our Work
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Reels &amp; Content
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Watch our latest creative work, campaign results, and behind-the-scenes content. Click on any reel to play.
          </p>
        </div>

        {/* Platform Sliders */}
        {grouped['instagram'] && (
          <PlatformSlider
            platform="instagram"
            reels={grouped['instagram']}
            profileUrl={instagramUrl}
            onPlay={(r) => setModal({ reel: r, platform: 'instagram' })}
          />
        )}
        {grouped['tiktok'] && (
          <PlatformSlider
            platform="tiktok"
            reels={grouped['tiktok']}
            profileUrl={tiktokUrl}
            onPlay={(r) => setModal({ reel: r, platform: 'tiktok' })}
          />
        )}
        {grouped['youtube'] && (
          <PlatformSlider
            platform="youtube"
            reels={grouped['youtube']}
            profileUrl={youtubeUrl}
            onPlay={(r) => setModal({ reel: r, platform: 'youtube' })}
          />
        )}

        {/* Bottom Follow Buttons */}
        <div className="text-center mt-10">
          <p className="text-sm text-slate-400 mb-3">Follow us for more content</p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {instagramUrl && (
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-slate-100 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-pink-500 hover:to-purple-600 text-slate-600 hover:text-white text-sm font-medium transition-all duration-300"
              >
                <Instagram size={16} />
                Instagram
              </a>
            )}
            {tiktokUrl && (
              <a
                href={tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-900 text-slate-600 hover:text-white text-sm font-medium transition-all duration-300"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V13a8.28 8.28 0 005.58 2.16v-3.44a4.85 4.85 0 01-1-.1V6.69h1z"/></svg>
                TikTok
              </a>
            )}
            {youtubeUrl && (
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-slate-100 hover:bg-red-600 text-slate-600 hover:text-white text-sm font-medium transition-all duration-300"
              >
                <Youtube size={16} />
                YouTube
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <ReelModal
          reel={modal.reel}
          platform={modal.platform}
          onClose={() => setModal(null)}
        />
      )}
    </section>
  );
}