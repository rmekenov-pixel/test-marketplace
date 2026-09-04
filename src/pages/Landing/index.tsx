import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Zap, Shield, Bookmark } from 'lucide-react';
import { useBookStore } from '../../store/bookStore';
import { BookCard } from '../../components/shared/BookCard';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import type { Book } from '../../types';
import { formatKZT } from '../../utils/format';
import { useCartStore } from '../../store/cartStore';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const books = useBookStore((state) => state.books);
  const addItem = useCartStore((state) => state.addItem);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

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
              onClick={() => navigate('/client/catalog')}
            >
              Перейти в каталог
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate('/login')}
            >
              Личный кабинет
            </Button>
          </div>
        </div>
      </section>

      {/* Category Chips */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div
          onClick={() => navigate('/client/catalog')}
          className="bg-[#161b22] p-3.5 rounded-md border border-[#30363d] hover:bg-[#21262d] hover:border-[#8b949e] cursor-pointer shadow-gh flex items-start gap-3 transition-colors"
        >
          <Bookmark className="w-4 h-4 text-[#8d96a0] stroke-[1.5] mt-0.5 shrink-0" />
          <div>
            <div className="text-[14px] font-semibold text-[#f0f6fc]">Бестселлеры</div>
            <div className="text-[12px] text-[#8d96a0]">Топ продаж года</div>
          </div>
        </div>

        <div
          onClick={() => navigate('/client/catalog')}
          className="bg-[#161b22] p-3.5 rounded-md border border-[#30363d] hover:bg-[#21262d] hover:border-[#8b949e] cursor-pointer shadow-gh flex items-start gap-3 transition-colors"
        >
          <BookOpen className="w-4 h-4 text-[#8d96a0] stroke-[1.5] mt-0.5 shrink-0" />
          <div>
            <div className="text-[14px] font-semibold text-[#f0f6fc]">Қазақ әдебиеті</div>
            <div className="text-[12px] text-[#8d96a0]">Классикалық шығармалар</div>
          </div>
        </div>

        <div
          onClick={() => navigate('/client/catalog')}
          className="bg-[#161b22] p-3.5 rounded-md border border-[#30363d] hover:bg-[#21262d] hover:border-[#8b949e] cursor-pointer shadow-gh flex items-start gap-3 transition-colors"
        >
          <Zap className="w-4 h-4 text-[#8d96a0] stroke-[1.5] mt-0.5 shrink-0" />
          <div>
            <div className="text-[14px] font-semibold text-[#f0f6fc]">Бизнес и навыки</div>
            <div className="text-[12px] text-[#8d96a0]">Развитие и финансы</div>
          </div>
        </div>

        <div
          onClick={() => navigate('/client/catalog')}
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
            to="/client/catalog"
            className="text-[14px] text-[#58a6ff] hover:underline flex items-center gap-1"
          >
            Смотреть все →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featuredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onQuickView={(b) => setSelectedBook(b)}
            />
          ))}
        </div>
      </section>

      {/* Bestsellers Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#30363d]">
          <h2 className="text-[20px] font-semibold text-[#f0f6fc]">
            Каталог книг
          </h2>
          <Link
            to="/client/catalog"
            className="text-[14px] text-[#58a6ff] hover:underline flex items-center gap-1"
          >
            Смотреть все →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {bestsellers.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onQuickView={(b) => setSelectedBook(b)}
            />
          ))}
        </div>
      </section>

      {/* Quick View Modal */}
      <Modal
        isOpen={Boolean(selectedBook)}
        onClose={() => setSelectedBook(null)}
        title="Сведения об издании"
        maxWidth="lg"
      >
        {selectedBook && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <img
                src={selectedBook.coverImage}
                alt={selectedBook.title}
                className="w-full sm:w-36 aspect-[3/4] object-cover rounded-md border border-[#30363d] shrink-0"
              />
              <div className="space-y-1.5 flex-1">
                <span className="text-[11px] font-mono text-[#8d96a0] uppercase">
                  {selectedBook.genre}
                </span>
                <h2 className="text-base font-semibold text-[#f0f6fc] leading-snug">
                  {selectedBook.title}
                </h2>
                <p className="text-xs text-[#8d96a0]">{selectedBook.author}</p>

                <div className="pt-2">
                  <span className="text-lg font-bold font-mono text-[#f0f6fc]">
                    {formatKZT(selectedBook.price)}
                  </span>
                  {selectedBook.oldPrice && (
                    <span className="text-xs text-[#6e7681] line-through ml-2 font-mono">
                      {formatKZT(selectedBook.oldPrice)}
                    </span>
                  )}
                </div>

                <div className="text-xs text-[#8d96a0]">
                  На складе: <span className="font-mono text-[#f0f6fc]">{selectedBook.stock} шт.</span>
                </div>
              </div>
            </div>

            <div className="border-t border-[#30363d] pt-3 space-y-1">
              <h4 className="text-xs font-semibold text-[#f0f6fc]">Описание</h4>
              <p className="text-xs text-[#8d96a0] leading-relaxed">
                {selectedBook.description}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 bg-[#0d1117] border border-[#30363d] p-2.5 rounded-md text-xs">
              <div>
                <span className="text-[#8d96a0] block">Язык:</span>
                <span className="font-medium text-[#f0f6fc]">{selectedBook.language === 'kz' ? 'Қазақша' : 'Русский'}</span>
              </div>
              <div>
                <span className="text-[#8d96a0] block">Страниц:</span>
                <span className="font-mono text-[#f0f6fc]">{selectedBook.pages}</span>
              </div>
              <div>
                <span className="text-[#8d96a0] block">Год:</span>
                <span className="font-mono text-[#f0f6fc]">{selectedBook.publicationYear}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => setSelectedBook(null)}
              >
                Закрыть
              </Button>
              <Button
                variant="primary"
                disabled={selectedBook.stock <= 0}
                onClick={() => {
                  addItem(selectedBook, 1);
                  setSelectedBook(null);
                  navigate('/client/cart');
                }}
              >
                {selectedBook.stock > 0 ? 'Добавить в корзину' : 'Нет в наличии'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
