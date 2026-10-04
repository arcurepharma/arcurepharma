"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  Flame,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface Product {
  id: string;
  title: string;
  price: string;
  description: string;
  category: string;
  imageUrl: string;
  ingredients?: string;
  formula?: string;
  sku?: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_SEARCHES = [
  "ARCUDERM Serum",
  "ARCU GLEAM Face Wash",
  "ARCU-CAL K2",
  "Mida-D Vitamin D3",
  "Skin Care",
  "Supplements",
  "Deals",
];

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Focus input whenever modal opens
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = "";
      setQuery("");
      setResults([]);
      setSelectedIndex(-1);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (!isOpen) return;

    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => {
      fetch(`/api/products?q=${encodeURIComponent(trimmed)}`)
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setResults(data);
          } else {
            setResults([]);
          }
          setLoading(false);
        })
        .catch(() => {
          setResults([]);
          setLoading(false);
        });
    }, 180);

    return () => clearTimeout(timer);
  }, [query, isOpen]);

  // Handle keyboard events (ESC, Arrow keys, Enter)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
      } else if (e.key === "Enter") {
        if (selectedIndex >= 0 && results[selectedIndex]) {
          e.preventDefault();
          const target = results[selectedIndex];
          onClose();
          router.push(`/product/${target.id}`);
        } else if (query.trim()) {
          e.preventDefault();
          onClose();
          router.push(`/?q=${encodeURIComponent(query.trim())}#products`);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex, query, onClose, router]);

  if (!isOpen) return null;

  const handleSelectProduct = (id: string) => {
    onClose();
    router.push(`/product/${id}`);
  };

  const handleViewAllInShop = () => {
    onClose();
    if (query.trim()) {
      router.push(`/?q=${encodeURIComponent(query.trim())}#products`);
    } else {
      router.push("/#products");
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search Arcure Pharma products"
      className="fixed inset-0 z-[100] flex items-start justify-center pt-4 sm:pt-14 px-3 sm:px-4 animate-fade-in"
    >
      {/* Blurred Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-10 flex flex-col max-h-[88vh]">
        {/* Search Input Bar */}
        <div className="p-3 sm:p-4 border-b border-gray-100 bg-[#fdfcf9]/80">
          <div className="relative flex items-center">
            <div className="absolute left-3.5 sm:left-4 flex items-center pointer-events-none text-[#16a34a]">
              <Search className="w-5 h-5" />
            </div>

            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(-1);
              }}
              placeholder="Search products, remedies, ingredients..."
              className="w-full pl-11 sm:pl-12 pr-20 sm:pr-24 py-3 sm:py-3.5 bg-white rounded-xl sm:rounded-2xl border border-gray-200 text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#16a34a] focus:ring-4 focus:ring-[#16a34a]/10 transition-all font-medium shadow-xs"
            />

            <div className="absolute right-2 sm:right-3 flex items-center gap-1.5">
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="hidden sm:inline-flex items-center px-2 py-1 text-[11px] font-semibold text-gray-400 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                title="Press Escape to close"
              >
                ESC
              </button>

              <button
                type="button"
                onClick={onClose}
                className="sm:hidden p-1.5 rounded-full text-gray-500 hover:bg-gray-100"
                aria-label="Close search"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Category / Popular Chips */}
          <div
            className="flex items-center gap-1.5 sm:gap-2 mt-3 overflow-x-auto no-scrollbar py-0.5 text-xs"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            onWheel={(e) => {
              if (e.deltaY !== 0) {
                e.currentTarget.scrollLeft += e.deltaY;
              }
            }}
          >
            <span className="text-gray-400 font-medium shrink-0 flex items-center gap-1 text-[11px] sm:text-xs">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              Popular:
            </span>
            {POPULAR_SEARCHES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setQuery(item);
                  inputRef.current?.focus();
                }}
                className={`shrink-0 px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-medium transition-all cursor-pointer ${
                  query.toLowerCase() === item.toLowerCase()
                    ? "bg-[#16a34a] text-white shadow-xs"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-[#16a34a] hover:text-[#16a34a]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-3 sm:p-4 divide-y divide-gray-50">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-gray-500">
              <div className="w-8 h-8 border-3 border-emerald-100 border-t-[#16a34a] rounded-full animate-spin" />
              <p className="text-xs sm:text-sm font-medium">
                Searching Arcure catalog...
              </p>
            </div>
          ) : query.trim() && results.length > 0 ? (
            <div className="space-y-1.5">
              <div className="px-2 pb-2 flex items-center justify-between text-xs text-gray-500 font-semibold uppercase tracking-wider">
                <span>Matching Products ({results.length})</span>
                <span className="text-[11px] normal-case text-gray-400">
                  Use &uarr;&darr; to navigate, Enter to view
                </span>
              </div>

              {results.map((product, idx) => {
                const isSelected = selectedIndex === idx;
                const isDeal =
                  product.category?.toLowerCase().includes("deal") ||
                  product.category?.toLowerCase().includes("bundle");

                return (
                  <div
                    key={product.id}
                    onClick={() => handleSelectProduct(product.id)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`group flex items-center gap-3 sm:gap-4 p-2.5 sm:p-3 rounded-2xl cursor-pointer transition-all ${
                      isSelected
                        ? "bg-[#f0fdf4] border border-[#bbf7d0] shadow-xs"
                        : "hover:bg-gray-50 border border-transparent"
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 shrink-0 bg-white rounded-xl border border-gray-100 overflow-hidden flex items-center justify-center shadow-xs">
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt={product.title}
                          fill
                          className="object-contain p-1 group-hover:scale-105 transition-transform"
                          sizes="64px"
                        />
                      ) : (
                        <ShoppingBag className="w-6 h-6 text-gray-300" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span
                          className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                            isDeal
                              ? "bg-amber-100 text-amber-800"
                              : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          {product.category || "Health"}
                        </span>
                        {product.sku && (
                          <span className="text-[10px] text-gray-400 font-mono hidden sm:inline">
                            {product.sku}
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-[#16a34a] transition-colors truncate">
                        {product.title}
                      </h4>

                      <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                        {product.formula || product.ingredients || product.description}
                      </p>
                    </div>

                    {/* Price & Action */}
                    <div className="text-right shrink-0">
                      <div className="text-sm sm:text-base font-extrabold text-[#16a34a]">
                        {formatPrice(product.price)}
                      </div>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-400 group-hover:text-[#16a34a] transition-colors mt-0.5">
                        <span>View</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : query.trim() && !loading && results.length === 0 ? (
            <div className="py-12 px-4 text-center">
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-3 text-gray-400">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-gray-800">
                No products found for &ldquo;{query}&rdquo;
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto mt-1 mb-5">
                We couldn&apos;t find matching products. Try searching for general terms
                like &ldquo;Serum&rdquo;, &ldquo;Wash&rdquo;, or &ldquo;Supplements&rdquo;.
              </p>
              <button
                type="button"
                onClick={handleViewAllInShop}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#16a34a] hover:bg-[#15803d] text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-all"
              >
                Browse All Products
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Idle initial view */
            <div className="py-8 px-4">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#16a34a]" />
                Featured Categories
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div
                  onClick={() => {
                    setQuery("Skin Care");
                    inputRef.current?.focus();
                  }}
                  className="p-3 rounded-xl border border-gray-100 hover:border-emerald-200 hover:bg-[#f0fdf4]/50 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div>
                    <h5 className="text-sm font-bold text-gray-800 group-hover:text-[#16a34a]">
                      Skin Care &amp; Serums
                    </h5>
                    <p className="text-xs text-gray-400 mt-0.5">
                      ARCUDERM CS Serum, ARCU GLEAM Cleanser
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#16a34a] group-hover:translate-x-0.5 transition-all" />
                </div>

                <div
                  onClick={() => {
                    setQuery("Supplements");
                    inputRef.current?.focus();
                  }}
                  className="p-3 rounded-xl border border-gray-100 hover:border-amber-200 hover:bg-amber-50/40 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div>
                    <h5 className="text-sm font-bold text-gray-800 group-hover:text-amber-700">
                      Supplements &amp; Vitamins
                    </h5>
                    <p className="text-xs text-gray-400 mt-0.5">
                      ARCU-CAL K2, Mida-D Vitamin D3
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-amber-700 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        {query.trim() && results.length > 0 && (
          <div className="p-3 sm:p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">
              Showing top results for &ldquo;{query}&rdquo;
            </span>
            <button
              type="button"
              onClick={handleViewAllInShop}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#16a34a] hover:text-[#15803d] transition-colors"
            >
              <span>View full catalog</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
