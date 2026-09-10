// src/pages/home/HomePage.tsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, BookOpen, Truck, ShieldCheck } from 'lucide-react';
import { useBookStore } from '../../entities/book/model/bookStore';
import { ProductCard } from '../../entities/product/ui/ProductCard';

export const HomePage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { books, fetchBooks, isLoading } = useBookStore();

  const isKz = i18n.language === 'kk' || i18n.language === 'kz';

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const bestsellers = books.filter((b) => b.isFeatured || b.rating >= 4.9).slice(0, 4);
  const classics = books.filter((b) => b.genre === 'kazakh_classics').slice(0, 4);
  const business = books.filter((b) => b.genre === 'business' || b.genre === 'psychology').slice(0, 4);

  return (
    <div className="space-y-16 text-left">
      {/* Hero Section */}
      <section className="border-b border-zinc-200 dark:border-zinc-800 pb-12">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-zinc-100 text-zinc-700 border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 text-[11px] font-mono dark:text-zinc-400">
            <span>{isKz ? 'Ұлттық және әлемдік әдебиеттер маркетплейсі' : 'Маркетплейс национальной и мировой литературы'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-950 dark:text-white uppercase leading-[1.08]">
            {isKz ? 'Қазақстанның кітап кеңістігі' : 'Книжное пространство Казахстана'}
          </h1>

          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-xl leading-relaxed">
            {isKz
              ? 'Оригинал басылымдар, қазақ классикасы, әлемдік бестселлерлер және жетекші баспалардан тікелей жеткізу.'
              : 'Оригинальные издания, казахская классика, мировые бестселлеры и прямая доставка от официальных издательств.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 text-xs font-bold uppercase tracking-wider rounded transition-colors shadow-xs"
            >
              <span>{t('nav.catalog') || (isKz ? 'Каталогты қарау' : 'Перейти в каталог')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/catalog?genre=kazakh_classics"
              className="inline-flex items-center px-6 py-3 border border-zinc-300 hover:border-zinc-400 bg-white hover:bg-zinc-50 text-zinc-800 dark:border-zinc-800 dark:hover:border-zinc-600 dark:bg-zinc-900/60 dark:hover:bg-zinc-900 dark:text-zinc-300 dark:hover:text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors shadow-xs"
            >
              {isKz ? 'Қазақ классикасы' : 'Казахская классика'}
            </Link>
          </div>
        </div>
      </section>

      {/* Service Highlights */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 rounded space-y-2 shadow-xs">
          <BookOpen className="w-5 h-5 text-zinc-700 dark:text-zinc-300 stroke-1" />
          <h3 className="text-sm font-bold text-zinc-950 dark:text-white uppercase tracking-wide">
            {isKz ? 'Түпнұсқа басылымдар' : 'Прямые издания'}
          </h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-light">
            {isKz
              ? 'Атамұра, Фолиант, Mazmunda, Steppe & WORLD баспаларымен ресми келісімшарттар.'
              : 'Официальные договоры с издательствами Атамұра, Фолиант, Mazmunda, Альпина и МИФ.'}
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 rounded space-y-2 shadow-xs">
          <Truck className="w-5 h-5 text-zinc-700 dark:text-zinc-300 stroke-1" />
          <h3 className="text-sm font-bold text-zinc-950 dark:text-white uppercase tracking-wide">
            {isKz ? 'Қазақстан бойынша жеткізу' : 'Доставка по РК'}
          </h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-light">
            {isKz
              ? 'Алматы мен Астанада 1-2 күнде, өңірлердегі пошта бөлімшелеріне дейін жедел жеткізу.'
              : 'Быстрая курьерская доставка по Алматы и Астане за 1-2 дня, отправка во все регионы.'}
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 rounded space-y-2 shadow-xs">
          <ShieldCheck className="w-5 h-5 text-zinc-700 dark:text-zinc-300 stroke-1" />
          <h3 className="text-sm font-bold text-zinc-950 dark:text-white uppercase tracking-wide">
            {isKz ? 'Қауіпсіз төлем' : 'Удобная оплата'}
          </h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-light">
            {isKz
              ? 'Kaspi QR, кез келген банк карталары арқылы фискалды чекпен ресми есеп айырысу.'
              : 'Оплата картой, Kaspi QR и безналичный расчет с автоматической выдачей фискальных чеков.'}
          </p>
        </div>
      </section>

      {/* Bestsellers Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-zinc-950 dark:text-white tracking-tight">
              {isKz ? 'Айдың ең көп оқылған кітаптары' : 'Бестселлеры месяца'}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              {isKz ? 'Оқырмандар сұранысы мен рейтингі бойынша үздік басылымдар' : 'Лидеры продаж и читательских рейтингов'}
            </p>
          </div>

          <Link
            to="/catalog"
            className="text-xs font-semibold uppercase tracking-wider text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white inline-flex items-center gap-1.5 transition-colors"
          >
            <span>{isKz ? 'Барлығын көру' : 'Смотреть все'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="py-16 text-center text-xs text-zinc-500 font-mono">
            {t('common.loading') || 'Жүктелуде...'}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {bestsellers.map((book) => (
              <ProductCard key={book.id} product={book} />
            ))}
          </div>
        )}
      </section>

      {/* Kazakh Classics Section */}
      {classics.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-zinc-950 dark:text-white tracking-tight">
                {isKz ? 'Қазақ әдебиетінің інжу-маржандары' : 'Шедевры казахской литературы'}
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                {isKz ? 'Ұлттық классика, эпопеялар мен тарихи шығармалар' : 'Эпопеи, романы и исторические труды классиков'}
              </p>
            </div>

            <Link
              to="/catalog?genre=kazakh_classics"
              className="text-xs font-semibold uppercase tracking-wider text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white inline-flex items-center gap-1.5 transition-colors"
            >
              <span>{isKz ? 'Барлық классика' : 'Вся классика'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {classics.map((book) => (
              <ProductCard key={book.id} product={book} />
            ))}
          </div>
        </section>
      )}

      {/* Business & Growth Section */}
      {business.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-zinc-950 dark:text-white tracking-tight">
                {isKz ? 'Бизнес, қаржы және тұлғалық даму' : 'Бизнес, финансы и саморазвитие'}
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                {isKz ? 'Кәсіпкерлік пен психология саласындағы әлемдік бестселлерлер' : 'Книги по менеджменту, инвестициям и психологии мышления'}
              </p>
            </div>

            <Link
              to="/catalog?genre=business"
              className="text-xs font-semibold uppercase tracking-wider text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white inline-flex items-center gap-1.5 transition-colors"
            >
              <span>{isKz ? 'Барлығын көру' : 'Смотреть все'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {business.map((book) => (
              <ProductCard key={book.id} product={book} />
            ))}
          </div>
        </section>
      )}

      {/* Publishers Bar */}
      <section className="space-y-4 pt-6 border-t border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          {isKz ? 'Серіктес ресми баспалар' : 'Официальные издательства-партнеры'}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {[
            'Атамұра',
            'Фолиант',
            'Mazmunda',
            'Steppe & WORLD',
            'Альпина Паблишер',
            'Эксмо / АСТ',
          ].map((pub) => (
            <div
              key={pub}
              className="p-3 bg-white text-zinc-800 border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800/80 dark:text-zinc-300 border rounded text-center text-xs font-semibold shadow-xs"
            >
              {pub}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
