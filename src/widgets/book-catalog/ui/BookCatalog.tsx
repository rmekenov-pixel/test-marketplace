import React, { useState } from 'react';
import type { Book } from '../../../entities/book';
import { BookCardBase, BookDetailModal } from '../../../entities/book';
import { AddToCartButton } from '../../../features/cart/add-to-cart';
import { EmptyState } from '../../../shared/ui/EmptyState';
import { BookOpen } from 'lucide-react';

export interface BookCatalogProps {
  books: Book[];
  isLoading?: boolean;
  onResetFilters?: () => void;
}

export const BookCatalog: React.FC<BookCatalogProps> = ({
  books,
  isLoading = false,
  onResetFilters,
}) => {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-[#161b22] border border-[#30363d] rounded-md p-3 h-72 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <EmptyState
        icon={<BookOpen className="w-6 h-6" />}
        title="Книги не найдены"
        description="Попробуйте изменить параметры поиска или сбросить фильтры"
        actionText={onResetFilters ? 'Сбросить фильтры' : undefined}
        onAction={onResetFilters}
      />
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {books.map((book) => (
          <BookCardBase
            key={book.id}
            book={book}
            onClick={() => setSelectedBook(book)}
            actionSlot={<AddToCartButton book={book} />}
          />
        ))}
      </div>

      <BookDetailModal
        book={selectedBook}
        isOpen={Boolean(selectedBook)}
        onClose={() => setSelectedBook(null)}
        actionSlot={
          selectedBook && (
            <AddToCartButton book={selectedBook} size="md" />
          )
        }
      />
    </>
  );
};
