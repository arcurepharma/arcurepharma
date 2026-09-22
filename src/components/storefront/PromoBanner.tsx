"use client";

import Image from "next/image";
import Link from "next/link";

export default function PromoBanner() {
  return (
    <section className="py-4 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 overflow-hidden rounded-2xl shadow-lg min-h-[260px] lg:min-h-[340px]">

          {/* Left â€” promo text */}
          <div className="bg-[#fcb8fd] px-8 sm:px-12 py-10 sm:py-14 flex flex-col justify-center">
            <p className="text-white/70 text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] mb-3">
              Limited Time Offer
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-[1.15] mb-4">
              Up to 30% Off<br />on Best Sellers
            </h2>
            <p className="text-white/75 text-sm sm:text-base leading-relaxed mb-8">
              Glow more, spend less.<br />Treat your skin today!
            </p>
            <div>
              <Link
                href="/#products"
                className="inline-flex items-center gap-2 px-7 py-3 border-2 border-white text-white font-bold text-xs sm:text-sm rounded-full hover:bg-white hover:text-[#fcb8fd] transition-all duration-300 active:scale-95 tracking-wider uppercase"
              >
                Shop the Sale
              </Link>
            </div>
          </div>

          {/* Right â€” product image */}
          <div className="relative bg-[#fff5fe] min-h-[220px] sm:min-h-[280px]">
            <Image
              src="/arcure/Arcu_Gleam_Seerom3.jpeg"
              alt="Arcure Pharma Best Sellers"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#fcb8fd]/10 to-transparent" />
          </div>

        </div>
      </div>
    </section>
  );
}



