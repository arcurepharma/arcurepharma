"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/storefront/Navbar";
import HeroSlider from "@/components/storefront/HeroSlider";
import ProductCard from "@/components/storefront/ProductCard";
import FilterSidebar from "@/components/storefront/FilterSidebar";
import FilterModal from "@/components/storefront/FilterModal";
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
import { Sparkles, SlidersHorizontal } from "lucide-react";

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
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Filter state
  const [activeFilters, setActiveFilters] = useState({
    categories: [] as string[],
    benefits: [] as string[],
    sortBy: "popular",
  });

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

  // Extract filter options
  const categories = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
  const allBenefits = products.flatMap((p) => p.benefits || []);
  const benefits = Array.from(new Set(allBenefits)).filter(Boolean);
  const prices = products.map((p) => parseFloat(p.price));
  const minPrice = prices.length > 0 ? Math.floor(Math.min(...prices)) : 0;
  const maxPrice = prices.length > 0 ? Math.ceil(Math.max(...prices)) : 10000;

  const filterOptions = {
    categories,
    benefits,
  };

  // Apply filters
  let filteredProducts = products.filter((product) => {
    // Category filter
    if (
      activeFilters.categories.length > 0 &&
      !activeFilters.categories.includes(product.category)
    ) {
      return false;
    }

    // Benefits filter
    if (activeFilters.benefits.length > 0) {
      const productBenefits = product.benefits || [];
      const hasMatchingBenefit = activeFilters.benefits.some((benefit) =>
        productBenefits.includes(benefit)
      );
      if (!hasMatchingBenefit) {
        return false;
      }
    }

    return true;
  });

  // Apply sorting
  filteredProducts = [...filteredProducts].sort((a, b) => {
    switch (activeFilters.sortBy) {
      case "price-low":
        return parseFloat(a.price) - parseFloat(b.price);
      case "price-high":
        return parseFloat(b.price) - parseFloat(a.price);
      case "name-asc":
        return a.title.localeCompare(b.title);
      case "name-desc":
        return b.title.localeCompare(a.title);
      case "newest":
        // Assuming newer products have higher IDs
        return b.id.localeCompare(a.id);
      case "popular":
      default:
        return 0; // Keep original order
    }
  });

  const handleClearFilters = () => {
    setActiveFilters({
      categories: [],
      benefits: [],
      sortBy: "popular",
    });
  };

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

          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-6">
            <button
              onClick={() => setShowFilterModal(true)}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-all active:scale-95 shadow-md"
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filters & Sort
              {(activeFilters.categories.length +
                activeFilters.benefits.length) >
                0 && (
                <span className="ml-1 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-white text-teal-600 text-xs font-bold rounded-full">
                  {activeFilters.categories.length +
                    activeFilters.benefits.length}
                </span>
              )}
            </button>
          </div>

          {/* Desktop Layout with Sidebar */}
          <div className="grid lg:grid-cols-[280px_1fr] gap-8">
            {/* Filter Sidebar - Desktop Only */}
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <FilterSidebar
                  filterOptions={filterOptions}
                  activeFilters={activeFilters}
                  onFiltersChange={setActiveFilters}
                  onClearAll={handleClearFilters}
                  productCount={filteredProducts.length}
                />
              </div>
            </aside>

            {/* Products Grid */}
            <div>
              {loading ? (
                <div className="flex justify-center py-20">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto" />
                    <p className="text-gray-400 mt-4 text-sm">Loading products...</p>
                  </div>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-teal-400" />
                  </div>
                  <p className="text-gray-400 text-lg mb-4">
                    No products match your filters
                  </p>
                  <button
                    onClick={handleClearFilters}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-all"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Filter Modal - Mobile Only */}
      <FilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filterOptions={filterOptions}
        activeFilters={activeFilters}
        onFiltersChange={setActiveFilters}
        onClearAll={handleClearFilters}
        productCount={filteredProducts.length}
      />

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
