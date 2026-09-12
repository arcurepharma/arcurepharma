"use client";

import { useEffect, useRef } from "react";
import { Building2, Sparkles } from "lucide-react";

const clients = [
  "Dermalax Clinic",
  "AB Clinic",
  "Al Khaleej",
  "Shamsi Hospital",
  "Dr. Shaheena",
  "Shan Clinic",
  "Revive Aesthetic Clinic",
  "Dr. Ilayas Clinic",
  "Adnan Khan Hospital",
];

export default function OurClients() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollPosition = 0;
    const scrollSpeed = 1;

    const scroll = () => {
      scrollPosition += scrollSpeed;
      if (scrollPosition >= scrollContainer.scrollWidth / 2) {
        scrollPosition = 0;
      }
      scrollContainer.scrollLeft = scrollPosition;
    };

    const interval = setInterval(scroll, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 sm:py-20 lg:py-28 bg-gradient-to-br from-teal-50 via-white to-teal-50/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-teal-100/80 backdrop-blur-sm text-teal-700 text-sm font-semibold rounded-full mb-4 border border-teal-200/50">
            <Building2 className="w-4 h-4" />
            Our Clients
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Trusted by Healthcare Leaders
          </h2>
          <p className="text-gray-500 text-base sm:text-lg max-w-2xl mx-auto">
            Partnering with Pakistan&apos;s premier clinics and hospitals
          </p>
          <div className="section-divider mt-6" />
        </div>

        {/* Animated Slider */}
        <div className="relative">
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-40 bg-gradient-to-r from-teal-50 via-white/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-40 bg-gradient-to-l from-teal-50 via-white/80 to-transparent z-10 pointer-events-none" />

          {/* Scrolling Container */}
          <div
            ref={scrollRef}
            className="flex gap-4 sm:gap-6 overflow-hidden py-8"
            style={{ scrollBehavior: "auto" }}
          >
            {/* Duplicate array for infinite scroll effect */}
            {[...clients, ...clients, ...clients].map((client, index) => (
              <div
                key={index}
                className="glassmorphism-card water-morphism flex-shrink-0 px-6 sm:px-8 py-6 sm:py-8 rounded-2xl sm:rounded-3xl group hover:scale-105 transition-all duration-300 cursor-pointer min-w-[280px] sm:min-w-[320px]"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-teal-600/30 group-hover:shadow-teal-600/50 transition-all group-hover:rotate-6">
                    <Building2 className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-teal-700 transition-colors truncate">
                      {client}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                      <Sparkles className="w-3 h-3 text-teal-500" />
                      Trusted Partner
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Text */}
        <div className="text-center mt-8 sm:mt-12">
          <p className="text-sm sm:text-base text-gray-600 font-medium">
            Join <span className="text-teal-700 font-bold">{clients.length}+</span> healthcare institutions trusting Arcure Pharma
          </p>
        </div>
      </div>
    </section>
  );
}
