"use client";

import { Newspaper, Star, Award, ShieldCheck } from "lucide-react";
import { useReveal } from "@/lib/useReveal";

const TRUSTED_BY = [
  { name: "100+ Pharmacies", icon: ShieldCheck },
  { name: "10,000+ Customers", icon: Star },
  { name: "Dermatologist Approved", icon: Award },
  { name: "FDA Certified", icon: ShieldCheck },
  { name: "ISO Certified", icon: Award },
  { name: "Quality Assured", icon: Star },
];

export default function PressLogos() {
  const { ref: headerRef, visible: headerVisible } = useReveal();

  return (
    <section className="py-14 lg:py-20 bg-gradient-to-br from-teal-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={headerRef}
          className={`text-center mb-10 reveal ${headerVisible ? "is-visible" : ""}`}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-teal-100 text-teal-800 text-sm font-semibold rounded-full mb-4">
            <Newspaper className="w-4 h-4" />
            Trusted & Certified
          </span>
          <h2 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-2">
            Pakistan&apos;s Trusted Pharmaceutical Brand
          </h2>
          <p className="text-gray-600 mt-2 max-w-xl mx-auto">
            Recognized for quality, safety, and customer satisfaction
          </p>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
          {TRUSTED_BY.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-teal-200 group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm font-bold text-gray-900 text-center leading-snug">
                  {item.name}
                </p>
              </div>
            );
          })}
        </div>

        {/* Additional Trust Statement */}
        <div className="mt-12 text-center">
          <p className="text-gray-700 font-medium">
            Serving Pakistan with <span className="text-teal-700 font-bold">Premium Healthcare Products</span> since 2020
          </p>
        </div>
      </div>
    </section>
  );
}