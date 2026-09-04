import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Zap, Shield, Bookmark } from 'lucide-react';
import { useBookStore } from '../../../entities/book';
import { BookCatalog } from '../../../widgets/book-catalog';
import { Button } from '../../../shared/ui/Button';
import { ROUTES } from '../../../shared/config/routes';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const books = useBookStore((state) => state.books);
  const fetchBooks = useBookStore((state) => state.fetchBooks);
  const isLoading = useBookStore((state) => state.isLoading);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const featuredBooks = books.filter((b) => b.isFeatured).slice(0, 4);
  const bestsellers = books.slice(0, 8);

  return (
    <div className="space-y-12 pb-12">
      {/* GitHub Dark Minimalist Hero Section */}
      <section className="bg-[#0d1117] border-b border-[#30363d] pb-10 pt-4">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-1.5 border border-[#30363d] bg-[#161b22] px-2.5 py-1 rounded-full text-xs text-[#8d96a0]">
            <span className="w-2 h-2 rounded-full bg-[#238636]" />
            <span>Книжный маркетплейс Казахстана • Доставка по всей стране</span>
          </div>

          <h1 className="text-[32px] sm:text-[36px] leading-tight font-semibold text-[#f0f6fc] tracking-tight">
            Оригинальные книги с быстрой доставкой через Kitap All
          </h1>

          <p className="text-[16px] text-[#8d96a0] leading-relaxed max-w-xl">
            Каталог казахской литературы, мировые бестселлеры, бизнес-издания и детские книги. Оплата через Kaspi Pay и единый баланс.
          </p>

          <div className="flex items-center gap-3 pt-2">
            <Button
              size="lg"
              variant="primary"
              onClick={() => navigate(ROUTES.CLIENT.CATALOG)}
            >
              Перейти в каталог
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate(ROUTES.LOGIN)}
            >
              Личный кабинет
            </Button>
          </div>
        </div>
      </section>

      {/* Category Chips */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div
          onClick={() => navigate(ROUTES.CLIENT.CATALOG)}
          className="bg-[#161b22] p-3.5 rounded-md border border-[#30363d] hover:bg-[#21262d] hover:border-[#8b949e] cursor-pointer shadow-gh flex items-start gap-3 transition-colors"
        >
          <Bookmark className="w-4 h-4 text-[#8d96a0] stroke-[1.5] mt-0.5 shrink-0" />
          <div>
            <div className="text-[14px] font-semibold text-[#f0f6fc]">Бестселлеры</div>
            <div className="text-[12px] text-[#8d96a0]">Топ продаж года</div>
          </div>
        </div>

        <div
          onClick={() => navigate(ROUTES.CLIENT.CATALOG)}
          className="bg-[#161b22] p-3.5 rounded-md border border-[#30363d] hover:bg-[#21262d] hover:border-[#8b949e] cursor-pointer shadow-gh flex items-start gap-3 transition-colors"
        >
          <BookOpen className="w-4 h-4 text-[#8d96a0] stroke-[1.5] mt-0.5 shrink-0" />
          <div>
            <div className="text-[14px] font-semibold text-[#f0f6fc]">Қазақ әдебиеті</div>
            <div className="text-[12px] text-[#8d96a0]">Классикалық шығармалар</div>
          </div>
        </div>

        <div
          onClick={() => navigate(ROUTES.CLIENT.CATALOG)}
          className="bg-[#161b22] p-3.5 rounded-md border border-[#30363d] hover:bg-[#21262d] hover:border-[#8b949e] cursor-pointer shadow-gh flex items-start gap-3 transition-colors"
        >
          <Zap className="w-4 h-4 text-[#8d96a0] stroke-[1.5] mt-0.5 shrink-0" />
          <div>
            <div className="text-[14px] font-semibold text-[#f0f6fc]">Бизнес и навыки</div>
            <div className="text-[12px] text-[#8d96a0]">Развитие и финансы</div>
          </div>
        </div>

        <div
          onClick={() => navigate(ROUTES.CLIENT.CATALOG)}
          className="bg-[#161b22] p-3.5 rounded-md border border-[#30363d] hover:bg-[#21262d] hover:border-[#8b949e] cursor-pointer shadow-gh flex items-start gap-3 transition-colors"
        >
          <Shield className="w-4 h-4 text-[#8d96a0] stroke-[1.5] mt-0.5 shrink-0" />
          <div>
            <div className="text-[14px] font-semibold text-[#f0f6fc]">Kaspi Доставка</div>
            <div className="text-[12px] text-[#8d96a0]">Курьер и постаматы</div>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#30363d]">
          <h2 className="text-[20px] font-semibold text-[#f0f6fc]">
            Рекомендуемые издания
          </h2>
          <Link
            to={ROUTES.CLIENT.CATALOG}
            className="text-[14px] text-[#58a6ff] hover:underline flex items-center gap-1"
          >
            Смотреть все →
          </Link>
        </div>

        <BookCatalog books={featuredBooks} isLoading={isLoading} />
      </section>

      {/* Bestsellers Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#30363d]">
          <h2 className="text-[20px] font-semibold text-[#f0f6fc]">
            Каталог книг
          </h2>
          <Link
            to={ROUTES.CLIENT.CATALOG}
            className="text-[14px] text-[#58a6ff] hover:underline flex items-center gap-1"
          >
            Смотреть все →
          </Link>
        </div>

        <BookCatalog books={bestsellers} isLoading={isLoading} />
      </section>
    </div>
  );
};
