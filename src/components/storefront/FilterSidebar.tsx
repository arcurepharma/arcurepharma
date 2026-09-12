"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, X, SlidersHorizontal } from "lucide-react";

interface FilterOptions {
  categories: string[];
  benefits: string[];
}

interface ActiveFilters {
  categories: string[];
  benefits: string[];
  sortBy: string;
}

interface FilterSidebarProps {
  filterOptions: FilterOptions;
  activeFilters: ActiveFilters;
  onFiltersChange: (filters: ActiveFilters) => void;
  onClearAll: () => void;
  productCount: number;
}

export default function FilterSidebar({
  filterOptions,
  activeFilters,
  onFiltersChange,
  onClearAll,
  productCount,
}: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    benefits: true,
    sort: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleCategoryToggle = (category: string) => {
    const newCategories = activeFilters.categories.includes(category)
      ? activeFilters.categories.filter((c) => c !== category)
      : [...activeFilters.categories, category];
    onFiltersChange({ ...activeFilters, categories: newCategories });
  };

  const handleBenefitToggle = (benefit: string) => {
    const newBenefits = activeFilters.benefits.includes(benefit)
      ? activeFilters.benefits.filter((b) => b !== benefit)
      : [...activeFilters.benefits, benefit];
    onFiltersChange({ ...activeFilters, benefits: newBenefits });
  };

  const handleSortChange = (sortBy: string) => {
    onFiltersChange({ ...activeFilters, sortBy });
  };

  const activeFilterCount =
    activeFilters.categories.length +
    activeFilters.benefits.length;

  const sortOptions = [
    { value: "popular", label: "Most Popular" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "newest", label: "Newest First" },
    { value: "name-asc", label: "Name: A to Z" },
    { value: "name-desc", label: "Name: Z to A" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5" />
            <h3 className="font-bold text-lg">Filters</h3>
          </div>
          {activeFilterCount > 0 && (
            <button
              onClick={onClearAll}
              className="text-xs font-semibold bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5"
            >
              <X className="w-3.5 h-3.5" />
              Clear All
            </button>
          )}
        </div>
        {activeFilterCount > 0 && (
          <p className="text-teal-100 text-xs mt-2">
            {activeFilterCount} filter{activeFilterCount !== 1 ? "s" : ""} active
            • {productCount} product{productCount !== 1 ? "s" : ""} found
          </p>
        )}
      </div>

      <div className="divide-y divide-gray-200">
        {/* Sort By */}
        <div className="p-6">
          <button
            onClick={() => toggleSection("sort")}
            className="flex items-center justify-between w-full mb-4 group"
          >
            <span className="font-semibold text-gray-900 text-sm">Sort By</span>
            {expandedSections.sort ? (
              <ChevronUp className="w-5 h-5 text-gray-400 group-hover:text-teal-600 transition-colors" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-teal-600 transition-colors" />
            )}
          </button>
          {expandedSections.sort && (
            <div className="space-y-2">
              {sortOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-3 cursor-pointer group py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="radio"
                    name="sortBy"
                    value={option.value}
                    checked={activeFilters.sortBy === option.value}
                    onChange={() => handleSortChange(option.value)}
                    className="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Category Filter */}
        {filterOptions.categories.length > 0 && (
          <div className="p-6">
            <button
              onClick={() => toggleSection("category")}
              className="flex items-center justify-between w-full mb-4 group"
            >
              <span className="font-semibold text-gray-900 text-sm">
                Category
                {activeFilters.categories.length > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center w-5 h-5 bg-teal-600 text-white text-xs font-bold rounded-full">
                    {activeFilters.categories.length}
                  </span>
                )}
              </span>
              {expandedSections.category ? (
                <ChevronUp className="w-5 h-5 text-gray-400 group-hover:text-teal-600 transition-colors" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-teal-600 transition-colors" />
              )}
            </button>
            {expandedSections.category && (
              <div className="space-y-2">
                {filterOptions.categories.map((category) => (
                  <label
                    key={category}
                    className="flex items-center gap-3 cursor-pointer group py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={activeFilters.categories.includes(category)}
                      onChange={() => handleCategoryToggle(category)}
                      className="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900 flex-1">
                      {category}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

{/* Benefits Filter */}
        {filterOptions.benefits.length > 0 && (
          <div className="p-6">
            <button
              onClick={() => toggleSection("benefits")}
              className="flex items-center justify-between w-full mb-4 group"
            >
              <span className="font-semibold text-gray-900 text-sm">
                Benefits
                {activeFilters.benefits.length > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center w-5 h-5 bg-teal-600 text-white text-xs font-bold rounded-full">
                    {activeFilters.benefits.length}
                  </span>
                )}
              </span>
              {expandedSections.benefits ? (
                <ChevronUp className="w-5 h-5 text-gray-400 group-hover:text-teal-600 transition-colors" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-teal-600 transition-colors" />
              )}
            </button>
            {expandedSections.benefits && (
              <div className="space-y-2">
                {filterOptions.benefits.map((benefit) => (
                  <label
                    key={benefit}
                    className="flex items-center gap-3 cursor-pointer group py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={activeFilters.benefits.includes(benefit)}
                      onChange={() => handleBenefitToggle(benefit)}
                      className="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900 flex-1">
                      {benefit}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Active Filters Pills */}
      {activeFilterCount > 0 && (
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Active Filters
            </span>
            <button
              onClick={onClearAll}
              className="text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors"
            >
              Clear All
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeFilters.categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryToggle(category)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-xs font-medium rounded-full hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-colors"
              >
                {category}
                <X className="w-3 h-3" />
              </button>
            ))}
            {activeFilters.benefits.map((benefit) => (
              <button
                key={benefit}
                onClick={() => handleBenefitToggle(benefit)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-xs font-medium rounded-full hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-colors"
              >
                {benefit}
                <X className="w-3 h-3" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
