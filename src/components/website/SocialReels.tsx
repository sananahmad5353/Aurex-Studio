'use client';

import { Instagram, Play, Youtube, ExternalLink } from 'lucide-react';

interface ReelItem { id: string; platform: string; reelUrl: string; }

interface SocialReelsProps {
  reels: ReelItem[];
  instagramUrl?: string;
  tiktokUrl?: string;
  youtubeUrl?: string;
}

const PLATFORM_CFG = {
  instagram: {
    label: 'Instagram Reels',
    gradient: 'from-pink-500 via-purple-500 to-orange-400',
    cardGradient: 'from-pink-600 via-purple-600 to-orange-500',
    icon: <Instagram size={20} className="text-white" />,
    badge: 'bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600',
  },
  tiktok: {
    label: 'TikTok Reels',
    gradient: 'from-slate-800 via-slate-700 to-cyan-400',
    cardGradient: 'from-slate-900 via-slate-800 to-cyan-500',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-white">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V13a8.28 8.28 0 005.58 2.16v-3.44a4.85 4.85 0 01-1-.1V6.69h1z"/>
      </svg>
    ),
    badge: 'bg-slate-900',
  },
  youtube: {
    label: 'YouTube Shorts',
    gradient: 'from-red-500 via-red-600 to-red-700',
    cardGradient: 'from-red-700 via-red-600 to-red-500',
    icon: <Youtube size={20} className="text-white" />,
    badge: 'bg-red-600',
  },
} as const;

function ThumbnailCard({ reel, platform, index }: { reel: ReelItem; platform: string; index: number }) {
  const cfg = PLATFORM_CFG[platform as keyof typeof PLATFORM_CFG] || PLATFORM_CFG.instagram;

  return (
    <a
      href={reel.reelUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex-shrink-0 w-[160px] sm:w-[180px] lg:w-[200px] snap-start group"
    >
      <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-xl hover:border-slate-300 hover:-translate-y-1 transition-all duration-300">
        {/* Thumbnail area */}
        <div className={`relative w-full aspect-[9/16] bg-gradient-to-br ${cfg.cardGradient} flex items-center justify-center overflow-hidden`}>
          {/* Decorative circles */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full border-2 border-white" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full border-2 border-white" />
          </div>

          {/* Platform icon watermark */}
          <div className="absolute top-3 left-3">
            <div className={`w-7 h-7 rounded-lg ${cfg.badge} flex items-center justify-center opacity-80`}>
              {cfg.icon}
            </div>
          </div>

          {/* Reel number */}
          <div className="absolute top-3 right-3">
            <span className="text-white/70 text-xs font-medium bg-black/20 px-2 py-0.5 rounded-full backdrop-blur-sm">
              #{index + 1}
            </span>
          </div>

          {/* Play button */}
          <div className="relative z-10 w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/35 group-hover:scale-110 transition-all duration-300 border border-white/30">
            <Play size={24} className="text-white ml-1" fill="white" />
          </div>

          {/* Bottom gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/40 to-transparent" />

          {/* Platform name at bottom */}
          <div className="absolute bottom-3 left-3 right-3">
            <p className="text-white text-xs font-semibold drop-shadow-lg capitalize">{platform}</p>
          </div>
        </div>

        {/* Card footer */}
        <div className="px-3 py-2.5 flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Reel {index + 1}</span>
          <span className="text-slate-400 group-hover:text-emerald-500 transition-colors">
            <ExternalLink size={13} />
          </span>
        </div>
      </div>
    </a>
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
  if (!reels.length) return null;
  const cfg = PLATFORM_CFG[platform as keyof typeof PLATFORM_CFG] || PLATFORM_CFG.instagram;

  return (
    <div className="mb-10 last:mb-0">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cfg.gradient} flex items-center justify-center shadow-lg`}>
            {cfg.icon}
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">{cfg.label}</h3>
            <p className="text-xs text-slate-400">{reels.length} reels</p>
          </div>
        </div>
        {profileUrl && (
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold hover:bg-slate-800 hover:text-white transition-all duration-300"
          >
            Follow Us
            <ExternalLink size={12} />
          </a>
        )}
      </div>

      {/* Reels row — no scrollbar, flex wrap on large screens */}
      <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory lg:overflow-visible lg:flex-wrap lg:snap-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {reels.map((reel, idx) => (
          <ThumbnailCard key={reel.id} reel={reel} platform={platform} index={idx} />
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