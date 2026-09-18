"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Fallback images per category keyword
function getCategoryImage(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("skin") || n.includes("serum") || n.includes("gleam"))
    return "/arcure/arcuderm-serum.png";
  if (n.includes("supplement") || n.includes("cal") || n.includes("bone"))
    return "/arcure/arcu-cal-k2.png";
  if (n.includes("vitamin") || n.includes("d3") || n.includes("mida"))
    return "/arcure/mida-d.png";
  if (n.includes("oral") || n.includes("medicine") || n.includes("tablet") || n.includes("capsule"))
    return "/arcure/arcu-cal-k2.png";
  if (n.includes("wash") || n.includes("clean") || n.includes("face"))
    return "/arcure/arcu-gleam.jpeg";
  if (n.includes("moist") || n.includes("cream") || n.includes("lotion"))
    return "/arcure/Arcu_Gleam_Seerom3.jpeg";
  if (n.includes("sun") || n.includes("spf") || n.includes("screen") || n.includes("block"))
    return "/arcure/Arcu_Gleam_Seerom.jpeg";
  return "/arcure/Arcu_Gleam_Seerom2.jpeg";
}export default function CategorySection() {
  const router = useRouter();
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    // Load distinct categories from actual products
    fetch("/api/products")
      .then((r) => r.json())
      .then((products) => {
        if (!Array.isArray(products)) return;
        const cats = Array.from(
          new Set(
            products
              .map((p: { category?: string }) => p.category?.trim())
              .filter(Boolean)
          )
        ) as string[];
        setCategories(cats);
      })
      .catch(() => {});
  }, []);

  const handleClick = (slug: string) => {
    if (slug) {
      router.push(`/?category=${encodeURIComponent(slug)}#products`);
    } else {
      router.push("/#products");
    }
  };

  if (categories.length === 0) return null;

  return (
    <section className="py-14 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900 uppercase tracking-widest">
            Shop By Category
          </h2>
          <div className="w-10 h-[3px] bg-[#a83866] rounded-full mx-auto mt-3" />
        </div>

        <div className="flex flex-wrap justify-center gap-6 sm:gap-8 lg:gap-12">
          {/* Dynamic categories from DB */}
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleClick(cat)}
              className="flex flex-col items-center gap-3 group cursor-pointer"
            >
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 lg:w-36 lg:h-36 rounded-full overflow-hidden border-[3px] border-[#f4c5d6] group-hover:border-[#a83866] transition-all duration-300 shadow-md group-hover:shadow-xl group-hover:shadow-[#a83866]/20 group-hover:scale-105 bg-[#fdf4f7]">
                <Image
                  src={getCategoryImage(cat)}
                  alt={cat}
                  fill
                  sizes="(max-width: 640px) 96px, (max-width: 1024px) 112px, 144px"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-gray-700 group-hover:text-[#a83866] transition-colors uppercase tracking-wider text-center leading-tight max-w-[90px]">
                {cat}
              </span>
            </button>
          ))}

          {/* All Products button always at end */}
          <button
            onClick={() => handleClick("")}
            className="flex flex-col items-center gap-3 group cursor-pointer"
          >
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 lg:w-36 lg:h-36 rounded-full overflow-hidden border-[3px] border-[#f4c5d6] group-hover:border-[#a83866] transition-all duration-300 shadow-md group-hover:shadow-xl group-hover:shadow-[#a83866]/20 group-hover:scale-105 bg-[#fdf4f7]">
              <Image
                src="/arcure/Arcu_Gleam_Seerom3.jpeg"
                alt="All Products"
                fill
                sizes="(max-width: 640px) 96px, (max-width: 1024px) 112px, 144px"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <span className="text-[11px] sm:text-xs font-bold text-gray-700 group-hover:text-[#a83866] transition-colors uppercase tracking-wider text-center leading-tight">
              All Products
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
