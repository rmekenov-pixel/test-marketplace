import { create } from 'zustand';
import type { Book, BookFilterParams, CreateBookDto, UpdateBookDto } from './types';
import { bookApi } from '../api/bookApi';

interface BookState {
  books: Book[];
  isLoading: boolean;
  error: string | null;
  filters: BookFilterParams;

  fetchBooks: () => Promise<void>;
  setFilters: (filters: Partial<BookFilterParams>) => void;
  addBook: (dto: CreateBookDto) => Promise<void>;
  updateBook: (id: string, dto: UpdateBookDto) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
  updateStock: (id: string, newStock: number) => Promise<void>;
  decreaseStock: (id: string, count: number) => Promise<void>;
  resetToInitial: () => Promise<void>;
}

export const useBookStore = create<BookState>((set, get) => ({
  books: [],
  isLoading: false,
  error: null,
  filters: {
    genre: 'all',
    language: 'all',
    searchQuery: '',
    sortBy: 'popular',
  },

  fetchBooks: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await bookApi.query(get().filters);
      set({ books: data, isLoading: false });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Ошибка загрузки каталога';
      set({ error: message, isLoading: false });
    }
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
    get().fetchBooks();
  },

  addBook: async (dto) => {
    set({ isLoading: true });
    try {
      await bookApi.create(dto);
      await get().fetchBooks();
    } finally {
      set({ isLoading: false });
    }
  },

  updateBook: async (id, dto) => {
    set({ isLoading: true });
    try {
      await bookApi.update(id, dto);
      await get().fetchBooks();
    } finally {
      set({ isLoading: false });
    }
  },

  deleteBook: async (id) => {
    set({ isLoading: true });
    try {
      await bookApi.delete(id);
      await get().fetchBooks();
    } finally {
      set({ isLoading: false });
    }
  },

  updateStock: async (id, newStock) => {
    await bookApi.updateStock(id, newStock);
    await get().fetchBooks();
  },

  decreaseStock: async (id, count) => {
    await bookApi.decreaseStock(id, count);
    await get().fetchBooks();
  },

  resetToInitial: async () => {
    set({ isLoading: true });
    try {
      await bookApi.reset();
      await get().fetchBooks();
    } finally {
      set({ isLoading: false });
    }
  },
}));
