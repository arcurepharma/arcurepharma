"use client";

import { useEffect, useState } from "react";
import { BadgePercent } from "lucide-react";
import ProductCard from "./ProductCard";

interface Product {
  id: string;
  title: string;
  price: string;
  previousPrice?: string | null;
  imageUrl: string;
  category?: string;
  isActive?: number;
}

const DEAL_CATEGORIES = ["Deals", "Deals & Bundles", "Deal", "Bundle"];

export default function DealsSection({ initialProducts }: { initialProducts?: Product[] }) {
  const [products, setProducts] = useState<Product[]>(() => {
    const src: Product[] = initialProducts && initialProducts.length > 0 ? initialProducts : [];
    return src.filter((p) => DEAL_CATEGORIES.includes(p.category?.trim() || ""));
  });

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        const list: Product[] = Array.isArray(data) ? data : [];
        setProducts(
          list.filter((p) => DEAL_CATEGORIES.includes(p.category?.trim() || ""))
        );
      })
      .catch(() => {});
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="py-12 lg:py-20 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 lg:mb-10">
                 {/* Continuous Moving Ticker Banner */}
        <div className="w-full bg-[#16a34a] text-white py-3 my-6 overflow-hidden rounded-xl shadow-md">
          <div className="flex whitespace-nowrap animate-marquee items-center gap-8 font-black tracking-widest text-xs sm:text-sm uppercase">
            <span className="flex items-center gap-2">
              🔥 EXCLUSIVE DEALS & BUNDLES — SAVE UP TO 30% OFF <span className="text-yellow-300">✦</span>
            </span>
            <span className="flex items-center gap-2">
              🚚 FREE DELIVERY ON ALL BUNDLES ACROSS PAKISTAN <span className="text-yellow-300">✦</span>
            </span>
            <span className="flex items-center gap-2">
              ✨ LIMITED TIME OFFER — SHOP YOUR FAVORITE DUOS & TRIOS <span className="text-yellow-300">✦</span>
            </span>
            {/* Loop Repeat */}
            <span className="flex items-center gap-2">
              🔥 EXCLUSIVE DEALS & BUNDLES — SAVE UP TO 30% OFF <span className="text-yellow-300">✦</span>
            </span>
            <span className="flex items-center gap-2">
              🚚 FREE DELIVERY ON ALL BUNDLES ACROSS PAKISTAN <span className="text-yellow-300">✦</span>
            </span>
          </div>
        </div>


        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}