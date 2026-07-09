'use client';

import { Instagram, Play, Youtube, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';

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
  // Instagram: convert /reel/ID/ or /p/ID/ to embed
  const reelMatch = reelUrl.match(/\/(reel|p)\/([^/?]+)/);
  if (reelMatch) {
    const type = reelMatch[1];
    const id = reelMatch[2];
    return `https://www.instagram.com/${type}/${id}/embed`;
  }
  return reelUrl;
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

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 280;
    scrollRef.current.scrollBy({
      left: dir === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  if (!reels.length) return null;

  const config = {
    instagram: {
      label: 'Instagram Reels',
      icon: <Instagram size={18} className="text-pink-500" />,
      gradient: 'from-pink-500 via-purple-500 to-orange-400',
      btnBg: 'hover:from-pink-500 hover:via-purple-500 hover:to-orange-400',
      borderHover: 'hover:border-pink-200',
    },
    tiktok: {
      label: 'TikTok Reels',
      icon: <Play size={18} className="text-slate-800" />,
      gradient: 'from-slate-800 via-slate-700 to-cyan-400',
      btnBg: 'hover:from-slate-800 hover:to-cyan-500',
      borderHover: 'hover:border-cyan-200',
    },
    youtube: {
      label: 'YouTube Shorts',
      icon: <Youtube size={18} className="text-red-500" />,
      gradient: 'from-red-500 via-red-600 to-red-700',
      btnBg: 'hover:from-red-500 hover:to-red-600',
      borderHover: 'hover:border-red-200',
    },
  }[platform] || {
    label: 'Reels',
    icon: <Play size={18} />,
    gradient: 'from-slate-600 to-slate-800',
    btnBg: 'hover:from-slate-600 hover:to-slate-800',
    borderHover: 'hover:border-slate-200',
  };

  return (
    <div className="mb-10 last:mb-0">
      {/* Platform Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center`}>
            {config.icon}
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">{config.label}</h3>
            <p className="text-xs text-slate-400">{reels.length} reels</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {profileUrl && (
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold transition-all duration-300 ${config.btnBg} text-white`}
            >
              Follow Us
            </a>
          )}
          <button
            onClick={() => scroll('left')}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft size={16} className="text-slate-600" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight size={16} className="text-slate-600" />
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Row */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {reels.map((reel) => {
          const embedUrl = getEmbedUrl(reel.reelUrl, reel.platform);
          return (
            <div
              key={reel.id}
              className={`flex-shrink-0 w-[260px] sm:w-[280px] snap-start rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-sm hover:shadow-xl ${config.borderHover} transition-all duration-300`}
            >
              {/* 9:16 aspect ratio embed */}
              <div className="relative w-full" style={{ paddingBottom: '177.78%' }}>
                <iframe
                  src={embedUrl}
                  className="absolute inset-0 w-full h-full"
                  allowFullScreen
                  allow="autoplay; encrypted-media"
                  loading="lazy"
                  title={`${config.label} - ${reel.id}`}
                  style={{ border: 'none', overflow: 'hidden', borderRadius: '16px' }}
                />
              </div>
            </div>
          );
        })}
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
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block mb-4 px-4 py-1.5 bg-emerald-50 text-emerald-600 text-sm font-semibold rounded-full">
            Our Work
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Reels &amp; Content
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Watch our latest creative work, campaign results, and behind-the-scenes content directly on our website.
          </p>
        </div>

        {/* Platform Rows */}
        {grouped['instagram'] && (
          <PlatformRow
            platform="instagram"
            reels={grouped['instagram']}
            profileUrl={instagramUrl}
          />
        )}
        {grouped['tiktok'] && (
          <PlatformRow
            platform="tiktok"
            reels={grouped['tiktok']}
            profileUrl={tiktokUrl}
          />
        )}
        {grouped['youtube'] && (
          <PlatformRow
            platform="youtube"
            reels={grouped['youtube']}
            profileUrl={youtubeUrl}
          />
        )}

        {/* Bottom Follow Buttons */}
        <div className="text-center mt-10">
          <p className="text-sm text-slate-400 mb-3">
            Follow us for more content
          </p>
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
                <Play size={16} />
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
    </section>
  );
}