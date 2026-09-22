"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
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

function HomeContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { ref: headerRef, visible: headerVisible } = useReveal();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") || "";

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => { setProducts(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = activeCategory
    ? products.filter((p) =>
        p.category?.trim().toLowerCase() === activeCategory.trim().toLowerCase()
      )
    : products;

  const allCategories = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <HeroSlider />
      <TrustBadges />
      <CategorySection />
      <PromoBanner />

      {/* Products Section */}
      <section id="products" className="py-12 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            ref={headerRef}
            className={`flex items-center justify-between mb-6 lg:mb-10 reveal ${headerVisible ? "is-visible" : ""}`}
          >
            <div>
              <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                {activeCategory ? activeCategory : "Best Sellers"}
              </h2>
              <div className="w-10 h-[3px] bg-[#fcb8fd] rounded-full mt-2" />
            </div>
            {activeCategory && (
              <a href="/#products" className="text-[#fcb8fd] hover:text-[#d460d6] text-sm font-bold transition-colors">
                View All â†’
              </a>
            )}
          </div>

          {/* Category filter pills */}
          {allCategories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              <a
                href="/#products"
                className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${
                  !activeCategory
                    ? "bg-[#fcb8fd] text-white border-[#fcb8fd]"
                    : "bg-white text-gray-600 border-gray-200 hover:border-[#fcb8fd] hover:text-[#fcb8fd]"
                }`}
              >
                All
              </a>
              {allCategories.map((cat) => (
                <a
                  key={cat}
                  href={`/?category=${encodeURIComponent(cat)}#products`}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${
                    activeCategory === cat
                      ? "bg-[#fcb8fd] text-white border-[#fcb8fd]"
                      : "bg-white text-gray-600 border-gray-200 hover:border-[#fcb8fd] hover:text-[#fcb8fd]"
                  }`}
                >
                  {cat}
                </a>
              ))}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-[#fde8fc] border-t-[#fcb8fd] rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg mb-4">No products in this category yet</p>
              <a href="/#products" className="text-[#fcb8fd] font-bold text-sm hover:underline">
                View all products â†’
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <BottomTrustBar />
      <InstagramReels />
      <OurClients />
      <ResultsSection />
      <VisionPanel />
      <PressLogos />
      <RecentlyViewed />
      <Footer />
    </main>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <HomeContent />
    </Suspense>
  );
}



