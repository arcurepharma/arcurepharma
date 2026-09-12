"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Tag, Sparkles, ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import toast from "react-hot-toast";

interface Bundle {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  productIds: string[];
  regularPrice: string;
  discountedPrice: string;
}

export default function BundleDeals() {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    // Fetch bundles from API (for now, using mock data)
    setTimeout(() => {
      setBundles([
        {
          id: "bundle-1",
          title: "Complete Skincare Bundle",
          description: "ARCUDERM CS Serum + ARCU GLEAM Face Wash",
          imageUrl: "/jenpharm/hero-desktop.jpg",
          productIds: [],
          regularPrice: "4500",
          discountedPrice: "3699",
        },
        {
          id: "bundle-2",
          title: "Health & Wellness Pack",
          description: "ARCU-CAL K2 + Mida-D Vitamin D3",
          imageUrl: "/jenpharm/quiz-banner.jpg",
          productIds: [],
          regularPrice: "3800",
          discountedPrice: "2999",
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const handleAddBundle = (bundle: Bundle) => {
    // For now, add as a single item
    addItem({
      id: bundle.id,
      title: bundle.title,
      price: bundle.discountedPrice,
      imageUrl: bundle.imageUrl,
    });
    toast.success(`${bundle.title} added to cart!`);
  };

  const calculateSavings = (regular: string, discounted: string) => {
    const savings = parseFloat(regular) - parseFloat(discounted);
    const percentage = ((savings / parseFloat(regular)) * 100).toFixed(0);
    return { savings, percentage };
  };

  if (loading || bundles.length === 0) return null;

  return (
    <section className="py-16 lg:py-20 bg-gradient-to-br from-teal-50 via-white to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-semibold rounded-full mb-4 shadow-lg">
            <Tag className="w-4 h-4" />
            Special Bundle Offers
          </span>
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
            Save More with Bundles
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Get your favorite products together at amazing discounts
          </p>
          <div className="section-divider mt-6" />
        </div>

        {/* Bundles Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {bundles.map((bundle) => {
            const { savings, percentage } = calculateSavings(
              bundle.regularPrice,
              bundle.discountedPrice
            );
            return (
              <div
                key={bundle.id}
                className="group relative bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 hover:border-teal-200"
              >
                {/* Discount Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full shadow-lg">
                    <span className="font-bold text-lg">Save {percentage}%</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2">
                  {/* Image */}
                  <div className="relative aspect-square md:aspect-auto overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                    <Image
                      src={bundle.imageUrl}
                      alt={bundle.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    
                    {/* Sparkle Effect */}
                    <div className="absolute top-4 left-4 text-yellow-400 animate-pulse">
                      <Sparkles className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col">
                    <div className="flex-1">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 text-teal-700 text-xs font-semibold rounded-lg mb-3">
                        <Tag className="w-3.5 h-3.5" />
                        Bundle Deal
                      </span>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {bundle.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                        {bundle.description}
                      </p>

                      {/* Price */}
                      <div className="mb-6">
                        <div className="flex items-baseline gap-3 mb-2">
                          <span className="text-3xl font-extrabold text-teal-700">
                            {formatPrice(bundle.discountedPrice)}
                          </span>
                          <span className="text-lg text-gray-400 line-through">
                            {formatPrice(bundle.regularPrice)}
                          </span>
                        </div>
                        <p className="text-sm text-green-600 font-semibold">
                          You save {formatPrice(savings.toString())}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                      <button
                        onClick={() => handleAddBundle(bundle)}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-all active:scale-95 shadow-lg shadow-teal-600/30"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        Add Bundle to Cart
                      </button>
                      <Link
                        href={`/#products`}
                        className="w-full flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all text-sm"
                      >
                        View Products
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
