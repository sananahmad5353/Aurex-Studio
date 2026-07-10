'use client';

import {
  Target, BarChart3, TrendingUp, Rocket, Users, Filter, Handshake, Lightbulb,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface ServicesSectionProps {
  services: ServiceItem[];
}

const iconMap: Record<string, LucideIcon> = {
  Target, BarChart3, TrendingUp, Rocket, Users, Filter, Handshake, Lightbulb,
};

export default function ServicesSection({ services }: ServicesSectionProps) {
  return (
    <section id="services" className="py-20 sm:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block mb-4 px-4 py-1.5 bg-emerald-50 text-emerald-600 text-sm font-semibold rounded-full">
            What We Do
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Our Services
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Comprehensive digital marketing solutions designed to accelerate your business growth and maximize your online impact.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => {
            const IconComponent = iconMap[service.icon] || TrendingUp;
            return (
              <div
                key={service.id}
                className="group relative p-6 rounded-2xl border border-slate-100 bg-white hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-5 group-hover:bg-emerald-500 transition-colors duration-300">
                  <IconComponent
                    className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors duration-300"
                  />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{service.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">{service.description}</p>
                <a
                  href="#contact"
                  className="inline-flex items-center text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  Read More
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}