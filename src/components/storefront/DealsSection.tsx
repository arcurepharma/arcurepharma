"use client";

import { useEffect, useState } from "react";
import { BadgePercent } from "lucide-react";
import ProductCard from "./ProductCard";

interface Product {
  id: string;
  title: string;
  price: string;
  imageUrl: string;
  category?: string;
  isActive?: number;
}

const DEAL_CATEGORIES = ["Deals", "Deals & Bundles", "Deal", "Bundle"];

export default function DealsSection() {
  const [products, setProducts] = useState<Product[]>([]);

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
    <section className="py-12 lg:py-20 bg-gradient-to-b from-white to-[#fff5fe]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 lg:mb-10">
          <div className="flex items-center justify-center gap-2">
            <BadgePercent className="w-5 h-5 sm:w-6 sm:h-6 text-[#fcb8fd]" />
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900 uppercase tracking-widest">
              Deals &amp; Bundles
            </h2>
          </div>
          <div className="w-10 h-[3px] bg-[#fcb8fd] rounded-full mx-auto mt-3" />
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