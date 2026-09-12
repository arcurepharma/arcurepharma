"use client";

import { useState } from "react";
import { Star, BadgeCheck, ArrowRight, Quote } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useReveal } from "@/lib/useReveal";

interface Result {
  imageUrl: string;
  name: string;
  duration: string;
  rating: number;
  text: string;
}

const FALLBACK_RESULTS: Result[] = [
  {
    imageUrl: "/jenpharm/result-huma.jpg",
    name: "Huma",
    duration: "6 weeks",
    rating: 5,
    text: "MandelAC Serum helped calm my active acne significantly. Breakouts reduced, inflammation went down, and my skin feels clearer and healthier within just a few weeks!",
  },
  {
    imageUrl: "/jenpharm/result-zoha.jpg",
    name: "Zoha",
    duration: "4 weeks",
    rating: 5,
    text: "Maxdif Moisturizer keeps my skin so hydrated all day. Tone looks brighter, more even, and my dull patches have really improved with regular use!",
  },
  {
    imageUrl: "/jenpharm/result-mubeen.jpg",
    name: "Mubeen",
    duration: "3 months",
    rating: 5,
    text: "If used as advised, this actually works! I've been using it for 3 months and noticed an inch of multiple hair growth where my hair was receding. My hair is much fuller now!",
  },
  {
    imageUrl: "/jenpharm/result-shahid.jpg",
    name: "Shahid",
    duration: "4 weeks",
    rating: 5,
    text: "Since adding Maxdif Cream to my routine, my hyperpigmentation has noticeably reduced. Skin feels smoother, brighter, and so much more even toned now!",
  },
];

export default function ResultsTrust() {
  const [results] = useState<Result[]>(FALLBACK_RESULTS);
  const { ref: headerRef, visible: headerVisible } = useReveal();
  const { ref: gridRef, visible: gridVisible } = useReveal();

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={headerRef}
          className={`text-center mb-16 reveal ${headerVisible ? "is-visible" : ""}`}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-700 text-sm font-semibold rounded-full mb-4">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            Real Results
          </span>
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
            Results You Can Trust
          </h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto text-lg">
            Real Skin. Real Results. Zero Filters.
          </p>
          <div className="section-divider mt-6" />
        </div>

        <div
          ref={gridRef}
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 reveal ${gridVisible ? "is-visible" : ""}`}
        >
          {results.map((r, i) => (
            <div
              key={i}
              className="group bg-[#e5f2ff] rounded-3xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Image */}
              <div className="relative aspect-[4/5] overflow-hidden bg-[#eef0f4]">
                <Image
                  src={r.imageUrl}
                  alt={`${r.name} - before and after results`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-gray-800 shadow-sm">
                  After {r.duration}
                </div>
                <div className="absolute bottom-3 right-3 flex gap-1 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      className="w-3 h-3 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-600 text-[13px] leading-relaxed line-clamp-4 mb-5">
                  &ldquo;{r.text}&rdquo;
                </p>
                <div className="flex items-center gap-2.5 pt-4 border-t border-white/60">
                  <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                    {r.name[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-sm truncate">
                      {r.name}
                    </p>
                    <p className="text-gray-400 text-[11px] truncate">
                      Verified Customer after {r.duration}
                    </p>
                  </div>
                  <BadgeCheck className="w-4 h-4 text-blue-500 shrink-0" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/reviews"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-full transition-all hover:shadow-lg hover:shadow-blue-600/25 active:scale-95"
          >
            <Quote className="w-4 h-4" />
            Read All Reviews
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}