"use client";

import Image from "next/image";
import { useReveal } from "@/lib/useReveal";

const results = [
  {
    id: 1,
    label: "Before",
    image: "/results/result-1-before.jpg",
    tag: "BEFORE",
    tagColor: "bg-gray-700",
    border: "border-gray-200",
  },
  {
    id: 2,
    label: "After",
    image: "/results/result-1-after.jpg",
    tag: "AFTER",
    tagColor: "bg-[#fcb8fd]",
    border: "border-[#fde8fc]",
  },
  {
    id: 3,
    label: "Before",
    image: "/results/result-2-before.jpg",
    tag: "BEFORE",
    tagColor: "bg-gray-700",
    border: "border-gray-200",
  },
  {
    id: 4,
    label: "After",
    image: "/results/result-2-after.jpg",
    tag: "AFTER",
    tagColor: "bg-[#fcb8fd]",
    border: "border-[#fde8fc]",
  },
];

export default function ResultsSection() {
  const { ref, visible } = useReveal();

  return (
    <section className="py-14 lg:py-20 bg-gradient-to-b from-white to-[#fff5fe]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div
          ref={ref}
          className={`text-center mb-10 reveal ${visible ? "is-visible" : ""}`}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#fff5fe] text-[#fcb8fd] text-xs sm:text-sm font-semibold rounded-full mb-4 border border-[#fde8fc]">
            âœ¨ Real People, Real Results
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            Before &amp; After Results
          </h2>
          <p className="text-gray-400 max-w-md mx-auto text-sm">
            See the transformation our customers have experienced.
          </p>
          <div className="w-12 h-1 bg-[#fcb8fd] rounded-full mx-auto mt-4" />
        </div>

        {/* 4 images in one horizontal row */}
        <div className="grid grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
          {results.map((r) => (
            <div key={r.id} className="flex flex-col items-center gap-2">
              {/* Round image */}
              <div className={`relative w-full aspect-square rounded-full overflow-hidden border-4 ${r.border} shadow-md`}>
                <Image
                  src={r.image}
                  alt={r.label}
                  fill
                  sizes="(max-width: 640px) 25vw, (max-width: 1024px) 20vw, 200px"
                  className="object-cover"
                />
                {/* Tag badge */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                  <span className={`${r.tagColor} text-white text-[8px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded-full whitespace-nowrap shadow`}>
                    {r.tag}
                  </span>
                </div>
              </div>
              {/* Label */}
              <p className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${
                r.tag === "AFTER" ? "text-[#fcb8fd]" : "text-gray-500"
              }`}>
                {r.label}
              </p>
            </div>
          ))}
        </div>

        {/* Arrow indicators between pairs */}
        <div className="flex justify-around mt-1 px-[12.5%]">
          {[0, 1].map((i) => (
            <div key={i} className="flex items-center gap-1 text-[#fcb8fd]">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          ))}
        </div>

        <p className="text-center text-[10px] sm:text-xs text-gray-400 mt-6">
          * Individual results may vary. Consistent use as directed is recommended.
        </p>
      </div>
    </section>
  );
}



