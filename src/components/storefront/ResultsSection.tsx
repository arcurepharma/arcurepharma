"use client";

import Image from "next/image";
import { useReveal } from "@/lib/useReveal";

const results = [
  {
    id: 1,
    name: "User 1",
    before: "/results/result-1-before.jpg",
    after: "/results/result-1-after.jpg",
    description: "Forehead acne cleared significantly after consistent use",
  },
  {
    id: 2,
    name: "User 2",
    before: "/results/result-2-before.jpg",
    after: "/results/result-2-after.jpg",
    description: "Severe cheek breakouts visibly reduced within weeks",
  },
];

export default function ResultsSection() {
  const { ref, visible } = useReveal();

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-white to-teal-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          ref={ref}
          className={`text-center mb-12 lg:mb-16 reveal ${visible ? "is-visible" : ""}`}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-teal-50 text-teal-700 text-xs sm:text-sm font-semibold rounded-full mb-4">
            ✨ Real People, Real Results
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Before &amp; After Results
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm sm:text-lg">
            See the transformation our customers have experienced with consistent use of our products.
          </p>
          <div className="w-16 h-1 bg-teal-500 rounded-full mx-auto mt-6" />
        </div>

        {/* Results Grid */}
        <div className="space-y-16 lg:space-y-20">
          {results.map((result, index) => (
            <div
              key={result.id}
              className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-12 ${
                index % 2 !== 0 ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Before */}
              <div className="w-full lg:w-1/2 flex flex-col items-center">
                <div className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-lg border border-red-100">
                  <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                    BEFORE
                  </div>
                  <Image
                    src={result.before}
                    alt={`${result.name} before`}
                    width={500}
                    height={500}
                    className="w-full h-72 sm:h-80 object-cover"
                  />
                </div>
              </div>

              {/* Arrow / Divider */}
              <div className="flex flex-col items-center justify-center gap-3 shrink-0">
                <div className="hidden lg:flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center shadow-md">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </div>
                </div>
                <div className="lg:hidden w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center shadow-md rotate-90">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </div>
                <p className="text-xs text-gray-400 font-medium text-center max-w-[100px]">
                  {result.description}
                </p>
              </div>

              {/* After */}
              <div className="w-full lg:w-1/2 flex flex-col items-center">
                <div className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-lg border border-teal-100">
                  <div className="absolute top-3 left-3 z-10 bg-teal-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                    AFTER
                  </div>
                  <Image
                    src={result.after}
                    alt={`${result.name} after`}
                    width={500}
                    height={500}
                    className="w-full h-72 sm:h-80 object-cover"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p className="text-center text-xs text-gray-400 mt-12">
          * Individual results may vary. Consistent use as directed is recommended.
        </p>
      </div>
    </section>
  );
}
