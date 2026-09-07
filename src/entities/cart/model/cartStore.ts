import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, PopulatedCartItem } from './types';
import type { Book } from '../../book';
import { sanitizeId, sanitizeQuantity, sanitizeStock } from '../../../shared/lib/security';

interface CartState {
  items: CartItem[];
  addItem: (bookId: string, quantity?: number, maxStock?: number) => void;
  removeItem: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number, maxStock?: number) => void;
  clearCart: () => void;
  getTotalCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (bookId, quantity = 1, maxStock = 999) => {
        const cleanId = sanitizeId(bookId);
        if (!cleanId) return;

        const cleanMaxStock = sanitizeStock(maxStock, 999);
        const cleanQty = sanitizeQuantity(quantity, cleanMaxStock);
        const { items } = get();
        const existing = items.find((i) => i.bookId === cleanId);

        if (existing) {
          const newQty = Math.min(existing.quantity + cleanQty, cleanMaxStock);
          set({
            items: items.map((i) =>
              i.bookId === cleanId ? { ...i, quantity: newQty } : i
            ),
          });
        } else {
          set({
            items: [...items, { bookId: cleanId, quantity: Math.min(cleanQty, cleanMaxStock) }],
          });
        }
      },

      removeItem: (bookId) => {
        const cleanId = sanitizeId(bookId);
        set({
          items: get().items.filter((i) => i.bookId !== cleanId),
        });
      },

      updateQuantity: (bookId, quantity, maxStock = 999) => {
        const cleanId = sanitizeId(bookId);
        if (!cleanId) return;

        if (quantity <= 0) {
          get().removeItem(cleanId);
          return;
        }

        const cleanMaxStock = sanitizeStock(maxStock, 999);
        const cleanQty = sanitizeQuantity(quantity, cleanMaxStock);

        set({
          items: get().items.map((i) =>
            i.bookId === cleanId
              ? { ...i, quantity: cleanQty }
              : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getTotalCount: () => {
        return get().items.reduce((total, i) => total + i.quantity, 0);
      },
    }),
    {
      name: 'kitap_all_cart_v3',
      version: 1,
      migrate: (persistedState: unknown, version: number) => {
        if (version === 0 && persistedState && typeof persistedState === 'object') {
          // Migration from old unnormalized format: items had { book: { id }, quantity }
          const state = persistedState as { items?: Array<{ book?: { id?: string }; bookId?: string; quantity?: number }> };
          const migratedItems: CartItem[] = (state.items || []).map((item) => ({
            bookId: item.bookId || item.book?.id || '',
            quantity: item.quantity || 1,
          })).filter((i) => Boolean(i.bookId));

          return { items: migratedItems };
        }
        return persistedState as CartState;
      },
    }
  )
);

/**
 * Selector to populate normalized cart items with live Book entity data.
 */
export function getPopulatedCart(cartItems: CartItem[], catalogBooks: Book[]): {
  populatedItems: PopulatedCartItem[];
  totalPrice: number;
  totalCount: number;
} {
  const populatedItems: PopulatedCartItem[] = [];
  let totalPrice = 0;
  let totalCount = 0;

  for (const item of cartItems) {
    const book = catalogBooks.find((b) => b.id === item.bookId);
    if (book) {
      const subtotal = book.price * item.quantity;
      totalPrice += subtotal;
      totalCount += item.quantity;
      populatedItems.push({
        bookId: item.bookId,
        quantity: item.quantity,
        book,
        subtotal,
      });
    }
  }

  return { populatedItems, totalPrice, totalCount };
}
