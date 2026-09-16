"use client";

import Image from "next/image";
import Link from "next/link";

const categories = [
  { name: "SKINCARE",     image: "/arcure/arcuderm-serum.png",        href: "/#products" },
  { name: "FACE WASH",    image: "/arcure/arcu-gleam.jpeg",           href: "/#products" },
  { name: "SERUMS",       image: "/arcure/Arcu_Gleam_Seerom.jpeg",    href: "/#products" },
  { name: "SUPPLEMENTS",  image: "/arcure/arcu-cal-k2.png",           href: "/#products" },
  { name: "VITAMINS",     image: "/arcure/mida-d.png",                href: "/#products" },
  { name: "ALL PRODUCTS", image: "/arcure/Arcu_Gleam_Seerom2.jpeg",   href: "/#products" },
];

export default function CategorySection() {
  return (
    <section className="py-14 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900 uppercase tracking-widest">
            Shop By Category
          </h2>
          <div className="w-10 h-[3px] bg-[#a83866] rounded-full mx-auto mt-3" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 sm:gap-6 lg:gap-10">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="flex flex-col items-center gap-3 group"
            >
              {/* Circle */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden border-[3px] border-[#f4c5d6] group-hover:border-[#a83866] transition-all duration-300 shadow-sm group-hover:shadow-md group-hover:shadow-[#a83866]/20 group-hover:scale-105 bg-[#fdf4f7]">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 80px, (max-width: 1024px) 96px, 128px"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              {/* Label */}
              <span className="text-[10px] sm:text-xs font-bold text-gray-700 group-hover:text-[#a83866] transition-colors uppercase tracking-wider text-center leading-tight">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
