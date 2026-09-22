"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const CATEGORY_IMAGES: Record<string, string> = {
  "Oral Medicines": "/categories/oral-medicines.png",
  "Skin Care":      "/categories/skin-care.png",
  "Skincare":       "/categories/skin-care.png",
  "Moisturizers":   "/categories/moisturizer.png",
  "Sunblock":       "/categories/sunblock.png",
};

const ALL_PRODUCTS_IMAGE = "/categories/all-products.png";

function getCategoryImage(name: string): string {
  if (CATEGORY_IMAGES[name]) return CATEGORY_IMAGES[name];
  const n = name.toLowerCase();
  if (n.includes("skin") || n.includes("serum"))   return "/categories/skin-care.png";
  if (n.includes("oral") || n.includes("medicine")) return "/categories/oral-medicines.png";
  if (n.includes("moist") || n.includes("cream"))   return "/categories/moisturizer.png";
  if (n.includes("sun") || n.includes("spf"))       return "/categories/sunblock.png";
  return ALL_PRODUCTS_IMAGE;
}

function CategoryCircle({
  image, label, onClick,
}: { image: string; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-2 group cursor-pointer">
      {/* Square container that clips to circle — image fills it fully */}
      <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden relative transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-xl">
        <Image
          src={image}
          alt={label}
          fill
          sizes="(max-width: 640px) 80px, (max-width: 1024px) 96px, 128px"
          className="object-cover"
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
    <section className="py-12 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-10">
          <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900 uppercase tracking-widest">
            Shop By Category
          </h2>
          <div className="w-10 h-[3px] bg-[#fcb8fd] rounded-full mx-auto mt-3" />
        </div>

        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-10">
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
