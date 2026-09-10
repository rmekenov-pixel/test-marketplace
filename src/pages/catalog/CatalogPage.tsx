// src/pages/catalog/CatalogPage.tsx
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, PackageOpen, X, SlidersHorizontal } from 'lucide-react';
import { useBookStore } from '../../entities/book/model/bookStore';
import { ProductCard } from '../../entities/product/ui/ProductCard';

export const CatalogPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { books, fetchBooks, filters, setFilters, isLoading } = useBookStore();

  const [searchTerm, setSearchTerm] = useState(filters.searchQuery || '');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  const isKz = i18n.language === 'kk' || i18n.language === 'kz';

  // Sync URL search params with store
  useEffect(() => {
    const urlGenre = searchParams.get('genre');
    const urlLang = searchParams.get('language') as 'kz' | 'ru' | 'all' | null;
    const urlQuery = searchParams.get('q');

    if (urlGenre || urlLang || urlQuery) {
      setFilters({
        ...(urlGenre && { genre: urlGenre }),
        ...(urlLang && { language: urlLang }),
        ...(urlQuery && { searchQuery: urlQuery }),
      });
      if (urlQuery) setSearchTerm(urlQuery);
    } else {
      fetchBooks();
    }
  }, [searchParams, setFilters, fetchBooks]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ searchQuery: searchTerm });
    if (searchTerm) {
      setSearchParams((prev) => {
        prev.set('q', searchTerm);
        return prev;
      });
    } else {
      setSearchParams((prev) => {
        prev.delete('q');
        return prev;
      });
    }
  };

  const handleGenreChange = (genre: string) => {
    setFilters({ genre });
    setSearchParams((prev) => {
      if (genre === 'all') {
        prev.delete('genre');
      } else {
        prev.set('genre', genre);
      }
      return prev;
    });
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSearchParams({});
    setFilters({
      genre: 'all',
      language: 'all',
      publisher: 'all',
      coverType: 'all',
      searchQuery: '',
      sortBy: 'popular',
    });
  };

  const hasActiveFilters =
    (filters.genre && filters.genre !== 'all') ||
    (filters.language && filters.language !== 'all') ||
    (filters.publisher && filters.publisher !== 'all') ||
    (filters.coverType && filters.coverType !== 'all') ||
    Boolean(filters.searchQuery);

  return (
    <div className="space-y-8 text-left">
      {/* Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-100">
            {t('catalog.title') || 'Кітаптар каталогы'}
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            {t('catalog.subtitle') || 'Қазақстанның таңдаулы классикалық және заманауи басылымдары'}
          </p>
        </div>

        <div className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
          {isKz ? 'Барлығы:' : 'Всего:'} <span className="text-zinc-950 dark:text-white font-bold">{books.length}</span> {isKz ? 'басылым' : 'изданий'}
        </div>
      </div>

      {/* Search and Main Filters Bar */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="flex-1 relative">
            <Search className="w-4 h-4 text-zinc-400 dark:text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={isKz ? "Кітап аты, авторы, баспасы немесе ISBN бойынша іздеу..." : "Поиск по названию, автору или ISBN..."}
              className="w-full pl-10 pr-4 py-2.5 bg-white text-zinc-900 border-zinc-300 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-100 rounded text-xs placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors shadow-xs"
            />
          </form>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowFiltersMobile(!showFiltersMobile)}
              className="md:hidden flex items-center gap-1.5 px-3 py-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded text-xs text-zinc-800 dark:text-zinc-300"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{isKz ? 'Сүзгілер' : 'Фильтры'}</span>
            </button>

            {/* Genre Select */}
            <select
              value={filters.genre || 'all'}
              onChange={(e) => handleGenreChange(e.target.value)}
              className="px-3 py-2.5 bg-white text-zinc-800 border-zinc-300 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-300 border rounded text-xs focus:outline-none focus:border-zinc-500 cursor-pointer shadow-xs"
            >
              <option value="all">{isKz ? 'Барлық санаттар' : 'Все категории'}</option>
              <option value="kazakh_classics">{isKz ? 'Қазақ классикасы' : 'Казахская классика'}</option>
              <option value="history">{isKz ? 'Тарих және шежіре' : 'История и этнография'}</option>
              <option value="business">{isKz ? 'Бизнес және қаржы' : 'Бизнес и финансы'}</option>
              <option value="psychology">{isKz ? 'Психология және даму' : 'Психология и развитие'}</option>
              <option value="fiction">{isKz ? 'Көркем әдебиет' : 'Художественная литература'}</option>
              <option value="children">{isKz ? 'Балалар әдебиеті' : 'Детская литература'}</option>
            </select>

            {/* Language Select */}
            <select
              value={filters.language || 'all'}
              onChange={(e) => setFilters({ language: e.target.value as 'all' | 'kz' | 'ru' })}
              className="px-3 py-2.5 bg-white text-zinc-800 border-zinc-300 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-300 border rounded text-xs focus:outline-none focus:border-zinc-500 cursor-pointer shadow-xs"
            >
              <option value="all">{isKz ? 'Барлық тілдер' : 'Все языки'}</option>
              <option value="kz">{isKz ? 'Қазақ тілінде' : 'На казахском'}</option>
              <option value="ru">{isKz ? 'Орыс тілінде' : 'На русском'}</option>
            </select>

            {/* Sort Select */}
            <select
              value={filters.sortBy || 'popular'}
              onChange={(e) =>
                setFilters({
                  sortBy: e.target.value as 'popular' | 'rating' | 'price_asc' | 'price_desc' | 'newest',
                })
              }
              className="px-3 py-2.5 bg-white text-zinc-800 border-zinc-300 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-300 border rounded text-xs focus:outline-none focus:border-zinc-500 cursor-pointer shadow-xs"
            >
              <option value="popular">{isKz ? 'Сұраныс бойынша' : 'По популярности'}</option>
              <option value="rating">{isKz ? 'Рейтинг бойынша' : 'По рейтингу'}</option>
              <option value="price_asc">{isKz ? 'Бағасы: арзаннан қымбатқа' : 'Сначала дешевле'}</option>
              <option value="price_desc">{isKz ? 'Бағасы: қымбаттан арзанға' : 'Сначала дороже'}</option>
              <option value="newest">{isKz ? 'Жаңа басылымдар' : 'Новинки'}</option>
            </select>
          </div>
        </div>

        {/* Active Filter Tags */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-zinc-500 font-mono text-[11px]">{isKz ? 'Қолданылған:' : 'Фильтры:'}</span>

            {filters.genre && filters.genre !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-100 text-zinc-800 border-zinc-300 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 border rounded">
                <span>{isKz ? 'Санат:' : 'Категория:'} {filters.genre}</span>
                <button
                  onClick={() => handleGenreChange('all')}
                  className="hover:text-zinc-950 dark:hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.language && filters.language !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-100 text-zinc-800 border-zinc-300 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 border rounded">
                <span>{isKz ? 'Тіл:' : 'Язык:'} {filters.language === 'kz' ? 'Қазақша' : 'Русский'}</span>
                <button
                  onClick={() => setFilters({ language: 'all' })}
                  className="hover:text-zinc-950 dark:hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-100 text-zinc-800 border-zinc-300 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 border rounded">
                <span>{isKz ? 'Іздеу:' : 'Поиск:'} "{filters.searchQuery}"</span>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilters({ searchQuery: '' });
                  }}
                  className="hover:text-zinc-950 dark:hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              onClick={handleResetFilters}
              className="text-[11px] font-mono text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white underline ml-2"
            >
              {isKz ? 'Сүзгілерді тазарту' : 'Сбросить все'}
            </button>
          </div>
        )}
      </div>

      {/* Grid or Empty State */}
      {isLoading ? (
        <div className="py-24 text-center text-xs text-zinc-500 font-mono">
          {t('common.loading') || 'Жүктелуде...'}
        </div>
      ) : books.length === 0 ? (
        <div className="py-16 flex flex-col items-center justify-center text-center p-6 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded space-y-3 shadow-xs">
          <PackageOpen className="w-10 h-10 text-zinc-400 dark:text-zinc-600 stroke-1" />
          <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            {t('catalog.noResults') || 'Сәйкес кітаптар табылмады'}
          </h3>
          <p className="text-xs text-zinc-500 max-w-sm">
            {isKz ? 'Іздеу сөзін тексеріп көріңіз немесе сүзгілерді бастапқы қалыпқа келтіріңіз.' : 'Попробуйте изменить запрос или сбросить фильтры.'}
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-2 px-4 py-2 text-xs font-semibold bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 rounded transition-colors"
          >
            {isKz ? 'Барлық кітаптарды көрсету' : 'Показать все книги'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {books.map((book) => (
            <ProductCard key={book.id} product={book} />
          ))}
        </div>
      )}
    </div>
  );
};
