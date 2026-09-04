import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Book } from '../types';
import { INITIAL_BOOKS } from '../data/books';

interface BookState {
  books: Book[];
  addBook: (bookData: Omit<Book, 'id'>) => void;
  updateBook: (id: string, bookData: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  updateStock: (id: string, newStock: number) => void;
  decreaseStock: (id: string, quantity: number) => void;
  resetToInitial: () => void;
}

export const useBookStore = create<BookState>()(
  persist(
    (set) => ({
      books: INITIAL_BOOKS,

      addBook: (bookData) => {
        const newBook: Book = {
          ...bookData,
          id: `book-${Date.now()}`,
        };
        set((state) => ({
          books: [newBook, ...state.books],
        }));
      },

      updateBook: (id, bookData) => {
        set((state) => ({
          books: state.books.map((b) => (b.id === id ? { ...b, ...bookData } : b)),
        }));
      },

      deleteBook: (id) => {
        set((state) => ({
          books: state.books.filter((b) => b.id !== id),
        }));
      },

      updateStock: (id, newStock) => {
        set((state) => ({
          books: state.books.map((b) =>
            b.id === id ? { ...b, stock: Math.max(0, newStock) } : b
          ),
        }));
      },

      decreaseStock: (id, quantity) => {
        set((state) => ({
          books: state.books.map((b) =>
            b.id === id ? { ...b, stock: Math.max(0, b.stock - quantity) } : b
          ),
        }));
      },

      resetToInitial: () => {
        set({ books: INITIAL_BOOKS });
      },
    }),
    {
      name: 'kitap_books_storage',
    }
  )
);
