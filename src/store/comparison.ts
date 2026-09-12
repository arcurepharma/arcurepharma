import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Product {
  id: string;
  title: string;
  price: string;
  imageUrl: string;
  category?: string;
  description?: string;
  benefits?: string[];
  ingredients?: string;
}

interface ComparisonStore {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  clearAll: () => void;
  isInComparison: (id: string) => boolean;
}

export const useComparisonStore = create<ComparisonStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        const { items } = get();
        if (items.length >= 4) {
          return; // Max 4 products for comparison
        }
        if (items.find((item) => item.id === product.id)) {
          return; // Already in comparison
        }
        set({ items: [...items, product] });
      },
      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },
      clearAll: () => set({ items: [] }),
      isInComparison: (id) => {
        return get().items.some((item) => item.id === id);
      },
    }),
    {
      name: "arcure-comparison",
    }
  )
);
