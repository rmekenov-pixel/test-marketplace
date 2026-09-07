// src/entities/wishlist/model/wishlistStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { sanitizeId } from '../../../shared/lib/security';

interface WishlistState {
  items: string[]; // array of bookId / productId
  toggleItem: (id: string) => boolean; // returns true if added, false if removed
  isInWishlist: (id: string) => boolean;
  removeItem: (id: string) => void;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      toggleItem: (id: string) => {
        const cleanId = sanitizeId(id);
        if (!cleanId) return false;

        const { items } = get();
        const exists = items.includes(cleanId);

        if (exists) {
          set({ items: items.filter((itemId) => itemId !== cleanId) });
          return false;
        } else {
          set({ items: [...items, cleanId] });
          return true;
        }
      },

      isInWishlist: (id: string) => {
        const cleanId = sanitizeId(id);
        return get().items.includes(cleanId);
      },

      removeItem: (id: string) => {
        const cleanId = sanitizeId(id);
        set({ items: get().items.filter((itemId) => itemId !== cleanId) });
      },

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'qazaq_market_wishlist_v1',
      version: 1,
    }
  )
);
