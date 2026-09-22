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
  Truck,
} from "lucide-react";
import { useCartStore } from "@/store/cart";
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
  isActive?: number;
}

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const [wished, setWished] = useState(false);
  const [quickView, setQuickView] = useState(false);
  const [activeImg, setActiveImg] = useState(product.imageUrl);
  const [qty, setQty] = useState(1);
  const isOutOfStock = product.isActive === 0;

  const gallery = Array.from(
    new Set([product.imageUrl, ...(product.images || [])])
  ).filter(Boolean) as string[];

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
    addItem({ id: product.id, title: product.title, price: product.price, imageUrl: product.imageUrl });
    toast.success(`${product.title} added to cart!`);
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
      addItem({ id: product.id, title: product.title, price: product.price, imageUrl: product.imageUrl });
    }
    toast.success(`${qty} x ${product.title} added to cart!`);
    setQuickView(false);
  };

  return (
    <>
      {/* â”€â”€â”€ Card â”€â”€â”€ */}
      <div className="group relative flex flex-col glass-card rounded-xl overflow-hidden hover:shadow-lg hover:shadow-pink-200/50 transition-all duration-300 hover:-translate-y-1">

        {/* Image area â€” white bg, image contained, heart top-right */}
        <Link href={`/product/${product.id}`} className="relative block aspect-square overflow-hidden bg-white">
          {gallery.slice(0, 2).map((img, i) => (
            <Image
              key={i}
              src={img}
              alt={product.title}
              fill
              priority={i === 0}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={`object-contain transition-all duration-700 group-hover:scale-105 ${
                isOutOfStock ? "opacity-60 grayscale" : ""
              } ${i === 0 ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
            />
          ))}

          {/* Out of Stock overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <span className="bg-gray-800/80 text-white text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-full tracking-wider">
                OUT OF STOCK
              </span>
            </div>
          )}

          {/* Heart button â€” top right */}
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setWished((w) => !w); }}
            aria-label="Wishlist"
            className="absolute top-2 right-2 z-10 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
          >
            <Heart
              className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors drop-shadow-sm ${
                wished ? "fill-[#fcb8fd] text-[#fcb8fd]" : "fill-white text-gray-300 stroke-gray-300"
              }`}
            />
          </button>

          {/* Video badge */}
          {product.videoUrl && (
            <span className="absolute top-2 left-2 z-10 inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-[#fcb8fd]/90 text-white text-[9px] font-semibold rounded-md">
              <PlayCircle className="w-2.5 h-2.5" /> Video
            </span>
          )}

          {/* Quick view â€” desktop hover */}
          <div className="hidden sm:flex absolute inset-x-0 bottom-0 z-10 justify-center pb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={openQuickView}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/95 text-gray-800 text-[11px] font-bold rounded-full shadow-lg hover:bg-[#fcb8fd] hover:text-white transition-colors border border-gray-100"
            >
              <Eye className="w-3 h-3" /> Quick View
            </button>
          </div>
        </Link>

        {/* Body â€” text content */}
        <div className="flex flex-col flex-1 px-3 sm:px-4 pt-3 pb-3 sm:pb-4">

          {/* Title */}
          <h3 className="font-semibold text-gray-800 text-xs sm:text-sm leading-snug line-clamp-2 mb-1.5 group-hover:text-[#fcb8fd] transition-colors">
            {product.title}
          </h3>

          {/* Stars + review count */}
          <div className="flex items-center gap-0.5 mb-1.5">
            {[1,2,3,4,5].map((s) => (
              <Star key={s} className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-yellow-400 text-yellow-400" />
            ))}
            <span className="text-[9px] sm:text-[10px] text-gray-400 ml-1">(32)</span>
          </div>

          {/* Price */}
          <p className="text-sm sm:text-base font-extrabold text-gray-900 mb-3">
            {formatPrice(product.price)}
          </p>

          {/* ADD TO CART â€” full width mauve */}
          <button
            onClick={handleAdd}
            disabled={isOutOfStock}
            className={`mt-auto w-full flex items-center justify-center gap-1.5 py-2 sm:py-2.5 text-[10px] sm:text-xs font-bold rounded-md transition-all active:scale-[0.98] tracking-wide ${
              isOutOfStock
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-[#fcb8fd] hover:bg-[#e8a0f0] text-[#6b1f6d]"
            }`}
          >
            {isOutOfStock ? "OUT OF STOCK" : "ADD TO CART"}
          </button>
        </div>
      </div>

      {/* â”€â”€â”€ Quick View Modal â”€â”€â”€ */}
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
              <div className="relative aspect-square md:min-h-[440px] bg-[#fff5fe] rounded-tl-2xl rounded-bl-2xl overflow-hidden">
                <Image src={activeImg} alt={product.title} fill sizes="50vw" className="object-contain p-6" />
                {product.category && (
                  <span className="absolute top-4 left-4 px-3 py-1 bg-white text-[#fcb8fd] text-xs font-bold rounded-full shadow-sm">
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
                          activeImg === img ? "ring-[#fcb8fd] scale-105" : "ring-white/30 hover:ring-white"
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
                <span className="inline-flex items-center gap-1.5 self-start px-3 py-1 bg-[#fff5fe] text-[#fcb8fd] text-xs font-bold rounded-full mb-4">
                  <BadgeCheck className="w-3.5 h-3.5" /> Verified Product
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{product.title}</h2>
                <div className="flex items-center gap-1 mb-3">
                  {[1,2,3,4,5].map((s) => (
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
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#fcb8fd] hover:bg-[#e8a0f0] text-[#6b1f6d] font-bold text-sm rounded-xl transition-all active:scale-95 shadow-lg shadow-[#fcb8fd]/20"
                  >
                    <ShoppingCart className="w-4 h-4" /> Add to Cart
                  </button>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Truck className="w-4 h-4 text-[#fcb8fd]" /> Fast Delivery across Pakistan
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



