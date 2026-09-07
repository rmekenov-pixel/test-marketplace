// src/pages/home/HomePage.tsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, BookOpen, ShieldCheck, Truck } from 'lucide-react';
import { useBookStore } from '../../entities/book/model/bookStore';
import { ProductCard } from '../../entities/product/ui/ProductCard';

export const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const { books, fetchBooks, isLoading } = useBookStore();

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const featuredBooks = books.slice(0, 4);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 md:p-12">
        <div className="max-w-2xl space-y-4">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Книжный маркетплейс Казахстана
          </h1>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium rounded transition-colors"
            >
              <span>{t('nav.catalog')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/auth"
              className="inline-flex items-center px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-medium rounded transition-colors"
            >
              {t('nav.login')}
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded">
          <BookOpen className="w-6 h-6 text-sky-600 dark:text-sky-400 mb-3" />
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">
            Широкий каталог
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Тысячи книг на казахском и русском языках от ведущих издательств.
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded">
          <Truck className="w-6 h-6 text-sky-600 dark:text-sky-400 mb-3" />
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">
            Доставка по РК
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Оперативная курьерская доставка во все регионы и города Казахстана.
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded">
          <ShieldCheck className="w-6 h-6 text-sky-600 dark:text-sky-400 mb-3" />
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">
            Оплата Kaspi QR
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Безопасная и моментальная оплата через Kaspi QR и банковские карты.
          </p>
        </div>
      </section>

      {/* Featured Products */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Популярные книги
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Выбор читателей в этом месяце
            </p>
          </div>

          <Link
            to="/catalog"
            className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline inline-flex items-center gap-1"
          >
            <span>Смотреть все</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-xs text-slate-400">
            {t('common.loading')}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredBooks.map((book) => (
              <ProductCard key={book.id} product={book} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
