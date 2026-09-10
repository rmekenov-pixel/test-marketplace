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

  const bestsellers = books.filter((b) => b.isFeatured || b.rating >= 4.9).slice(0, 4);
  const classics = books.filter((b) => b.genre === 'kazakh_classics').slice(0, 4);
  const business = books.filter((b) => b.genre === 'business' || b.genre === 'psychology').slice(0, 4);

  return (
    <div className="space-y-16 text-left">
      {/* Hero Section */}
      <section className="border-b border-zinc-800 pb-12">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-400">
            <span>Ұлттық және әлемдік әдебиеттер маркетплейсі</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white uppercase leading-[1.08]">
            Қазақстанның кітап кеңістігі
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 max-w-xl leading-relaxed">
            Оригинал басылымдар, қазақ классикасы, әлемдік бестселлерлер және жетекші баспалардан тікелей жеткізу.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-bold uppercase tracking-wider rounded transition-colors"
            >
              <span>{t('nav.catalog') || 'Каталогты қарау'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/catalog?genre=kazakh_classics"
              className="inline-flex items-center px-6 py-3 border border-zinc-800 hover:border-zinc-600 bg-zinc-900/60 hover:bg-zinc-900 text-zinc-300 hover:text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors"
            >
              Қазақ классикасы
            </Link>
          </div>
        </div>
      </section>

      {/* Service Highlights */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-zinc-950 border border-zinc-800/80 rounded space-y-2">
          <BookOpen className="w-5 h-5 text-zinc-300 stroke-1" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wide">
            Түпнұсқа басылымдар
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed font-light">
            Атамұра, Фолиант, Mazmunda, Steppe & WORLD баспаларымен ресми келісімшарттар.
          </p>
        </div>

        <div className="p-6 bg-zinc-950 border border-zinc-800/80 rounded space-y-2">
          <Truck className="w-5 h-5 text-zinc-300 stroke-1" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wide">
            Қазақстан бойынша жеткізу
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed font-light">
            Алматы мен Астанада 1-2 күнде, өңірлердегі пошта бөлімшелеріне дейін жедел жеткізу.
          </p>
        </div>

        <div className="p-6 bg-zinc-950 border border-zinc-800/80 rounded space-y-2">
          <ShieldCheck className="w-5 h-5 text-zinc-300 stroke-1" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wide">
            Қауіпсіз төлем
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed font-light">
            Kaspi QR, кез келген банк карталары арқылы фискалды чекпен ресми есеп айырысу.
          </p>
        </div>
      </section>

      {/* Bestsellers Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Айдың ең көп оқылған кітаптары
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">Оқырмандар сұранысы мен рейтингі бойынша үздік басылымдар</p>
          </div>

          <Link
            to="/catalog"
            className="text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-white inline-flex items-center gap-1.5 transition-colors"
          >
            <span>Барлығын көру</span>
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
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Қазақ әдебиетінің інжу-маржандары
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">Ұлттық классика, эпопеялар мен тарихи шығармалар</p>
            </div>

            <Link
              to="/catalog?genre=kazakh_classics"
              className="text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-white inline-flex items-center gap-1.5 transition-colors"
            >
              <span>Барлық классика</span>
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
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Бизнес, қаржы және тұлғалық даму
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">Кәсіпкерлік пен психология саласындағы әлемдік бестселлерлер</p>
            </div>

            <Link
              to="/catalog?genre=business"
              className="text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-white inline-flex items-center gap-1.5 transition-colors"
            >
              <span>Барлығын көру</span>
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
      <section className="space-y-4 pt-6 border-t border-zinc-800">
        <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-500">
          Серіктес ресми баспалар
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
              className="p-3 bg-zinc-950 border border-zinc-800/80 rounded text-center text-xs font-semibold text-zinc-300"
            >
              {pub}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
