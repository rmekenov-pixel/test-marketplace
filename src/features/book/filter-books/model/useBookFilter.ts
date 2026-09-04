import { useMemo } from 'react';
import type { Book, BookFilterParams } from '../../../../entities/book';

export function useBookFilter(books: Book[], filters: BookFilterParams) {
  const filteredBooks = useMemo(() => {
    let result = [...books];

    if (filters.genre && filters.genre !== 'all') {
      result = result.filter((b) => b.genre === filters.genre);
    }

    if (filters.language && filters.language !== 'all') {
      result = result.filter((b) => b.language === filters.language);
    }

    if (filters.searchQuery && filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.isbn.toLowerCase().includes(q)
      );
    }

    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price_asc':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          result.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          result.sort((a, b) => b.publicationYear - a.publicationYear);
          break;
        case 'popular':
        default:
          result.sort((a, b) => b.reviewsCount - a.reviewsCount);
          break;
      }
    }

    return result;
  }, [books, filters]);

  return { filteredBooks, count: filteredBooks.length };
}
