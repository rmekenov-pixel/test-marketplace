import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookStore } from '../../../store/bookStore';
import { useCartStore } from '../../../store/cartStore';
import { BookCard } from '../../../components/shared/BookCard';
import { SearchBar } from '../../../components/shared/SearchBar';
import { FilterPanel } from '../../../components/shared/FilterPanel';
import { EmptyState } from '../../../components/shared/EmptyState';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import type { Book, FilterOptions } from '../../../types';
import { formatKZT } from '../../../utils/format';
import { BookOpen } from 'lucide-react';

export const ClientCatalogPage: React.FC = () => {
  const navigate = useNavigate();
  const books = useBookStore((state) => state.books);
  const addItem = useCartStore((state) => state.addItem);

  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    genre: 'all',
    language: 'all',
    sortBy: 'popular',
  });
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const handleFilterChange = (updated: Partial<FilterOptions>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const filteredBooks = useMemo(() => {
    return books
      .filter((book) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = book.title.toLowerCase().includes(q);
          const matchAuthor = book.author.toLowerCase().includes(q);
          const matchIsbn = book.isbn.toLowerCase().includes(q);
          if (!matchTitle && !matchAuthor && !matchIsbn) return false;
        }

        if (filters.genre && filters.genre !== 'all' && book.genre !== filters.genre) {
          return false;
        }

        if (filters.language && filters.language !== 'all' && book.language !== filters.language) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'price_asc') return a.price - b.price;
        if (filters.sortBy === 'price_desc') return b.price - a.price;
        if (filters.sortBy === 'rating') return b.rating - a.rating;
        if (filters.sortBy === 'newest') return b.publicationYear - a.publicationYear;
        return (b.reviewsCount || 0) - (a.reviewsCount || 0);
      });
  }, [books, searchQuery, filters]);

  return (
    <div className="space-y-6">
      {/* Title & Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-[#d0d7de]">
        <div>
          <h1 className="text-xl font-semibold text-[#1f2328]">
            Каталог книг
          </h1>
          <p className="text-xs text-[#656d76]">
            Все издания в наличии на складе
          </p>
        </div>
        <div className="w-full sm:w-72">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
      </div>

      {/* Filter Component */}
      <FilterPanel
        filters={filters}
        onFilterChange={handleFilterChange}
        totalFound={filteredBooks.length}
      />

      {/* Books Grid */}
      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onQuickView={(b) => setSelectedBook(b)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<BookOpen className="w-6 h-6" />}
          title="Книги не найдены"
          description="Попробуйте изменить параметры поиска или выбрать другую категорию"
          actionText="Сбросить фильтры"
          onAction={() => {
            setSearchQuery('');
            setFilters({ genre: 'all', language: 'all', sortBy: 'popular' });
          }}
        />
      )}

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
                className="w-full sm:w-36 aspect-[3/4] object-cover rounded-md border border-[#d0d7de] filter grayscale contrast-[1.05] shrink-0"
              />
              <div className="space-y-1.5 flex-1">
                <span className="text-[11px] font-mono text-[#656d76] uppercase">
                  {selectedBook.genre}
                </span>
                <h2 className="text-base font-semibold text-[#1f2328] leading-snug">
                  {selectedBook.title}
                </h2>
                <p className="text-xs text-[#656d76]">{selectedBook.author}</p>

                <div className="pt-2">
                  <span className="text-lg font-bold text-[#1f2328]">
                    {formatKZT(selectedBook.price)}
                  </span>
                  {selectedBook.oldPrice && (
                    <span className="text-xs text-[#9198a1] line-through ml-2">
                      {formatKZT(selectedBook.oldPrice)}
                    </span>
                  )}
                </div>

                <div className="text-xs text-[#656d76]">
                  На складе: <span className="font-mono text-[#1f2328]">{selectedBook.stock} шт.</span>
                </div>
              </div>
            </div>

            <div className="border-t border-[#d0d7de] pt-3 space-y-1">
              <h4 className="text-xs font-semibold text-[#1f2328]">Описание</h4>
              <p className="text-xs text-[#656d76] leading-relaxed">
                {selectedBook.description}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 bg-[#f6f8fa] border border-[#d0d7de] p-2.5 rounded-md text-xs">
              <div>
                <span className="text-[#656d76] block">Язык:</span>
                <span className="font-medium text-[#1f2328]">{selectedBook.language === 'kz' ? 'Қазақша' : 'Русский'}</span>
              </div>
              <div>
                <span className="text-[#656d76] block">Страниц:</span>
                <span className="font-mono text-[#1f2328]">{selectedBook.pages}</span>
              </div>
              <div>
                <span className="text-[#656d76] block">Год:</span>
                <span className="font-mono text-[#1f2328]">{selectedBook.publicationYear}</span>
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
