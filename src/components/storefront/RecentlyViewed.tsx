"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface Product {
  id: string;
  title: string;
  price: string;
  imageUrl: string;
  category?: string;
}

export default function RecentlyViewed() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    try {
      const viewed = JSON.parse(
        localStorage.getItem("arcure-recently-viewed") || "[]"
      ) as Product[];
      setProducts(viewed.slice(0, 4)); // Show max 4 products
    } catch {
      setProducts([]);
    }
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Recently Viewed
              </h2>
              <p className="text-gray-500 text-sm mt-0.5">
                Pick up where you left off
              </p>
            </div>
          </div>
          <Link
            href="/#products"
            className="hidden sm:flex items-center gap-2 text-teal-600 hover:text-teal-700 font-semibold text-sm transition-colors"
          >
            View All Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-purple-200 hover:-translate-y-1"
            >
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                <Image
                  src={product.imageUrl}
                  alt={product.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {product.category && (
                  <span className="absolute top-2 left-2 px-2.5 py-1 bg-white/95 backdrop-blur-sm text-purple-700 text-xs font-semibold rounded-lg shadow-sm">
                    {product.category}
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 group-hover:text-purple-700 transition-colors">
                  {product.title}
                </h3>
                <p className="text-lg font-bold text-teal-700">
                  {formatPrice(product.price)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// Helper function to track viewed products
export function trackProductView(product: Product) {
  try {
    const viewed = JSON.parse(
      localStorage.getItem("arcure-recently-viewed") || "[]"
    ) as Product[];

    // Remove if already exists
    const filtered = viewed.filter((p) => p.id !== product.id);

    // Add to beginning
    const updated = [product, ...filtered].slice(0, 8); // Keep max 8

    localStorage.setItem("arcure-recently-viewed", JSON.stringify(updated));
  } catch {
    // Ignore localStorage errors
  }
}
