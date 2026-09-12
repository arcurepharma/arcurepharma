"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Eye,
  PlayCircle,
  ShoppingCart,
  Heart,
  X,
  Minus,
  ShieldCheck,
  Truck,
  BadgeCheck,
  Scale,
} from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useComparisonStore } from "@/store/comparison";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

interface Product {
  id: string;
  title: string;
  price: string;
  imageUrl: string;
  category?: string;
  description?: string;
  videoUrl?: string | null;
  images?: string[];
}

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const { addItem: addToComparison, isInComparison, removeItem: removeFromComparison } = useComparisonStore();

  const gallery = Array.from(
    new Set([product.imageUrl, ...(product.images || [])])
  ).filter(Boolean) as string[];

  const [wishlisted, setWishlisted] = useState(false);
  const [quickView, setQuickView] = useState(false);
  const [activeImg, setActiveImg] = useState(product.imageUrl);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const t = window.setTimeout(() => {
      try {
        const list = JSON.parse(
          localStorage.getItem("arcure-wishlist") || "[]"
        ) as string[];
        setWishlisted(list.includes(product.id));
      } catch {
        /* ignore */
      }
    }, 0);
    return () => window.clearTimeout(t);
  }, [product.id]);

  useEffect(() => {
    if (!quickView) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setQuickView(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [quickView]);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      imageUrl: product.imageUrl,
    });
    toast.success(`${product.title} added to cart!`);
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const list = JSON.parse(
        localStorage.getItem("arcure-wishlist") || "[]"
      ) as string[];
      const exists = list.includes(product.id);
      const next = exists
        ? list.filter((id) => id !== product.id)
        : [...list, product.id];
      localStorage.setItem("arcure-wishlist", JSON.stringify(next));
      setWishlisted(!exists);
      toast.success(exists ? "Removed from wishlist" : "Added to wishlist");
    } catch {
      /* ignore */
    }
  };

  const toggleComparison = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const inComparison = isInComparison(product.id);
    if (inComparison) {
      removeFromComparison(product.id);
      toast.success("Removed from comparison");
    } else {
      addToComparison({
        id: product.id,
        title: product.title,
        price: product.price,
        imageUrl: product.imageUrl,
        category: product.category,
        description: product.description,
      });
      toast.success("Added to comparison");
    }
  };

  const openQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQty(1);
    setActiveImg(product.imageUrl);
    setQuickView(true);
  };

  const addFromQuickView = () => {
    for (let i = 0; i < qty; i++) {
      addItem({
        id: product.id,
        title: product.title,
        price: product.price,
        imageUrl: product.imageUrl,
      });
    }
    toast.success(`${qty} x ${product.title} added to cart!`);
    setQuickView(false);
  };

  return (
    <>
      <div className="group relative h-full">
        <div className="relative h-full rounded-2xl bg-white overflow-hidden transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] shadow-[0_4px_20px_-5px_rgba(0,0,0,0.08)] ring-1 ring-gray-100">
          <Link
            href={`/product/${product.id}`}
            className="relative flex h-full flex-col"
          >
            {/* Image container */}
            <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
              {gallery.slice(0, 2).map((img, i) => (
                <Image
                  key={i}
                  src={img}
                  alt={product.title}
                  fill
                  priority={i === 0}
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className={`object-cover transition-all duration-700 group-hover:scale-110 ${
                    i === 0
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                  }`}
                />
              ))}

              {/* Top badges */}
              <div className="absolute top-2 sm:top-3 left-2 sm:left-3 z-10 flex flex-col gap-1.5 sm:gap-2">
                {product.category && (
                  <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-white/95 backdrop-blur-sm text-teal-700 text-[10px] sm:text-[11px] font-semibold rounded-md sm:rounded-lg shadow-sm">
                    {product.category}
                  </span>
                )}
                {product.videoUrl && (
                  <span className="inline-flex items-center gap-0.5 sm:gap-1 px-2 sm:px-2.5 py-1 bg-teal-600/95 backdrop-blur-sm text-white text-[9px] sm:text-[10px] font-semibold rounded-md sm:rounded-lg shadow-sm">
                    <PlayCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    Video
                  </span>
                )}
              </div>

              {/* Wishlist */}
              <button
                onClick={toggleWishlist}
                aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                className={`absolute top-2 sm:top-3 right-2 sm:right-3 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center backdrop-blur-sm shadow-md transition-all duration-300 active:scale-90 min-h-[44px] min-w-[44px] sm:min-h-[36px] sm:min-w-[36px] ${
                  wishlisted
                    ? "bg-red-500/95 text-white hover:bg-red-600"
                    : "bg-white/95 text-gray-500 hover:text-red-500 hover:scale-110"
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${wishlisted ? "fill-white" : ""}`}
                />
              </button>

              {/* Compare */}
              <button
                onClick={toggleComparison}
                aria-label={isInComparison(product.id) ? "Remove from comparison" : "Add to comparison"}
                className={`absolute top-11 sm:top-14 right-2 sm:right-3 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center backdrop-blur-sm shadow-md transition-all duration-300 active:scale-90 min-h-[44px] min-w-[44px] sm:min-h-[36px] sm:min-w-[36px] ${
                  isInComparison(product.id)
                    ? "bg-teal-600/95 text-white hover:bg-teal-700"
                    : "bg-white/95 text-gray-500 hover:text-teal-600 hover:scale-110"
                }`}
              >
                <Scale className="w-4 h-4" />
              </button>

              {/* Image counter */}
              {gallery.length > 1 && (
                <span className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 z-10 px-2 sm:px-2.5 py-0.5 sm:py-1 bg-black/50 backdrop-blur-sm text-white text-[9px] sm:text-[10px] font-medium rounded-md">
                  {gallery.length} photos
                </span>
              )}

              {/* Quick view overlay - hidden on mobile, shown on hover desktop */}
              <div className="hidden sm:absolute sm:inset-0 sm:z-10 sm:flex sm:items-center sm:justify-center sm:opacity-0 sm:group-hover:opacity-100 sm:transition-all sm:duration-300 sm:bg-black/10">
                <button
                  onClick={openQuickView}
                  className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-white/95 backdrop-blur-sm text-gray-800 text-xs sm:text-sm font-semibold rounded-full shadow-xl scale-90 group-hover:scale-100 transition-transform duration-300 hover:bg-teal-600 hover:text-white"
                >
                  <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                  Quick View
                </button>
              </div>

              {/* Quick add - on mobile shown on long press, desktop on hover */}
              <button
                onClick={handleAdd}
                aria-label="Add to cart"
                className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 z-10 w-10 h-10 sm:w-11 sm:h-11 bg-teal-600 text-white rounded-full flex items-center justify-center shadow-lg opacity-100 sm:opacity-0 sm:translate-y-2 sm:group-hover:opacity-100 sm:group-hover:translate-y-0 transition-all duration-300 hover:bg-teal-700 hover:scale-110 active:scale-95 min-h-[44px] min-w-[44px]"
              >
                <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="relative flex flex-1 flex-col p-3 sm:p-5">
              <h3 className="font-bold text-gray-900 text-sm sm:text-[15px] mb-1 sm:mb-1.5 line-clamp-1 group-hover:text-teal-700 transition-colors">
                {product.title}
              </h3>
              <p className="text-gray-500 text-xs sm:text-[12px] leading-snug line-clamp-2 mb-3 sm:mb-4">
                {product.description || "No description available"}
              </p>

              <div className="mt-auto">
                <div className="flex items-end justify-between gap-2 sm:gap-3 pt-2 sm:pt-3 border-t border-gray-100">
                  <div>
                    <p className="text-[8px] sm:text-[9px] uppercase tracking-wider text-gray-400 font-semibold mb-0.5">
                      Price
                    </p>
                    <span className="text-lg sm:text-xl font-extrabold text-teal-700 leading-none">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                  <button
                    onClick={handleAdd}
                    className="flex items-center gap-1 sm:gap-2 px-2.5 sm:px-4 py-2 sm:py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-[13px] font-semibold rounded-lg sm:rounded-xl transition-all active:scale-95 shadow-md shadow-teal-600/20 min-h-[44px] flex-shrink-0"
                  >
                    <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Add</span>
                  </button>
                </div>

                {/* Trust row */}
                <div className="mt-2 sm:mt-3 flex items-center gap-2 sm:gap-3 text-[9px] sm:text-[10px] font-medium text-gray-400 flex-wrap">
                  <span className="flex items-center gap-0.5 sm:gap-1 whitespace-nowrap">
                    <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-500 flex-shrink-0" />
                    100% Genuine
                  </span>
                  <span className="hidden sm:flex items-center gap-1 whitespace-nowrap">
                    <Truck className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                    Fast Delivery
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Quick View Modal */}
      {quickView && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 md:p-6">
          <div
            className="absolute inset-0 bg-gray-950/60 backdrop-blur-sm"
            onClick={() => setQuickView(false)}
          />
          <div className="relative w-full max-w-4xl max-h-[95vh] overflow-y-auto bg-white rounded-2xl sm:rounded-3xl shadow-2xl animate-fade-in">
            <button
              onClick={() => setQuickView(false)}
              aria-label="Close"
              className="absolute top-3 sm:top-4 right-3 sm:right-4 z-20 w-9 h-9 sm:w-10 sm:h-10 bg-white/90 hover:bg-gray-100 text-gray-600 rounded-full flex items-center justify-center shadow-lg transition-colors min-h-[44px] min-w-[44px] sm:min-h-[40px] sm:min-w-[40px]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Gallery */}
              <div className="relative aspect-square md:aspect-auto md:min-h-[440px] bg-gradient-to-br from-gray-50 to-gray-100">
                <Image
                  src={activeImg}
                  alt={product.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
                {product.category && (
                  <span className="absolute top-3 sm:top-4 left-3 sm:left-4 px-2 sm:px-3 py-1 sm:py-1.5 bg-white/95 backdrop-blur-sm text-teal-700 text-xs font-semibold rounded-lg shadow-sm">
                    {product.category}
                  </span>
                )}
                {product.videoUrl && (
                  <span className="absolute top-3 sm:top-4 right-16 sm:right-20 flex items-center gap-1 px-2 sm:px-2.5 py-1 bg-teal-600/95 backdrop-blur-sm text-white text-[10px] sm:text-[11px] font-medium rounded-lg shadow-sm">
                    <PlayCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    Video
                  </span>
                )}

                {gallery.length > 1 && (
                  <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 bg-black/40 backdrop-blur-md rounded-lg sm:rounded-xl p-2">
                    {gallery.slice(0, 5).map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImg(img)}
                        aria-label={`View image ${i + 1}`}
                        className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-md sm:rounded-lg overflow-hidden ring-2 transition-all ${
                          activeImg === img
                            ? "ring-teal-400 scale-105"
                            : "ring-white/30 hover:ring-white"
                        }`}
                      >
                        <Image
                          src={img}
                          alt={`${product.title} ${i + 1}`}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex flex-col p-4 sm:p-6 md:p-8">
                <span className="inline-flex items-center gap-1 sm:gap-1.5 self-start px-2.5 sm:px-3 py-1 sm:py-1.5 bg-teal-50 text-teal-700 text-[10px] sm:text-[11px] font-semibold rounded-lg mb-3 sm:mb-4">
                  <BadgeCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  Verified Product
                </span>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 leading-snug mb-2 sm:mb-3">
                  {product.title}
                </h2>
                <div className="flex items-end gap-2 mb-4 sm:mb-5">
                  <span className="text-2xl sm:text-3xl font-extrabold text-teal-700">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-xs text-gray-400 pb-1">
                    incl. all taxes
                  </span>
                </div>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-5 sm:mb-6">
                  {product.description || "No description available."}
                </p>

                {/* Quantity + Add */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mb-5 sm:mb-6">
                  <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-xl p-1">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      aria-label="Decrease quantity"
                      className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-gray-600 hover:bg-white hover:shadow rounded-lg transition-all active:scale-90 min-h-[44px] min-w-[44px] sm:min-h-[36px] sm:min-w-[36px]"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-bold text-gray-800">
                      {qty}
                    </span>
                    <button
                      onClick={() => setQty((q) => Math.min(99, q + 1))}
                      aria-label="Increase quantity"
                      className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-gray-600 hover:bg-white hover:shadow rounded-lg transition-all active:scale-90 min-h-[44px] min-w-[44px] sm:min-h-[36px] sm:min-w-[36px]"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={addFromQuickView}
                    className="flex items-center justify-center gap-2 px-4 sm:px-5 py-3 sm:py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm sm:text-base rounded-lg sm:rounded-xl transition-all active:scale-95 shadow-lg shadow-teal-600/20 min-h-[44px]"
                  >
                    <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                    Add to Cart
                  </button>
                </div>

                <div className="border-t border-dashed border-gray-100 pt-4 sm:pt-5 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5 text-xs font-medium text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    100% Genuine
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-teal-600 flex-shrink-0" />
                    Fast Delivery
                  </span>
                </div>

                <Link
                  href={`/product/${product.id}`}
                  onClick={() => setQuickView(false)}
                  className="mt-auto pt-4 sm:pt-6 flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-gray-900 hover:bg-gray-800 text-white text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl transition-colors min-h-[44px]"
                >
                  <Eye className="w-4 h-4" />
                  View Full Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
