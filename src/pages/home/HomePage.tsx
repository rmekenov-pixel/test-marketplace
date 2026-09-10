// src/pages/home/HomePage.tsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, BookOpen, Truck, ShieldCheck } from 'lucide-react';
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
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="border-b border-zinc-800 pb-12">
        <div className="max-w-3xl space-y-6">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase leading-[1.08]">
            Книжный маркетплейс Казахстана
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 max-w-xl leading-relaxed">
            Оригинальные казахские, мировые и деловые издания с прямой доставкой от издательств во все регионы страны.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-bold uppercase tracking-wider rounded transition-colors"
            >
              <span>{t('nav.catalog') || 'Перейти в каталог'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/auth"
              className="inline-flex items-center px-6 py-3 border border-zinc-800 hover:border-zinc-600 bg-zinc-900/50 hover:bg-zinc-900 text-zinc-300 hover:text-white text-xs font-bold uppercase tracking-wider rounded transition-colors"
            >
              {t('nav.login') || 'Войти'}
            </Link>
          </div>
        </div>
      </section>

      {/* Service Highlights */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-zinc-950 border border-zinc-800/80 rounded">
          <BookOpen className="w-5 h-5 text-zinc-300 mb-3" />
          <h3 className="text-sm font-bold text-white mb-1.5 uppercase tracking-wide">
            Прямые издания
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Книги напрямую от авторов и официальных издательств Казахстана без посредников.
          </p>
        </div>

        <div className="p-6 bg-zinc-950 border border-zinc-800/80 rounded">
          <Truck className="w-5 h-5 text-zinc-300 mb-3" />
          <h3 className="text-sm font-bold text-white mb-1.5 uppercase tracking-wide">
            Быстрая доставка
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Курьерская доставка до двери и в постаматы по Алматы, Астане и всем городам РК.
          </p>
        </div>

        <div className="p-6 bg-zinc-950 border border-zinc-800/80 rounded">
          <ShieldCheck className="w-5 h-5 text-zinc-300 mb-3" />
          <h3 className="text-sm font-bold text-white mb-1.5 uppercase tracking-wide">
            Удобная оплата
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Моментальная оплата через Kaspi QR, банковские карты и безналичный расчет.
          </p>
        </div>
      </section>

      {/* Featured Products */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight">
            Популярные книги
          </h2>

          <Link
            to="/catalog"
            className="text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white inline-flex items-center gap-1.5 transition-colors"
          >
            <span>Смотреть все</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="py-16 text-center text-xs text-zinc-500 font-mono">
            {t('common.loading') || 'Загрузка...'}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {featuredBooks.map((book) => (
              <ProductCard key={book.id} product={book} />
            ))}
          </div>
        )}
      </section>

      {/* Categories Fast Navigation */}
      <section className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
          Популярные разделы
        </h2>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Қазақ классикасы', genre: 'classic' },
            { label: 'Тарих және шежіре', genre: 'history' },
            { label: 'Бизнес және қаржы', genre: 'business' },
            { label: 'Психология және даму', genre: 'psychology' },
            { label: 'Балалар әдебиеті', genre: 'children' },
            { label: 'IT және бағдарламалау', genre: 'it' },
          ].map((cat) => (
            <Link
              key={cat.genre}
              to={`/catalog?genre=${cat.genre}`}
              className="px-3.5 py-2 text-xs font-medium bg-zinc-950 border border-zinc-800 hover:border-zinc-600 text-zinc-300 hover:text-white rounded transition-colors"
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};
