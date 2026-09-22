"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const CATEGORY_IMAGES: Record<string, string> = {
  "Oral Medicines": "/categories/oral-medicines.png",
  "Skin Care":      "/categories/skin-care.png",
  "Skincare":       "/categories/skin-care.png",
  "Moisturizers":   "/categories/moisturizer.png",
  "Moisturizer":    "/categories/moisturizer.png",
  "Sunblock":       "/categories/sunblock.png",
  "Sun Block":      "/categories/sunblock.png",
};

const ALL_PRODUCTS_IMAGE = "/categories/all-products.png";

function getCategoryImage(name: string): string {
  if (CATEGORY_IMAGES[name]) return CATEGORY_IMAGES[name];
  const n = name.toLowerCase();
  if (n.includes("skin") || n.includes("serum"))    return "/categories/skin-care.png";
  if (n.includes("oral") || n.includes("medicine")) return "/categories/oral-medicines.png";
  if (n.includes("moist") || n.includes("cream"))   return "/categories/moisturizer.png";
  if (n.includes("sun") || n.includes("spf"))       return "/categories/sunblock.png";
  if (n.includes("vitamin") || n.includes("d3"))    return "/arcure/mida-d.png";
  if (n.includes("supplement") || n.includes("cal"))return "/arcure/arcu-cal-k2.png";
  return "/categories/all-products.png";
}

function CategoryCircle({
  image, label, onClick,
}: { image: string; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-2 group cursor-pointer">
      <div className="w-20 h-20 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden relative transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${image}?v=${Date.now()}`}
          alt={label}
          className="w-full h-full object-cover scale-[1.18] transition-transform duration-300 group-hover:scale-[1.28]"
        />
      </div>
    </button>
  );
}

export default function CategorySection() {
  const router = useRouter();
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        if (!Array.isArray(data)) return;
        const cats = Array.from(
          new Set(data.map((p: { category?: string }) => p.category?.trim()).filter(Boolean))
        ) as string[];
        setCategories(cats);
      })
      .catch(() => {});
  }, []);

  if (categories.length === 0) return null;

  return (
    <section className="py-8 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-6 lg:mb-10">
          <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900 uppercase tracking-widest">
            Shop By Category
          </h2>
          <div className="w-10 h-[3px] bg-[#fcb8fd] rounded-full mx-auto mt-3" />
        </div>

        <div className="flex flex-wrap justify-center gap-3 sm:gap-6 lg:gap-10">
          {categories.map((cat) => (
            <CategoryCircle
              key={cat}
              image={getCategoryImage(cat)}
              label={cat}
              onClick={() => router.push(`/?category=${encodeURIComponent(cat)}#products`)}
            />
          ))}
          <CategoryCircle
            image={ALL_PRODUCTS_IMAGE}
            label="All Products"
            onClick={() => router.push("/#products")}
          />
        </div>
      </div>
    </section>
  );
}
