"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/storefront/Navbar";
import HeroSlider from "@/components/storefront/HeroSlider";
import ProductCard from "@/components/storefront/ProductCard";
import TrustBadges from "@/components/storefront/TrustBadges";
import BundleDeals from "@/components/storefront/BundleDeals";
import RecentlyViewed from "@/components/storefront/RecentlyViewed";
import Testimonials from "@/components/storefront/Testimonials";
import VisionPanel from "@/components/storefront/VisionPanel";
import ResultsTrust from "@/components/storefront/ResultsTrust";
import DealsStrip from "@/components/storefront/DealsStrip";
import PressLogos from "@/components/storefront/PressLogos";
import Footer from "@/components/storefront/Footer";
import WhatsAppWidget from "@/components/storefront/WhatsAppWidget";
import { useReveal } from "@/lib/useReveal";
import { Sparkles } from "lucide-react";

interface Product {
  id: string;
  title: string;
  price: string;
  imageUrl: string;
  category: string;
  description: string;
  benefits?: string[];
  ingredients?: string;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const { ref: productsHeaderRef, visible: productsHeaderVisible } = useReveal();

  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSlider />

      {/* Products Section */}
      <section id="products" className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            ref={productsHeaderRef}
            className={`text-center mb-12 reveal ${productsHeaderVisible ? "is-visible" : ""}`}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-teal-50 text-teal-700 text-sm font-semibold rounded-full mb-4">
              <Sparkles className="w-4 h-4" />
              Our Products
            </span>
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
              Quality Health Products
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto text-lg">
              Browse our wide range of trusted medicated products
            </p>
            <div className="section-divider mt-6" />
          </div>

          {/* Products Grid */}
          <div>
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto" />
                  <p className="text-gray-400 mt-4 text-sm">Loading products...</p>
                </div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-teal-400" />
                </div>
                <p className="text-gray-400 text-lg">
                  No products available
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <ResultsTrust />
      <TrustBadges />
      <BundleDeals />
      <VisionPanel />
      <RecentlyViewed />
      <DealsStrip />
      <Testimonials />
      <PressLogos />
      <Footer />
      <WhatsAppWidget />
    </main>
  );
}
