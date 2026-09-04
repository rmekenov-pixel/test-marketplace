import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Book, CartItem } from '../types';

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

      addItem: (book: Book, quantity = 1) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.book.id === book.id
          );

          if (existingItemIndex > -1) {
            const updatedItems = [...state.items];
            const currentItem = updatedItems[existingItemIndex];
            const newQuantity = Math.min(
              book.stock,
              currentItem.quantity + quantity
            );

            updatedItems[existingItemIndex] = {
              ...currentItem,
              quantity: newQuantity,
            };
            return { items: updatedItems };
          }

          if (book.stock <= 0) return state;

          return {
            items: [
              ...state.items,
              { book, quantity: Math.min(book.stock, quantity) },
            ],
          };
        });
      },

      removeItem: (bookId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.book.id !== bookId),
        }));
      },

      updateQuantity: (bookId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(bookId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) => {
            if (item.book.id === bookId) {
              const safeQuantity = Math.min(item.book.stock, quantity);
              return { ...item, quantity: safeQuantity };
            }
            return item;
          }),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.book.price * item.quantity,
          0
        );
      },

      getTotalCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'kitap_cart_storage',
    }
  )
);
