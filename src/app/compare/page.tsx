"use client";

import { useEffect, useState } from "react";
import { useComparisonStore } from "@/store/comparison";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/storefront/Navbar";
import Footer from "@/components/storefront/Footer";
import {
  X,
  Check,
  Minus,
  ShoppingCart,
  ArrowLeft,
  Scale,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import toast from "react-hot-toast";

export default function ComparePage() {
  const router = useRouter();
  const { items, removeItem, clearAll } = useComparisonStore();
  const addToCart = useCartStore((s) => s.addItem);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto" />
          <p className="text-gray-400 mt-4">Loading comparison...</p>
        </div>
      </div>
    );
  }

  const handleAddToCart = (product: typeof items[0]) => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      imageUrl: product.imageUrl,
    });
    toast.success(`${product.title} added to cart!`);
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-md mx-auto">
            <div className="w-24 h-24 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Scale className="w-12 h-12 text-teal-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              No Products to Compare
            </h1>
            <p className="text-gray-500 mb-8">
              Add at least 2 products from the shop to start comparing features,
              benefits, and prices.
            </p>
            <Link
              href="/#products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Browse Products
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const comparisonRows = [
    {
      label: "Price",
      key: "price",
      render: (product: typeof items[0]) => (
        <span className="text-2xl font-bold text-teal-700">
          {formatPrice(product.price)}
        </span>
      ),
    },
    {
      label: "Category",
      key: "category",
      render: (product: typeof items[0]) => (
        <span className="inline-flex px-3 py-1 bg-teal-50 text-teal-700 text-sm font-semibold rounded-lg">
          {product.category || "General"}
        </span>
      ),
    },
    {
      label: "Description",
      key: "description",
      render: (product: typeof items[0]) => (
        <p className="text-gray-600 text-sm leading-relaxed">
          {product.description || "No description available"}
        </p>
      ),
    },
    {
      label: "Benefits",
      key: "benefits",
      render: (product: typeof items[0]) => (
        <div className="space-y-2">
          {product.benefits && product.benefits.length > 0 ? (
            product.benefits.map((benefit, i) => (
              <div key={i} className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">{benefit}</span>
              </div>
            ))
          ) : (
            <div className="flex items-center gap-2 text-gray-400">
              <Minus className="w-4 h-4" />
              <span className="text-sm">Not specified</span>
            </div>
          )}
        </div>
      ),
    },
    {
      label: "Key Ingredients",
      key: "ingredients",
      render: (product: typeof items[0]) => (
        <p className="text-gray-600 text-sm leading-relaxed">
          {product.ingredients || "Not specified"}
        </p>
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-r from-teal-600 to-teal-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Scale className="w-6 h-6" />
                <span className="text-sm font-medium text-teal-100">
                  Product Comparison
                </span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold">
                Compare {items.length} Products
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button
                onClick={clearAll}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl transition-all"
              >
                <X className="w-4 h-4" />
                Clear All
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Desktop View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left p-6 font-bold text-gray-900 w-48">
                      Feature
                    </th>
                    {items.map((product) => (
                      <th key={product.id} className="p-6 w-72">
                        <div className="relative">
                          <button
                            onClick={() => removeItem(product.id)}
                            className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors shadow-lg z-10"
                            aria-label="Remove"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-100 mb-4">
                            <Image
                              src={product.imageUrl}
                              alt={product.title}
                              fill
                              sizes="300px"
                              className="object-cover"
                            />
                          </div>
                          <h3 className="font-bold text-gray-900 text-base mb-3 line-clamp-2">
                            {product.title}
                          </h3>
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl transition-all active:scale-95"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            Add to Cart
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, i) => (
                    <tr
                      key={row.key}
                      className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="p-6 font-semibold text-gray-900 border-b border-gray-200">
                        {row.label}
                      </td>
                      {items.map((product) => (
                        <td
                          key={product.id}
                          className="p-6 border-b border-gray-200"
                        >
                          {row.render(product)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className="lg:hidden divide-y divide-gray-200">
              {items.map((product, idx) => (
                <div key={product.id} className="p-6">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image
                        src={product.imageUrl}
                        alt={product.title}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-2">
                        {product.title}
                      </h3>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg transition-all"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          Add
                        </button>
                        <button
                          onClick={() => removeItem(product.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-lg transition-all"
                        >
                          <X className="w-3.5 h-3.5" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {comparisonRows.map((row) => (
                      <div key={row.key}>
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                          {row.label}
                        </div>
                        <div>{row.render(product)}</div>
                      </div>
                    ))}
                  </div>
                  {idx < items.length - 1 && (
                    <div className="mt-6 pt-6 border-t border-gray-200" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
