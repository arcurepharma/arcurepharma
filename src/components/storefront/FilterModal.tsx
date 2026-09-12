"use client";

import { X } from "lucide-react";
import { useEffect } from "react";
import FilterSidebar from "./FilterSidebar";

interface ActiveFiltersType {
  categories: string[];
  benefits: string[];
  sortBy: string;
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filterOptions: {
    categories: string[];
    benefits: string[];
  };
  activeFilters: ActiveFiltersType;
  onFiltersChange: (filters: ActiveFiltersType) => void;
  onClearAll: () => void;
  productCount: number;
}

export default function FilterModal({
  isOpen,
  onClose,
  filterOptions,
  activeFilters,
  onFiltersChange,
  onClearAll,
  productCount,
}: FilterModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex lg:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-950/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative ml-auto w-full max-w-xs sm:max-w-sm bg-white h-full overflow-y-auto animate-slide-in-right shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between min-h-[56px]">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Filters & Sort</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors min-h-[44px] min-w-[44px]"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Content */}
        <div className="p-3 sm:p-4">
          <FilterSidebar
            filterOptions={filterOptions}
            activeFilters={activeFilters}
            onFiltersChange={onFiltersChange}
            onClearAll={onClearAll}
            productCount={productCount}
          />
        </div>

        {/* Apply Button */}
        <div className="sticky bottom-0 z-10 bg-white border-t border-gray-200 px-3 sm:px-6 py-3 sm:py-4">
          <button
            onClick={onClose}
            className="w-full px-4 sm:px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm sm:text-base rounded-lg sm:rounded-xl transition-all active:scale-95 shadow-md min-h-[44px]"
          >
            Show {productCount} Product{productCount !== 1 ? "s" : ""}
          </button>
        </div>
      </div>
    </div>
  );
}
