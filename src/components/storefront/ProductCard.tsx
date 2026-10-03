"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  Star,
  ShoppingCart,
  Eye,
  X,
  Plus,
  Minus,
  PlayCircle,
  BadgeCheck,
} from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatPrice, formatFormula } from "@/lib/utils";
import toast from "react-hot-toast";
import WhatsAppBuyButton from "./WhatsAppBuyButton";

interface Product {
  id: string;
  title: string;
  price: string;
  imageUrl: string;
  category?: string;
  description?: string;
  videoUrl?: string | null;
  images?: string[];
  isActive?: number;
  formula?: string;
  ingredients?: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const [wished, setWished] = useState(false);
  const [quickView, setQuickView] = useState(false);
  const [activeImg, setActiveImg] = useState(product.imageUrl);
  const [qty, setQty] = useState(1);
  const isOutOfStock = product.isActive === 0;

  const formulaDisplay = formatFormula(product.formula || product.ingredients);

  const gallery = Array.from(
    new Set([product.imageUrl, ...(product.images || [])])
  ).filter(Boolean) as string[];

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("arcure_wishlist") || "[]");
      setWished(stored.some((p: { id: string }) => p.id === product.id));
    } catch {}
  }, [product.id]);

  const toggleWish = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const stored: Product[] = JSON.parse(
        localStorage.getItem("arcure_wishlist") || "[]"
      );
      let updated: Product[];
      if (wished) {
        updated = stored.filter((p) => p.id !== product.id);
        toast.success("Removed from wishlist");
      } else {
        updated = [...stored, product];
        toast.success("Added to wishlist!");
      }
      localStorage.setItem("arcure_wishlist", JSON.stringify(updated));
      window.dispatchEvent(new Event("wishlist-updated"));
      setWished(!wished);
    } catch {}
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      imageUrl: product.imageUrl,
    });
    toast.success("Added to cart!");
  };

  const openQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImg(product.imageUrl);
    setQty(1);
    setQuickView(true);
  };

  const addFromQuickView = () => {
    if (isOutOfStock) return;
    for (let i = 0; i < qty; i++) {
      addItem({
        id: product.id,
        title: product.title,
        price: product.price,
        imageUrl: product.imageUrl,
      });
    }
    toast.success(`Added ${qty} to cart!`);
    setQuickView(false);
  };

  return (
    <>
      <div className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        {/* Top media container */}
        <Link href={`/product/${product.id}`} className="block relative aspect-square bg-[#fbf9f5] overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-4 sm:p-5 group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />

          {/* Out of stock overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
              <span className="bg-gray-900/90 text-white text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                Out of Stock
              </span>
            </div>
          )}

          {/* Wishlist button */}
          <button
            onClick={toggleWish}
            aria-label="Add to wishlist"
            className="absolute top-2 right-2 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 active:scale-95 transition-all"
          >
            <Heart
              className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors drop-shadow-sm ${
                wished ? "fill-red-500 text-red-500" : "fill-none text-gray-400 stroke-gray-400 hover:text-red-500"
              }`}
            />
          </button>

          {/* Video badge */}
          {product.videoUrl && (
            <span className="absolute top-2 left-2 z-10 inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-[#16a34a]/90 text-white text-[9px] font-semibold rounded-md">
              <PlayCircle className="w-2.5 h-2.5" /> Video
            </span>
          )}

          {/* Quick view button on desktop hover */}
          <div className="hidden sm:flex absolute inset-x-0 bottom-0 z-10 justify-center pb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={openQuickView}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/95 text-gray-800 text-[11px] font-bold rounded-full shadow-lg hover:bg-[#16a34a] hover:text-white transition-colors border border-gray-100"
            >
              <Eye className="w-3 h-3" /> Quick View
            </button>
          </div>
        </Link>

        {/* Body content */}
        <div className="flex flex-col flex-1 px-3 sm:px-4 pt-3 pb-3 sm:pb-4">
          {/* Title */}
          <h3 className="font-bold text-gray-900 text-xs sm:text-sm leading-snug line-clamp-2 mb-1 group-hover:text-[#99611a] transition-colors">
            {product.title}
          </h3>

          {/* Formula pill badge */}
          {formulaDisplay && (
            <div className="mb-1.5">
              <span className="inline-block px-2 py-0.5 bg-[#fce7f3]/80 text-[#9d174d] text-[10px] sm:text-[11px] font-semibold rounded-md tracking-tight">
                {formulaDisplay}
              </span>
            </div>
          )}

          {/* Stars + review count */}
          <div className="flex items-center gap-0.5 mb-1.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-yellow-400 text-yellow-400" />
            ))}
            <span className="text-[11px] text-gray-500 ml-1">(32)</span>
          </div>

          {/* Price */}
          <p className="text-sm sm:text-base font-extrabold text-gray-900 mb-3">
            {formatPrice(product.price)}
          </p>

          {/* ADD TO CART + WhatsApp */}
          <div className="mt-auto space-y-1.5">
            <button
              onClick={handleAdd}
              disabled={isOutOfStock}
              className={`w-full flex items-center justify-center gap-1.5 py-2 sm:py-2.5 text-[10px] sm:text-xs font-bold rounded-md transition-all active:scale-[0.98] tracking-wide ${
                isOutOfStock
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-[#16a34a] hover:bg-[#15803d] text-white shadow-sm hover:shadow-md"
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              {isOutOfStock ? "OUT OF STOCK" : "ADD TO CART"}
            </button>
            <WhatsAppBuyButton product={product} />
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {quickView && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setQuickView(false)} />
          <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-white rounded-2xl shadow-2xl animate-fade-in">
            <button
              onClick={() => setQuickView(false)}
              aria-label="Close"
              className="absolute top-4 right-4 z-20 w-9 h-9 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Image */}
              <div className="relative aspect-square md:min-h-[440px] bg-[#f0fdf4] rounded-tl-2xl rounded-bl-2xl overflow-hidden">
                <Image src={activeImg} alt={product.title} fill sizes="50vw" className="object-contain p-6" />
                {product.category && (
                  <span className="absolute top-4 left-4 px-3 py-1 bg-white text-[#16a34a] text-xs font-bold rounded-full shadow-sm">
                    {product.category}
                  </span>
                )}
                {gallery.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/30 backdrop-blur-sm rounded-xl p-1.5">
                    {gallery.slice(0, 5).map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImg(img)}
                        className={`relative w-10 h-10 rounded-lg overflow-hidden ring-2 transition-all ${
                          activeImg === img ? "ring-[#16a34a] scale-105" : "ring-white/30 hover:ring-white"
                        }`}
                      >
                        <Image src={img} alt="" fill sizes="40px" className="object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex flex-col p-6 md:p-8">
                <span className="inline-flex items-center gap-1.5 self-start px-3 py-1 bg-[#f0fdf4] text-[#16a34a] text-xs font-bold rounded-full mb-3">
                  <BadgeCheck className="w-3.5 h-3.5" /> Verified Product
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{product.title}</h2>
                {formulaDisplay && (
                  <div className="mb-3">
                    <span className="inline-block px-3 py-1 bg-[#fce7f3]/80 text-[#9d174d] text-xs font-semibold rounded-lg tracking-wide">
                      {formulaDisplay}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-xs text-gray-400 ml-1">(5.0)</span>
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4">
                  {formatPrice(product.price)}
                </p>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  {product.description || "No description available."}
                </p>

                {/* Qty + Add */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                    <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors">
                      <Minus className="w-4 h-4 text-gray-600" />
                    </button>
                    <span className="w-10 text-center font-bold text-gray-800 text-sm">{qty}</span>
                    <button onClick={() => setQty((q) => Math.min(99, q + 1))} className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors">
                      <Plus className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                  <button
                    onClick={addFromQuickView}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#16a34a] hover:bg-[#15803d] text-white shadow-sm hover:shadow-md font-bold text-sm rounded-xl transition-all active:scale-95 shadow-lg shadow-[#16a34a]/20"
                  >
                    <ShoppingCart className="w-4 h-4" /> Add to Cart
                  </button>
                </div>

                <Link
                  href={`/product/${product.id}`}
                  onClick={() => setQuickView(false)}
                  className="mt-5 flex items-center justify-center gap-2 py-2.5 bg-gray-900 hover:bg-gray-700 text-white text-xs font-bold rounded-xl transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" /> View Full Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
