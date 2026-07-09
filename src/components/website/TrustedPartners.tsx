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

const BRAND_COLORS: Record<string, string> = {
  'google': 'bg-blue-50 text-blue-700',
  'meta': 'bg-blue-50 text-blue-600',
  'facebook': 'bg-blue-50 text-blue-600',
  'shopify': 'bg-green-50 text-green-700',
  'hubspot': 'bg-orange-50 text-orange-700',
  'wordpress': 'bg-blue-50 text-indigo-700',
  'tiktok': 'bg-slate-50 text-slate-800',
  'instagram': 'bg-pink-50 text-pink-700',
  'youtube': 'bg-red-50 text-red-700',
  'microsoft': 'bg-blue-50 text-blue-700',
  'aws': 'bg-amber-50 text-amber-700',
  'stripe': 'bg-violet-50 text-violet-700',
};

function getBrandClass(name: string): string {
  const lower = name.toLowerCase();
  for (const [key, cls] of Object.entries(BRAND_COLORS)) {
    if (lower.includes(key)) return cls;
  }
  return 'bg-slate-50 text-slate-600';
}

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
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Our Trusted Partners
          </h2>
          <p className="text-slate-500 mt-2 max-w-lg mx-auto">
            We work with leading platforms and technologies to deliver the best results for our clients.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {partners.map((partner) => {
            const hasImage = partner.imageUrl && !failedImages.has(partner.id);
            const brandClass = getBrandClass(partner.name);

            return (
              <div
                key={partner.id}
                className="flex items-center justify-center p-5 sm:p-6 bg-white rounded-2xl border border-slate-100 hover:shadow-md hover:border-emerald-200 transition-all duration-300 group min-h-[90px]"
              >
                {partner.website ? (
                  <a href={partner.website} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full">
                    {hasImage ? (
                      <img
                        src={partner.imageUrl}
                        alt={partner.name}
                        className="h-8 w-auto max-w-[120px] object-contain opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                        loading="lazy"
                        onError={() => handleImageError(partner.id)}
                      />
                    ) : (
                      <span className={`text-xs sm:text-sm font-bold tracking-wide text-center px-2 py-1 rounded-lg transition-colors ${brandClass} group-hover:scale-105`}>
                        {partner.name}
                      </span>
                    )}
                  </a>
                ) : (
                  hasImage ? (
                    <img
                      src={partner.imageUrl}
                      alt={partner.name}
                      className="h-8 w-auto max-w-[120px] object-contain opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                      loading="lazy"
                      onError={() => handleImageError(partner.id)}
                    />
                  ) : (
                    <span className={`text-xs sm:text-sm font-bold tracking-wide text-center px-2 py-1 rounded-lg transition-colors ${brandClass} group-hover:scale-105`}>
                      {partner.name}
                    </span>
                  )
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}