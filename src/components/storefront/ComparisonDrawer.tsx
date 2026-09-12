"use client";

import { useComparisonStore } from "@/store/comparison";
import { X, ArrowRight, Scale } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

export default function ComparisonDrawer() {
  const { items, removeItem, clearAll } = useComparisonStore();

  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] animate-slide-in-right">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden min-w-[320px] max-w-[400px]">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5" />
            <span className="font-bold text-sm">
              Compare Products ({items.length}/4)
            </span>
          </div>
          <button
            onClick={clearAll}
            className="text-white/80 hover:text-white transition-colors"
            aria-label="Clear all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Products List */}
        <div className="max-h-[400px] overflow-y-auto p-4 space-y-3">
          {items.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-3 group bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition-colors"
            >
              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white flex-shrink-0">
                <Image
                  src={product.imageUrl}
                  alt={product.title}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 text-sm line-clamp-1">
                  {product.title}
                </h4>
                <p className="text-teal-700 font-bold text-sm mt-0.5">
                  {formatPrice(product.price)}
                </p>
              </div>
              <button
                onClick={() => removeItem(product.id)}
                className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                aria-label="Remove"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Compare Button */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <Link
            href="/compare"
            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-all active:scale-95 shadow-md"
          >
            Compare Now
            <ArrowRight className="w-4 h-4" />
          </Link>
          {items.length < 2 && (
            <p className="text-xs text-gray-500 text-center mt-2">
              Add at least 2 products to compare
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
