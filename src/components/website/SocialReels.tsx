'use client';

import { Instagram, Play } from 'lucide-react';

interface ReelItem {
  id: string;
  platform: string;
  reelUrl: string;
}

interface SocialReelsProps {
  reels: ReelItem[];
}

function getEmbedUrl(reelUrl: string, platform: string): string {
  if (platform === 'tiktok') {
    // Extract video ID from various TikTok URL formats
    const match = reelUrl.match(/video\/(\d+)/);
    if (match) return `https://www.tiktok.com/embed/v2/${match[1]}`;
    // Try /@user/video/ID format
    const match2 = reelUrl.match(/\/(\d{15,25})/);
    if (match2) return `https://www.tiktok.com/embed/v2/${match2[1]}`;
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

export default function SocialReels({ reels }: SocialReelsProps) {
  if (!reels.length) return null;

  return (
    <section className="py-20 sm:py-28 bg-slate-50">
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
            const isInstagram = reel.platform === 'instagram';

            return (
              <div
                key={reel.id}
                className="group relative rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500"
              >
                {/* Platform badge */}
                <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md">
                  {isInstagram ? (
                    <Instagram size={14} className="text-white" />
                  ) : (
                    <Play size={12} className="text-white" />
                  )}
                  <span className="text-white text-xs font-medium">
                    {isInstagram ? 'Instagram' : 'TikTok'}
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
                    title={`${isInstagram ? 'Instagram' : 'TikTok'} reel`}
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
            Follow us on{' '}
            <a href="#" className="text-emerald-500 hover:text-emerald-600 font-medium transition-colors">Instagram</a>
            {' '}and{' '}
            <a href="#" className="text-emerald-500 hover:text-emerald-600 font-medium transition-colors">TikTok</a>
            {' '}for more content
          </p>
        </div>
      </div>
    </section>
  );
}