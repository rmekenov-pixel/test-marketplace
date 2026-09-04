import React, { useEffect } from 'react';
import { useBookStore } from '../../../entities/book';
import { BookCatalog } from '../../../widgets/book-catalog';
import { BookFilterPanel } from '../../../features/book/filter-books';
import { BookSearchInput } from '../../../features/book/search-books';

export const CatalogPage: React.FC = () => {
  const books = useBookStore((state) => state.books);
  const filters = useBookStore((state) => state.filters);
  const setFilters = useBookStore((state) => state.setFilters);
  const fetchBooks = useBookStore((state) => state.fetchBooks);
  const isLoading = useBookStore((state) => state.isLoading);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="pb-3 border-b border-[#30363d]">
        <h1 className="text-xl font-semibold text-[#f0f6fc]">
          Каталог литературы
        </h1>
        <p className="text-xs text-[#8d96a0]">
          Книги на казахском и русском языках с доставкой через Kaspi
        </p>
      </div>

      {/* Search Bar */}
      <BookSearchInput
        value={filters.searchQuery || ''}
        onChange={(val) => setFilters({ searchQuery: val })}
      />

      {/* Filters */}
      <BookFilterPanel
        filters={filters}
        onFilterChange={setFilters}
        totalFound={books.length}
      />

      {/* Catalog Grid Widget */}
      <BookCatalog
        books={books}
        isLoading={isLoading}
        onResetFilters={() =>
          setFilters({ genre: 'all', language: 'all', searchQuery: '', sortBy: 'popular' })
        }
      />
    </div>
  );
};
