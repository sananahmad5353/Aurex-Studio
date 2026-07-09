'use client';

import { useState } from 'react';

interface PartnerItem {
  id: string;
  name: string;
  imageUrl: string;
  website: string;
}

interface TrustedPartnersProps {
  partners: PartnerItem[];
}

const PARTNER_SVG: Record<string, string> = {
  'Google Ads': `<svg viewBox="0 0 24 24" width="80" height="28"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>`,
  'Meta Business': `<svg viewBox="0 0 24 24" width="60" height="28"><linearGradient id="mg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0081FB"/><stop offset="100%" stop-color="#00C6FF"/></linearGradient><path fill="url(#mg)" d="M6.92 5H5.14A5.14 5.14 0 000 10.14v3.72a5.14 5.14 0 005.14 5.14h3.72a5.14 5.14 0 005.14-5.14v-1.78h-4.28a2.57 2.57 0 01-2.57-2.57V5z" transform="translate(2,1) scale(0.85)"/><path fill="#00C6FF" d="M14.14 5h-3.72A5.14 5.14 0 005.28 10.14v3.72a5.14 5.14 0 005.14 5.14h3.72a5.14 5.14 0 005.14-5.14v-3.72A5.14 5.14 0 0014.14 5z" transform="translate(-0.5,-0.5) scale(0.85)"/></svg>`,
  'Shopify': `<svg viewBox="0 0 24 24" width="90" height="28"><path fill="#95BF47" d="M20.03 4.25l-1.67-.08c-.27-.03-.52.17-.58.43L16.5 9.1c-1.42-.85-3.04-1.3-4.75-1.3-1.72 0-3.34.45-4.76 1.3L5.88 4.6c-.07-.26-.32-.46-.58-.43l-1.67.08c-.29.01-.51.27-.47.56l3.13 15.47c.04.2.21.34.41.34h3.26c.21 0 .38-.15.42-.36l.82-4.04a8.94 8.94 0 004.16-1.01l.82 4.05c.04.21.21.36.42.36h3.26c.21 0 .38-.14.41-.34l3.13-15.47c.04-.29-.18-.55-.47-.56z"/></svg>`,
  'HubSpot': `<svg viewBox="0 0 24 24" width="28" height="28"><circle cx="12" cy="12" r="10" fill="#FF7A59"/><circle cx="12" cy="12" r="4" fill="white"/><rect x="11" y="2" width="2" height="6" rx="1" fill="white"/><rect x="11" y="16" width="2" height="6" rx="1" fill="white"/><rect x="2" y="11" width="6" height="2" rx="1" fill="white"/><rect x="16" y="11" width="6" height="2" rx="1" fill="white"/></svg>`,
  'WordPress': `<svg viewBox="0 0 24 24" width="28" height="28"><circle cx="12" cy="12" r="10" fill="#21759B"/><path fill="white" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm-4 6l3-6h2l-3 6z"/></svg>`,
  'TikTok Ads': `<svg viewBox="0 0 24 24" width="24" height="28"><path fill="#000" d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V13a8.28 8.28 0 005.58 2.16v-3.44a4.85 4.85 0 01-1-.1V6.69h1z"/></svg>`,
};

export default function TrustedPartners({ partners }: TrustedPartnersProps) {
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  if (!partners.length) return null;

  const handleImageError = (id: string) => {
    setFailedImages((prev) => new Set(prev).add(id));
  };

  return (
    <section className="py-14 sm:py-20 bg-slate-50 border-y border-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-block mb-3 px-4 py-1.5 bg-emerald-50 text-emerald-600 text-sm font-semibold rounded-full">
            Trusted By
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Our Trusted Partners</h2>
          <p className="text-slate-500 mt-2 max-w-lg mx-auto">
            We work with leading platforms and technologies to deliver the best results.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {partners.map((partner) => {
            const svgHtml = PARTNER_SVG[partner.name];
            const hasImage = partner.imageUrl && !failedImages.has(partner.id);

            const inner = svgHtml ? (
              <div
                className="flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity duration-300 [&>svg]:h-7 [&>svg]:w-auto"
                dangerouslySetInnerHTML={{ __html: svgHtml }}
              />
            ) : hasImage ? (
              <img
                src={partner.imageUrl}
                alt={partner.name}
                className="h-7 w-auto max-w-[120px] object-contain opacity-60 hover:opacity-100 transition-opacity duration-300"
                loading="lazy"
                onError={() => handleImageError(partner.id)}
              />
            ) : (
              <span className="text-sm font-bold text-slate-400 hover:text-emerald-600 transition-colors text-center">
                {partner.name}
              </span>
            );

            return partner.website ? (
              <a
                key={partner.id}
                href={partner.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center p-5 bg-white rounded-2xl border border-slate-100 hover:shadow-md hover:border-emerald-200 transition-all duration-300 min-h-[80px]"
              >
                {inner}
              </a>
            ) : (
              <div
                key={partner.id}
                className="flex items-center justify-center p-5 bg-white rounded-2xl border border-slate-100 hover:shadow-md hover:border-emerald-200 transition-all duration-300 min-h-[80px]"
              >
                {inner}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}