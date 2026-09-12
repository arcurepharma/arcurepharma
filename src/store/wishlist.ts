import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistItem {
  id: string;
  title: string;
  price: string;
  imageUrl: string;
  addedAt: number;
}

interface WishlistStore {
  items: WishlistItem[];
  addItem: (item: Omit<WishlistItem, "addedAt">) => void;
  removeItem: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
  syncWithServer: (userId: string) => Promise<void>;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const { items } = get();
        if (items.find((i) => i.id === item.id)) return;
        
        set({
          items: [...items, { ...item, addedAt: Date.now() }],
        });
      },
      
      removeItem: (id) => {
        set({
          items: get().items.filter((item) => item.id !== id),
        });
      },
      
      isInWishlist: (id) => {
        return get().items.some((item) => item.id === id);
      },
      
      clearWishlist: () => set({ items: [] }),
      
      syncWithServer: async (userId: string) => {
        if (!userId) return;
        
        try {
          // Fetch wishlist from server
          const response = await fetch(`/api/wishlist?userId=${userId}`);
          if (response.ok) {
            const serverItems = await response.json();
            
            // Merge local and server wishlists
            const localItems = get().items;
            const merged = [...serverItems];
            
            localItems.forEach((local) => {
              if (!merged.find((item) => item.id === local.id)) {
                merged.push(local);
              }
            });
            
            set({ items: merged });
            
            // Sync back to server
            await fetch("/api/wishlist", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userId, items: merged }),
            });
          }
        } catch (error) {
          console.error("Failed to sync wishlist:", error);
        }
      },
    }),
    {
      name: "arcure-wishlist",
    }
  )
);
