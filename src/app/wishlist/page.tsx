"use client";

import { useEffect } from "react";
import { useWishlistStore } from "@/store/wishlist";
import { useCartStore } from "@/store/cart";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/storefront/Navbar";
import Footer from "@/components/storefront/Footer";
import { Heart, ShoppingCart, X, Sparkles } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore();
  const addToCart = useCartStore((s) => s.addItem);

  const handleAddToCart = (item: typeof items[0]) => {
    addToCart({
      id: item.id,
      title: item.title,
      price: item.price,
      imageUrl: item.imageUrl,
    });
    toast.success("Added to cart!");
  };

  const handleRemove = (id: string) => {
    removeItem(id);
    toast.success("Removed from wishlist");
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-50 text-red-700 text-sm font-semibold rounded-full mb-4">
              <Heart className="w-4 h-4 fill-current" />
              Your Wishlist
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Saved Items
            </h1>
            <p className="text-gray-500 text-lg">
              {items.length} product{items.length !== 1 ? "s" : ""} in your wishlist
            </p>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-12 h-12 text-red-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Your wishlist is empty
              </h2>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Start adding products you love to your wishlist. Click the heart
                icon on any product to save it here.
              </p>
              <Link
                href="/#products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-all"
              >
                <Sparkles className="w-5 h-5" />
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden"
                >
                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="absolute top-3 right-3 z-10 w-9 h-9 bg-white/95 hover:bg-red-500 text-gray-600 hover:text-white rounded-full flex items-center justify-center shadow-lg transition-all group/remove"
                    aria-label="Remove from wishlist"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <Link
                    href={`/product/${item.id}`}
                    className="block"
                  >
                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 group-hover:text-teal-700 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-lg font-bold text-teal-700 mb-3">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                  </Link>

                  {/* Add to Cart Button */}
                  <div className="px-4 pb-4">
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl transition-all active:scale-95"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
