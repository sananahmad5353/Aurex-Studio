'use client';

import { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  imageUrl: string;
}

interface ClientReviewsProps {
  testimonials: TestimonialItem[];
}

export default function ClientReviews({ testimonials }: ClientReviewsProps) {
  const [current, setCurrent] = useState(0);
  const itemsPerView = typeof window !== 'undefined' && window.innerWidth >= 1024 ? 3 : typeof window !== 'undefined' && window.innerWidth >= 640 ? 2 : 1;

  const maxIndex = Math.max(0, testimonials.length - itemsPerView);

  const next = () => setCurrent((c) => Math.min(c + 1, maxIndex));
  const prev = () => setCurrent((c) => Math.max(c - 1, 0));

  if (!testimonials.length) return null;

  return (
    <section id="reviews" className="py-20 sm:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block mb-4 px-4 py-1.5 bg-emerald-50 text-emerald-600 text-sm font-semibold rounded-full">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Clients Reviews
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Hear what our clients have to say about their experience working with Aurex Studio.
          </p>
        </div>

        <div className="relative">
          {/* Cards container */}
          <div className="overflow-hidden">
            <div
              className="flex gap-6 transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${current * (100 / itemsPerView + 1.5)}%)` }}
            >
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="flex-shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
                >
                  <div className="h-full p-6 sm:p-8 rounded-2xl border border-slate-100 bg-white hover:shadow-lg hover:border-emerald-100 transition-all duration-300 relative">
                    <Quote className="absolute top-6 right-6 w-8 h-8 text-emerald-100" />

                    {/* Stars */}
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < t.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}
                        />
                      ))}
                    </div>

                    <p className="text-slate-600 leading-relaxed mb-6 text-sm sm:text-base">
                      &ldquo;{t.content}&rdquo;
                    </p>

                    <div className="flex items-center gap-3 mt-auto">
                      <div className="w-11 h-11 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        {t.imageUrl ? (
                          <img src={t.imageUrl} alt={t.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <span className="text-emerald-700 font-bold text-sm">
                            {t.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{t.name}</p>
                        <p className="text-xs text-slate-500">
                          {t.role}{t.company ? `, ${t.company}` : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          {testimonials.length > itemsPerView && (
            <div className="flex justify-center items-center gap-3 mt-8">
              <button
                onClick={prev}
                disabled={current === 0}
                className="p-2.5 rounded-full border border-slate-200 text-slate-500 hover:border-emerald-300 hover:text-emerald-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous reviews"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="flex gap-2">
                {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === current ? 'w-8 bg-emerald-500' : 'w-2 bg-slate-200 hover:bg-slate-300'
                    }`}
                    aria-label={`Go to page ${i + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={next}
                disabled={current >= maxIndex}
                className="p-2.5 rounded-full border border-slate-200 text-slate-500 hover:border-emerald-300 hover:text-emerald-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Next reviews"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}