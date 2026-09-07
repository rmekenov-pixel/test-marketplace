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
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">
          {t('catalog.title')}
        </h1>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
          {t('catalog.subtitle')}
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('catalog.search')}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-sky-500 transition-colors"
          />
        </form>

        {/* Filter / Sort dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={filters.genre || 'all'}
            onChange={(e) => setFilters({ genre: e.target.value })}
            className="px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:border-sky-500 cursor-pointer"
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
            className="px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:border-sky-500 cursor-pointer"
          >
            <option value="all">Все языки</option>
            <option value="kz">Қазақша</option>
            <option value="ru">Русский</option>
          </select>

          <select
            value={filters.sortBy || 'popular'}
            onChange={(e) => setFilters({ sortBy: e.target.value as 'popular' | 'rating' | 'price_asc' | 'price_desc' | 'newest' })}
            className="px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:border-sky-500 cursor-pointer"
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
        <div className="py-24 text-center text-xs text-slate-400">
          {t('common.loading')}
        </div>
      ) : books.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-center p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded">
          <PackageOpen className="w-10 h-10 text-slate-400 mb-3 stroke-1" />
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">
            {t('catalog.noResults')}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
            Попробуйте изменить параметры поиска или сбросить фильтры.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilters({ genre: 'all', language: 'all', searchQuery: '', sortBy: 'popular' });
            }}
            className="mt-4 px-4 py-2 text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
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
