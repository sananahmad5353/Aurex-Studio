'use client';

import { Instagram, Play, Youtube } from 'lucide-react';

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

function getPlatformIcon(platform: string) {
  switch (platform) {
    case 'tiktok':
      return <Play size={12} className="text-white" />;
    case 'youtube':
      return <Youtube size={14} className="text-white" />;
    default:
      return <Instagram size={14} className="text-white" />;
  }
}

function getPlatformLabel(platform: string) {
  switch (platform) {
    case 'tiktok': return 'TikTok';
    case 'youtube': return 'YouTube';
    default: return 'Instagram';
  }
}

export default function SocialReels({ reels, instagramUrl, tiktokUrl, youtubeUrl }: SocialReelsProps) {
  if (!reels.length) return null;

  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block mb-4 px-4 py-1.5 bg-emerald-50 text-emerald-600 text-sm font-semibold rounded-full">
            Our Work
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Reels & Content
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Watch our latest creative work, campaign results, and behind-the-scenes content directly on our website.
          </p>
        </div>

        {/* Reels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reels.map((reel) => {
            const embedUrl = getEmbedUrl(reel.reelUrl, reel.platform);

            return (
              <div
                key={reel.id}
                className="group relative rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500"
              >
                {/* Platform badge */}
                <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md">
                  {getPlatformIcon(reel.platform)}
                  <span className="text-white text-xs font-medium">
                    {getPlatformLabel(reel.platform)}
                  </span>
                </div>

                {/* Embed container - 9:16 aspect ratio */}
                <div className="relative w-full" style={{ paddingBottom: '177.78%' }}>
                  <iframe
                    src={embedUrl}
                    className="absolute inset-0 w-full h-full"
                    allowFullScreen
                    allow="autoplay; encrypted-media"
                    loading="lazy"
                    title={`${getPlatformLabel(reel.platform)} reel`}
                    style={{ border: 'none', overflow: 'hidden', borderRadius: '16px' }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom hint */}
        <div className="text-center mt-10">
          <p className="text-sm text-slate-400">
            Follow us for more content
          </p>
          <div className="flex items-center justify-center gap-4 mt-3">
            {instagramUrl && (
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-pink-500 hover:to-purple-600 text-slate-600 hover:text-white text-sm font-medium transition-all duration-300"
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
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-900 text-slate-600 hover:text-white text-sm font-medium transition-all duration-300"
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
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 hover:bg-red-600 text-slate-600 hover:text-white text-sm font-medium transition-all duration-300"
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