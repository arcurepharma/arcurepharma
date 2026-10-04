"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, X } from "lucide-react";
import Navbar from "@/components/storefront/Navbar";
import HeroSlider from "@/components/storefront/HeroSlider";
import TrustBadges from "@/components/storefront/TrustBadges";
import CategorySection from "@/components/storefront/CategorySection";
import DealsSection from "@/components/storefront/DealsSection";
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
  const rawQ = searchParams.get("q") || searchParams.get("search") || "";
  const searchQuery = rawQ.trim().toLowerCase();
  const activeCategory = searchParams.get("category") || "";

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => { setProducts(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (rawQ) {
      const el = document.getElementById("products");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [rawQ]);

  const DEAL_CATEGORIES = ["Deals", "Deals & Bundles", "Deal", "Bundle"];
  const isDealCategory = (c?: string) => DEAL_CATEGORIES.includes(c?.trim() || "");

  let filtered = products.filter((p) => !isDealCategory(p.category));

  if (activeCategory) {
    filtered = filtered.filter(
      (p) => p.category?.trim().toLowerCase() === activeCategory.trim().toLowerCase()
    );
  }

  if (searchQuery) {
    filtered = filtered.filter((p) => {
      const matchTitle = (p.title || "").toLowerCase().includes(searchQuery);
      const matchCat = (p.category || "").toLowerCase().includes(searchQuery);
      const matchDesc = (p.description || "").toLowerCase().includes(searchQuery);
      const matchIngr = (p.ingredients || "").toLowerCase().includes(searchQuery);
      return matchTitle || matchCat || matchDesc || matchIngr;
    });
  }

  const allCategories = Array.from(
    new Set(products.filter((p) => !isDealCategory(p.category)).map((p) => p.category).filter(Boolean))
  );

  return (
    <main className="min-h-screen bg-transparent">
      <Navbar />
      <HeroSlider />
      <TrustBadges />
      <CategorySection />

      {/* Products Section */}
      <section id="products" className="py-12 lg:py-20 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            ref={headerRef}
            className={`flex items-center justify-between mb-6 lg:mb-10 reveal ${headerVisible ? "is-visible" : ""}`}
          >
            <div>
              <div className="flex items-center gap-2">
                {rawQ && <Search className="w-5 h-5 sm:w-6 sm:h-6 text-[#16a34a]" />}
                <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                  {rawQ
                    ? `Results for "${rawQ}"`
                    : activeCategory
                    ? activeCategory
                    : "Featured Products"}
                </h2>
              </div>
              <div className="w-10 h-[3px] bg-[#865105] rounded-full mt-2" />
              {rawQ && (
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Found {filtered.length} matching product{filtered.length === 1 ? "" : "s"}
                </p>
              )}
            </div>
            {(activeCategory || rawQ) && (
              <Link
                href="/#products"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 text-xs sm:text-sm font-bold rounded-xl transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                <span>Clear {rawQ ? "Search" : "Filter"}</span>
              </Link>
            )}
          </div>

          {/* Category filter pills */}
          {allCategories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              <Link
                href="/#products"
                className={`px-5 py-1.5 rounded-full text-xs sm:text-sm font-semibold border transition-all ${
                  !activeCategory
                    ? "bg-[#815a1f] text-white border-[#815a1f] shadow-sm"
                    : "bg-white text-gray-700 border-gray-300 hover:border-[#815a1f] hover:text-[#815a1f]"
                }`}
              >
                All
              </Link>
              {allCategories.map((cat) => (
                <Link
                  key={cat}
                  href={`/?category=${encodeURIComponent(cat)}#products`}
                  className={`px-5 py-1.5 rounded-full text-xs sm:text-sm font-semibold border transition-all ${
                    activeCategory === cat
                      ? "bg-[#815a1f] text-white border-[#815a1f] shadow-sm"
                      : "bg-white text-gray-700 border-gray-300 hover:border-[#815a1f] hover:text-[#815a1f]"
                  }`}
                >
                  {cat}
                </Link>
              ))}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-[#dcfce7] border-t-[#16a34a] rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg mb-4">
                {rawQ
                  ? `No products found matching "${rawQ}"`
                  : "No products in this category yet"}
              </p>
              <Link href="/#products" className="text-[#16a34a] font-bold text-sm hover:underline">
                View all products &rarr;
              </Link>
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

      <DealsSection />

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
    <Suspense fallback={<div className="min-h-screen bg-[#c8a882]" />}>
      <HomeContent />
    </Suspense>
  );
}



