"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Category {
  id: string;
  name: string;
  imageUrl?: string | null;
}

const FALLBACK_IMAGES: Record<string, string> = {
  "Skin Care": "/categories/skin-care.png",
  "Supplements": "/categories/oral-medicines.png",
};

const FIXED_ORDER = ["Skin Care", "Supplements"];

function CategoryTile({
  image,
  label,
  onClick,
}: {
  image: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="relative aspect-[4/3] sm:aspect-[3/2] lg:aspect-[16/9] rounded-2xl overflow-hidden group cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 focus:outline-none"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt={label}
        className="w-full h-full object-contain bg-gradient-to-br from-gray-50 to-gray-200 transition-transform duration-500 group-hover:scale-105"
      />
    </button>
  );
}

export default function CategorySection() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => {
        if (!Array.isArray(data)) return;
        const sorted = [...data].sort((a, b) => {
          const ai = FIXED_ORDER.indexOf(a.name);
          const bi = FIXED_ORDER.indexOf(b.name);
          return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
        });
        setCategories(sorted);
      })
      .catch(() => {});
  }, []);

  if (categories.length === 0) return null;
  const firstTwo = categories.slice(0, 2);

  return (
    <section className="py-8 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 lg:mb-10">
          <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900 uppercase tracking-widest">
            Shop By Category
          </h2>
          <div className="w-10 h-[3px] bg-[#fcb8fd] rounded-full mx-auto mt-3" />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:gap-10">
          {firstTwo.map((cat) => (
            <CategoryTile
              key={cat.id}
              image={cat.imageUrl || FALLBACK_IMAGES[cat.name] || "/categories/all-products.png"}
              label={cat.name}
              onClick={() => router.push(`/?category=${encodeURIComponent(cat.name)}#products`)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}