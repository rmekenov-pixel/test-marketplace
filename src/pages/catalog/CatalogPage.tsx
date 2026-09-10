import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, PackageOpen } from 'lucide-react';
import { useBookStore } from '../../entities/book/model/bookStore';
import { ProductCard } from '../../entities/product/ui/ProductCard';

export const CatalogPage: React.FC = () => {
  const { t } = useTranslation();
  const { books, fetchBooks, filters, setFilters, isLoading } = useBookStore();

  const [searchTerm, setSearchTerm] = useState(filters.searchQuery || '');

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ searchQuery: searchTerm });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-zinc-800 pb-4">
        <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-zinc-100">
          {t('catalog.title')}
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          {t('catalog.subtitle')}
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('catalog.search')}
            className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
          />
        </form>

        {/* Filter / Sort dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filters.genre || 'all'}
            onChange={(e) => setFilters({ genre: e.target.value })}
            className="px-3 py-2 bg-zinc-900 border border-zinc-800 rounded text-xs text-zinc-300 focus:outline-none focus:border-zinc-500 cursor-pointer"
          >
            <option value="all">{t('catalog.allCategories')}</option>
            <option value="kazakh_classics">Қазақ классикасы</option>
            <option value="history">Тарих / История</option>
            <option value="business">Бизнес и финансы</option>
            <option value="psychology">Психология и саморазвитие</option>
            <option value="children">Балалар әдебиеті</option>
          </select>

          <select
            value={filters.language || 'all'}
            onChange={(e) => setFilters({ language: e.target.value as 'all' | 'kz' | 'ru' })}
            className="px-3 py-2 bg-zinc-900 border border-zinc-800 rounded text-xs text-zinc-300 focus:outline-none focus:border-zinc-500 cursor-pointer"
          >
            <option value="all">Все языки</option>
            <option value="kz">Қазақша</option>
            <option value="ru">Русский</option>
          </select>

          <select
            value={filters.sortBy || 'popular'}
            onChange={(e) => setFilters({ sortBy: e.target.value as 'popular' | 'rating' | 'price_asc' | 'price_desc' | 'newest' })}
            className="px-3 py-2 bg-zinc-900 border border-zinc-800 rounded text-xs text-zinc-300 focus:outline-none focus:border-zinc-500 cursor-pointer"
          >
            <option value="popular">{t('catalog.popular')}</option>
            <option value="price_asc">{t('catalog.priceAsc')}</option>
            <option value="price_desc">{t('catalog.priceDesc')}</option>
            <option value="rating">{t('catalog.rating')}</option>
            <option value="newest">{t('catalog.newest')}</option>
          </select>
        </div>
      </div>

      {/* Grid or Empty State */}
      {isLoading ? (
        <div className="py-24 text-center text-xs text-zinc-500">
          {t('common.loading')}
        </div>
      ) : books.length === 0 ? (
        <div className="py-16 flex flex-col items-center justify-center text-center p-6 bg-zinc-950 border border-zinc-800 rounded">
          <PackageOpen className="w-10 h-10 text-zinc-600 mb-3 stroke-1" />
          <h3 className="text-sm font-semibold text-zinc-200 mb-1">
            {t('catalog.noResults')}
          </h3>
          <p className="text-xs text-zinc-500 max-w-sm">
            Попробуйте изменить параметры поиска или сбросить фильтры.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilters({ genre: 'all', language: 'all', searchQuery: '', sortBy: 'popular' });
            }}
            className="mt-4 px-4 py-2 text-xs font-medium bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded text-zinc-300 transition-colors"
          >
            Сбросить фильтры
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <ProductCard key={book.id} product={book} />
          ))}
        </div>
      )}
    </div>
  );
};
