import React from 'react';
import type { Book } from '../model/types';
import { Modal } from '../../../shared/ui/Modal';
import { formatKZT } from '../../../shared/lib/format';
import { APP_CONFIG } from '../../../shared/config/constants';

export interface BookDetailModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  actionSlot?: React.ReactNode;
}

export const BookDetailModal: React.FC<BookDetailModalProps> = ({
  book,
  isOpen,
  onClose,
  actionSlot,
}) => {
  if (!book) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Сведения об издании"
      maxWidth="lg"
    >
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <img
            src={book.coverImage || APP_CONFIG.DEFAULT_BOOK_COVER}
            alt={book.title}
            className="w-full sm:w-36 aspect-[3/4] object-cover rounded-md border border-[#30363d] shrink-0"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = APP_CONFIG.DEFAULT_BOOK_COVER;
            }}
          />
          <div className="space-y-1.5 flex-1">
            <span className="text-[11px] font-mono text-[#8d96a0] uppercase">
              {book.genre}
            </span>
            <h2 className="text-base font-semibold text-[#f0f6fc] leading-snug">
              {book.title}
            </h2>
            <p className="text-xs text-[#8d96a0]">{book.author}</p>

            <div className="pt-2">
              <span className="text-lg font-bold font-mono text-[#f0f6fc]">
                {formatKZT(book.price)}
              </span>
              {book.oldPrice && (
                <span className="text-xs text-[#6e7681] line-through ml-2 font-mono">
                  {formatKZT(book.oldPrice)}
                </span>
              )}
            </div>

            <div className="text-xs text-[#8d96a0]">
              На складе: <span className="font-mono text-[#f0f6fc]">{book.stock} шт.</span>
            </div>
          </div>
        </div>

        <div className="border-t border-[#30363d] pt-3 space-y-1">
          <h4 className="text-xs font-semibold text-[#f0f6fc]">Описание</h4>
          <p className="text-xs text-[#8d96a0] leading-relaxed">
            {book.description}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 bg-[#0d1117] border border-[#30363d] p-2.5 rounded-md text-xs">
          <div>
            <span className="text-[#8d96a0] block">Язык:</span>
            <span className="font-medium text-[#f0f6fc]">
              {book.language === 'kz' ? 'Қазақша' : 'Русский'}
            </span>
          </div>
          <div>
            <span className="text-[#8d96a0] block">Страниц:</span>
            <span className="font-mono text-[#f0f6fc]">{book.pages}</span>
          </div>
          <div>
            <span className="text-[#8d96a0] block">Год:</span>
            <span className="font-mono text-[#f0f6fc]">{book.publicationYear}</span>
          </div>
        </div>

        <div className="pt-2 flex justify-end gap-2">
          {actionSlot}
        </div>
      </div>
    </Modal>
  );
};
