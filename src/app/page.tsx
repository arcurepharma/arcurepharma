"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/storefront/Navbar";
import HeroSlider from "@/components/storefront/HeroSlider";
import TrustBadges from "@/components/storefront/TrustBadges";
import CategorySection from "@/components/storefront/CategorySection";
import PromoBanner from "@/components/storefront/PromoBanner";
import ProductCard from "@/components/storefront/ProductCard";
import InstagramReels from "@/components/storefront/InstagramReels";
import OurClients from "@/components/storefront/OurClients";
import ResultsSection from "@/components/storefront/ResultsSection";
import VisionPanel from "@/components/storefront/VisionPanel";
import PressLogos from "@/components/storefront/PressLogos";
import RecentlyViewed from "@/components/storefront/RecentlyViewed";
import Footer from "@/components/storefront/Footer";
import BottomTrustBar from "@/components/storefront/BottomTrustBar";
import { useReveal } from "@/lib/useReveal";

interface Product {
  id: string;
  title: string;
  price: string;
  imageUrl: string;
  category: string;
  description: string;
  benefits?: string[];
  ingredients?: string;
  images?: string[];
  videoUrl?: string | null;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { ref: headerRef, visible: headerVisible } = useReveal();

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => { setProducts(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* 1. Hero */}
      <HeroSlider />

      {/* 2. Trust badges strip */}
      <TrustBadges />

      {/* 3. Shop by Category */}
      <CategorySection />

      {/* 4. Promo Banner */}
      <PromoBanner />

      {/* 5. Best Sellers */}
      <section id="products" className="py-12 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div
            ref={headerRef}
            className={`flex items-center justify-between mb-8 lg:mb-10 reveal ${headerVisible ? "is-visible" : ""}`}
          >
            <div>
              <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                Best Sellers
              </h2>
              <div className="w-10 h-[3px] bg-[#a83866] rounded-full mt-2" />
            </div>
            <a
              href="/#products"
              className="text-[#a83866] hover:text-[#8a2a52] text-sm font-bold uppercase tracking-wide transition-colors"
            >
              View All →
            </a>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-[#fae3ec] border-t-[#a83866] rounded-full animate-spin" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 text-gray-400 text-lg">
              No products available yet
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 6. Bottom trust bar — FREE SHIPPING, EASY RETURNS, etc. */}
      <BottomTrustBar />

      {/* 7. Instagram / Social proof */}
      <InstagramReels />

      {/* 7. What Our Clients Say */}
      <OurClients />

      {/* 8. Results */}
      <ResultsSection />

      {/* 9. Vision / Why us */}
      <VisionPanel />

      {/* 10. Press / Certifications */}
      <PressLogos />

      {/* 11. Recently Viewed */}
      <RecentlyViewed />

      {/* 12. Footer (includes About) */}
      <Footer />
    </main>
  );
}
