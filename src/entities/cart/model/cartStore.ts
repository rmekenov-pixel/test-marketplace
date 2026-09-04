import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from './types';
import type { Book } from '../../book';

interface CartState {
  items: CartItem[];
  addItem: (book: Book, quantity?: number) => void;
  removeItem: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (book, quantity = 1) => {
        const { items } = get();
        const existingItem = items.find((item) => item.book.id === book.id);

        if (existingItem) {
          const newQty = Math.min(existingItem.quantity + quantity, book.stock);
          set({
            items: items.map((item) =>
              item.book.id === book.id
                ? { ...item, quantity: newQty }
                : item
            ),
          });
        } else {
          set({
            items: [...items, { book, quantity: Math.min(quantity, book.stock) }],
          });
        }
      },

      removeItem: (bookId) => {
        set({
          items: get().items.filter((item) => item.book.id !== bookId),
        });
      },

      updateQuantity: (bookId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(bookId);
          return;
        }

        set({
          items: get().items.map((item) =>
            item.book.id === bookId
              ? { ...item, quantity: Math.min(quantity, item.book.stock) }
              : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.book.price * item.quantity,
          0
        );
      },

      getTotalCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'kitap_all_cart_v2',
    }
  )
);
