'use client';

interface AboutSectionProps {
  title: string;
  description: string;
  stats: { label: string; value: string }[];
}

export default function AboutSection({ title, description, stats }: AboutSectionProps) {
  return (
    <section id="about" className="py-20 sm:py-28 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left - Image Grid */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden aspect-[4/5] bg-emerald-100">
                  <img
                    src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&q=80&auto=format&fit=crop"
                    alt="Digital strategy meeting"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden aspect-square bg-emerald-200">
                  <img
                    src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&q=80&auto=format&fit=crop"
                    alt="Team collaboration"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="rounded-2xl overflow-hidden aspect-square bg-emerald-100">
                  <img
                    src="https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=400&q=80&auto=format&fit=crop"
                    alt="Growth analytics"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden aspect-[4/5] bg-emerald-200">
                  <img
                    src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&q=80&auto=format&fit=crop"
                    alt="Marketing results"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-4 -right-4 sm:bottom-4 sm:right-4 bg-emerald-500 text-white rounded-2xl p-4 sm:p-6 shadow-xl shadow-emerald-500/20">
              <div className="text-3xl sm:text-4xl font-bold">8+</div>
              <div className="text-sm text-emerald-100">Years of Excellence</div>
            </div>
          </div>

          {/* Right - Content */}
          <div>
            <span className="inline-block mb-4 px-4 py-1.5 bg-emerald-50 text-emerald-600 text-sm font-semibold rounded-full">
              About Us
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">{title}</h2>
            <p className="text-slate-500 text-lg leading-relaxed mb-8">
              {description}
            </p>

            {/* Stats */}
            {stats.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                  <div key={i} className="text-center sm:text-left">
                    <div className="text-2xl sm:text-3xl font-bold text-emerald-600">{stat.value}</div>
                    <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}