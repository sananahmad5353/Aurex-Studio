'use client';

interface PartnerItem {
  id: string;
  name: string;
  imageUrl: string;
  website: string;
}

interface TrustedPartnersProps {
  partners: PartnerItem[];
}

export default function TrustedPartners({ partners }: TrustedPartnersProps) {
  if (!partners.length) return null;

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

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="flex items-center justify-center p-5 sm:p-6 bg-white rounded-2xl border border-slate-100 hover:shadow-md hover:border-emerald-200 transition-all duration-300 group"
            >
              {partner.website ? (
                <a href={partner.website} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full">
                  <img
                    src={partner.imageUrl}
                    alt={partner.name}
                    className="h-8 w-auto max-w-full object-contain opacity-50 group-hover:opacity-100 transition-opacity duration-300"
                    loading="lazy"
                  />
                </a>
              ) : (
                <img
                  src={partner.imageUrl}
                  alt={partner.name}
                  className="h-8 w-auto max-w-full object-contain opacity-50 group-hover:opacity-100 transition-opacity duration-300"
                  loading="lazy"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}