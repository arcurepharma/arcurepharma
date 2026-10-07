"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

export interface Slide {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
}

const FALLBACK_SLIDES: Slide[] = [
  {
    id: "fallback-caramel",
    imageUrl: "/arcure/hero-caramel-banner.png",
    title: "",
    subtitle: "",
  },
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

export default function HeroSlider({ initialSlides }: { initialSlides?: Slide[] }) {
  const [slides, setSlides] = useState<Slide[]>(() =>
    initialSlides && initialSlides.length > 0 ? initialSlides : FALLBACK_SLIDES
  );
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(5000);
  const [ratios, setRatios] = useState<Record<string, number>>({});
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const captureRatio = (id: string, el: HTMLImageElement) => {
    if (el.naturalWidth && el.naturalHeight) {
      setRatios((r) =>
        r[id] ? r : { ...r, [id]: el.naturalWidth / el.naturalHeight }
      );
    }
  };

  useEffect(() => {
    Promise.all([
      fetch("/api/sliders").then((r) => r.json()),
      fetch("/api/settings").then((r) => r.json()),
    ])
      .then(([slidesData, settingsData]) => {
        const apiSlides = Array.isArray(slidesData) ? slidesData : [];
        if (apiSlides.length > 0) {
          setSlides(apiSlides);
        }
        if (settingsData?.slider_duration) {
          setDuration(Number(settingsData.slider_duration) * 1000);
        }
      })
      .catch(() => {});
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

  // Reliable scroll to products — hash-only Links sometimes don't scroll
  // (e.g. when URL already has #products, or before hydration settles)
  const goToProducts = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById("products");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      if (window.location.hash !== "#products") {
        window.history.replaceState(null, "", "#products");
      }
    } else {
      window.location.assign("/#products");
    }
  };

  // Mobile: fit container exactly to the active banner's own ratio (no leftover space)
  const activeId = displaySlides[current]?.id;
  const activeRatio = activeId ? ratios[activeId] : undefined;
  const containerStyle: React.CSSProperties =
    isMobile && activeRatio
      ? { aspectRatio: String(activeRatio) }
      : { aspectRatio: "16/7", minHeight: "180px" };

  return (
    <section
      className="relative w-full mt-[64px] lg:mt-[68px] overflow-hidden bg-gray-100 transition-[aspect-ratio] duration-700"
      style={containerStyle}
    >

      {/* â”€â”€ Slides â”€â”€ */}
      {displaySlides.map((s, i) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Whole banner is clickable — takes user to products */}
          <Link
            href="/#products"
            onClick={goToProducts}
            aria-label="Shop now"
            className="absolute inset-0 z-0 block cursor-pointer"
          >
            {/* Full-width background image — container matches image ratio so nothing is cut or left empty */}
            <Image
              src={s.imageUrl}
              alt={s.title || "Arcure Pharma"}
              fill
              sizes="100vw"
              priority={i === 0}
              className="object-contain sm:object-cover object-center"
              onLoad={(e) => captureRatio(s.id, e.currentTarget)}
            />

            {/* Gradient overlay â€” left side so text is readable */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent" />
          </Link>

          {/* Text overlay â€” only if title exists */}
          {s.title && (
            <div className={`absolute inset-0 flex items-center pointer-events-none ${i === current ? "animate-fade-in-up" : "opacity-0"}`}>
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
                    onClick={goToProducts}
                    className="inline-flex items-center px-5 sm:px-7 py-2.5 sm:py-3 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-xs sm:text-sm rounded-md transition-all hover:shadow-lg active:scale-95 pointer-events-auto"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* â”€â”€ Prev / Next arrows â”€â”€ */}
      {/* arrows removed */}

      {/* â”€â”€ Dot indicators â”€â”€ */}
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



