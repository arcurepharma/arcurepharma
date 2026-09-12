"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, ChevronDown, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Slide {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
}

const FALLBACK_SLIDES: Slide[] = [
  {
    id: "fallback-1",
    imageUrl: "/arcure/Arcu_Gleam_Seerom.jpeg",
    title: "Premium Skincare Solutions",
    subtitle: "ARCUDERM CS Serum - Restorative care for glowing, healthy skin",
  },
  {
    id: "fallback-2",
    imageUrl: "/arcure/Arcu_Gleam_Seerom2.jpeg",
    title: "ARCU GLEAM Face Wash",
    subtitle: "Deep cleanse, oil control, and hydration boost for clear, fresh skin",
  },
  {
    id: "fallback-3",
    imageUrl: "/arcure/Arcu_Gleam_Seerom3.jpeg",
    title: "Complete Health & Wellness",
    subtitle: "ARCU-CAL K2 + Mida-D - Strong bones, better immunity, better you",
  },
];

export default function HeroSlider() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(5000);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/sliders").then((r) => r.json()),
      fetch("/api/settings").then((r) => r.json()),
    ])
      .then(([slidesData, settingsData]) => {
        const apiSlides = Array.isArray(slidesData) ? slidesData : [];
        setSlides(apiSlides.length > 0 ? apiSlides : FALLBACK_SLIDES);
        if (settingsData && settingsData.slider_duration) {
          setDuration(Number(settingsData.slider_duration) * 1000);
        }
        setLoading(false);
      })
      .catch(() => {
        setSlides(FALLBACK_SLIDES);
        setLoading(false);
      });
  }, []);

  const next = useCallback(() => {
    if (slides.length === 0) return;
    setCurrent((c) => (c + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    if (slides.length === 0) return;
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(next, duration);
    return () => clearInterval(timer);
  }, [next, slides.length, duration]);

  if (loading) {
    return (
      <section className="relative h-[60vh] lg:h-[80vh] bg-teal-600 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
          <p className="text-white/70 mt-4 text-sm">Loading...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-64 sm:h-80 md:h-96 lg:h-[85vh] overflow-hidden bg-gray-900">
      <div className="relative w-full h-full">
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              i === current ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <Image
              src={slide.imageUrl}
              alt={slide.title || "Arcure Pharma"}
              fill
              sizes="100vw"
              className="object-cover transition-transform duration-[8000ms] ease-out"
              style={{
                transform: i === current ? "scale(1.05)" : "scale(1)",
              }}
              priority={i === 0}
              quality={85}
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 hero-gradient-overlay" />

            {/* Content */}
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 w-full">
                <div className="max-w-2xl">
                  {/* Badge */}
                  <div
                    key={`badge-${i}-${current}`}
                    className={`inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-white/15 backdrop-blur-sm rounded-full border border-white/20 mb-3 sm:mb-6 text-[11px] sm:text-sm ${
                      i === current ? "animate-fade-in-up" : "opacity-0"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-white/90 font-medium">
                      Pakistan&apos;s Trusted Pharmacy
                    </span>
                  </div>

                  {/* Title */}
                  {slide.title && (
                    <h2
                      key={`title-${i}-${current}`}
                      className={`text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-2 sm:mb-6 hero-text-shadow ${
                        i === current ? "animate-fade-in-up" : "opacity-0"
                      }`}
                      style={{ animationDelay: "0.1s" }}
                    >
                      {slide.title}
                    </h2>
                  )}

                  {/* Subtitle */}
                  {slide.subtitle && (
                    <p
                      key={`sub-${i}-${current}`}
                      className={`text-xs sm:text-sm md:text-lg lg:text-xl text-white/85 leading-snug sm:leading-relaxed mb-3 sm:mb-8 max-w-lg line-clamp-2 sm:line-clamp-none ${
                        i === current ? "animate-fade-in-up" : "opacity-0"
                      }`}
                      style={{ animationDelay: "0.25s" }}
                    >
                      {slide.subtitle}
                    </p>
                  )}

                  {/* CTA Buttons */}
                  <div
                    key={`cta-${i}-${current}`}
                    className={`flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 ${
                      i === current ? "animate-fade-in-up" : "opacity-0"
                    }`}
                    style={{ animationDelay: "0.4s" }}
                  >
                    <Link
                      href="/#products"
                      className="inline-flex items-center justify-center gap-1.5 sm:gap-2.5 px-4 sm:px-8 py-2.5 sm:py-4 bg-white text-teal-700 text-xs sm:text-sm font-bold rounded-full shadow-2xl shadow-black/20 hover:shadow-lg hover:scale-105 transition-all duration-300 min-h-[44px]"
                    >
                      Shop Now
                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </Link>
                    <Link
                      href="/#about"
                      className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-8 py-2.5 sm:py-4 bg-white/10 backdrop-blur-sm text-white text-xs sm:text-sm font-semibold rounded-full border border-white/30 hover:bg-white/20 transition-all duration-300 min-h-[44px]"
                    >
                      Learn More
                    </Link>
                  </div>

                  {/* Trust badges */}
                  <div
                    key={`trust-${i}-${current}`}
                    className={`hidden sm:flex items-center gap-4 md:gap-6 mt-6 md:mt-10 ${
                      i === current ? "animate-fade-in-up" : "opacity-0"
                    }`}
                    style={{ animationDelay: "0.55s" }}
                  >
                    {[
                      { label: "100% Genuine", icon: "✓" },
                      { label: "Fast Delivery", icon: "🚚" },
                      { label: "Expert Approved", icon: "★" },
                    ].map((badge) => (
                      <div
                        key={badge.label}
                        className="flex items-center gap-2 text-white/70"
                      >
                        <span className="text-sm">{badge.icon}</span>
                        <span className="text-xs font-medium">
                          {badge.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Scroll indicator */}
        <div className="absolute bottom-4 sm:bottom-8 right-4 sm:right-8 hidden lg:flex flex-col items-center gap-2 text-white/50 animate-bounce z-20">
          <span className="text-[10px] uppercase tracking-[0.2em] font-medium">
            Scroll
          </span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {/* Navigation arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-14 sm:h-14 bg-white/10 backdrop-blur-sm hover:bg-white/25 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 border border-white/20 min-h-[44px] min-w-[44px] sm:min-h-[56px] sm:min-w-[56px]"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </button>
          <button
            onClick={next}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-14 sm:h-14 bg-white/10 backdrop-blur-sm hover:bg-white/25 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 border border-white/20 min-h-[44px] min-w-[44px] sm:min-h-[56px] sm:min-w-[56px]"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3 z-20">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 sm:h-2 rounded-full transition-all duration-500 ${
                  i === current
                    ? "w-6 sm:w-10 bg-white shadow-[0_0_12px_rgba(255,255,255,0.5)]"
                    : "w-1.5 sm:w-2 bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
