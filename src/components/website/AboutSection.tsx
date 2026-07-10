'use client';

interface AboutSectionProps {
  title: string;
  description: string;
  stats: { label: string; value: string }[];
  images: string[];
}

export default function AboutSection({ title, description, stats, images }: AboutSectionProps) {
  const imgs = images.length >= 4 ? images : [
    'https://sfile.chatglm.cn/images-ppt/1f40a979f6b5.jpg',
    'https://sfile.chatglm.cn/images-ppt/a3d51ca2c3b1.png',
    'https://sfile.chatglm.cn/images-ppt/1b880d7958b7.png',
    'https://sfile.chatglm.cn/images-ppt/e5cedb6c668d.jpg',
  ];

  return (
    <section id="about" className="py-20 sm:py-28 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left - Image Grid */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden aspect-[4/5] bg-slate-200">
                  <img src={imgs[0]} alt="Digital strategy" className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="rounded-2xl overflow-hidden aspect-square bg-slate-200">
                  <img src={imgs[1]} alt="Team collaboration" className="w-full h-full object-cover" loading="lazy" />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="rounded-2xl overflow-hidden aspect-square bg-slate-200">
                  <img src={imgs[2]} alt="Growth analytics" className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="rounded-2xl overflow-hidden aspect-[4/5] bg-slate-200">
                  <img src={imgs[3]} alt="Marketing results" className="w-full h-full object-cover" loading="lazy" />
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