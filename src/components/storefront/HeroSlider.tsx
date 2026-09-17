"use client";

import { useState, useEffect, useCallback } from "react";
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
    title: "Radiant Skin.\nReal Confidence.",
    subtitle: "Clean beauty that nourishes, enhances and empowers you.",
  },
  {
    id: "fallback-2",
    imageUrl: "/arcure/Arcu_Gleam_Seerom2.jpeg",
    title: "ARCU GLEAM\nFace Wash",
    subtitle: "Deep cleanse, oil control, and hydration boost for clear, fresh skin.",
  },
  {
    id: "fallback-3",
    imageUrl: "/arcure/Arcu_Gleam_Seerom3.jpeg",
    title: "Complete Health\n& Wellness",
    subtitle: "Strong bones, better immunity, better you.",
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
        if (settingsData?.slider_duration) {
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
    setCurrent((c) => (c + 1) % (slides.length || 1));
  }, [slides.length]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + (slides.length || 1)) % (slides.length || 1));
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(next, duration);
    return () => clearInterval(timer);
  }, [next, slides.length, duration]);

  const displaySlides = slides.length > 0 ? slides : FALLBACK_SLIDES;

  if (loading) {
    return (
      <section className="relative w-full h-[260px] sm:h-[380px] lg:h-[500px] bg-[#f5e6ed] mt-[64px] lg:mt-[68px] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#a83866]/20 border-t-[#a83866] rounded-full animate-spin" />
      </section>
    );
  }

  return (
    <section className="relative w-full h-[260px] sm:h-[380px] lg:h-[500px] mt-[64px] lg:mt-[68px] overflow-hidden bg-gray-100">

      {/* ── Slides ── */}
      {displaySlides.map((s, i) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Full-width background image */}
          <Image
            src={s.imageUrl}
            alt={s.title || "Arcure Pharma"}
            fill
            sizes="100vw"
            priority={i === 0}
            className="object-cover object-center"
          />

          {/* Gradient overlay — left side so text is readable */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent" />

          {/* Text overlay — only if title exists */}
          {s.title && (
            <div className={`absolute inset-0 flex items-center ${i === current ? "animate-fade-in-up" : "opacity-0"}`}>
              <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full">
                <div className="max-w-xs sm:max-w-sm lg:max-w-md">
                  <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-white/80 mb-2">
                    ARCURE PHARMA
                  </p>
                  <h1 className="text-xl sm:text-3xl lg:text-5xl font-extrabold text-white leading-[1.1] mb-3 sm:mb-4 whitespace-pre-line drop-shadow-lg">
                    {s.title}
                  </h1>
                  {s.subtitle && (
                    <p className="text-white/85 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 max-w-xs drop-shadow">
                      {s.subtitle}
                    </p>
                  )}
                  <Link
                    href="/#products"
                    className="inline-flex items-center px-5 sm:px-7 py-2.5 sm:py-3 bg-[#a83866] hover:bg-[#8a2a52] text-white font-bold text-xs sm:text-sm rounded-md transition-all hover:shadow-lg active:scale-95"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* ── Prev / Next arrows ── */}
      {/* arrows removed */}

      {/* ── Dot indicators ── */}
      {displaySlides.length > 1 && (
        <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 z-20">
          {displaySlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                i === current
                  ? "w-5 sm:w-6 bg-white"
                  : "w-1.5 sm:w-2 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
