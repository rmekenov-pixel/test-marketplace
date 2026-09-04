import React from 'react';
import type { Book } from '../model/types';
import { formatKZT } from '../../../shared/lib/format';

export interface BookCardBaseProps {
  book: Book;
  onClick?: () => void;
  actionSlot?: React.ReactNode;
}

export const BookCardBase: React.FC<BookCardBaseProps> = ({
  book,
  onClick,
  actionSlot,
}) => {
  const isOutOfStock = book.stock <= 0;

  return (
    <div
      onClick={onClick}
      className="group bg-[#161b22] rounded-md border border-[#30363d] p-3 shadow-gh hover:border-[#8b949e] flex flex-col justify-between cursor-pointer"
    >
      <div>
        {/* Cover image (Full natural color) */}
        <div className="relative aspect-[3/4] w-full bg-[#0d1117] border border-[#30363d] rounded-md overflow-hidden mb-3">
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-150"
            loading="lazy"
          />

          {book.language === 'kz' && (
            <span className="absolute top-1.5 left-1.5 border border-[#30363d] bg-[#161b22]/90 backdrop-blur-sm text-[#f0f6fc] text-[10px] font-mono px-1.5 py-0.2 rounded">
              KZ
            </span>
          )}

          {isOutOfStock && (
            <div className="absolute inset-0 bg-[#0d1117]/80 flex items-center justify-center">
              <span className="text-xs font-medium text-[#8d96a0] border border-[#30363d] bg-[#161b22] px-2 py-0.5 rounded">
                Нет в наличии
              </span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-[#f0f6fc] line-clamp-2 leading-snug group-hover:text-[#58a6ff]">
            {book.title}
          </h3>
          <p className="text-xs text-[#8d96a0] truncate">{book.author}</p>
        </div>
      </div>

      {/* Price & Action */}
      <div className="pt-3 mt-3 border-t border-[#30363d] flex items-center justify-between gap-2">
        <div>
          <div className="text-sm font-bold font-mono text-[#f0f6fc]">
            {formatKZT(book.price)}
          </div>
          {book.oldPrice && (
            <div className="text-[11px] text-[#6e7681] line-through font-mono">
              {formatKZT(book.oldPrice)}
            </div>
          )}
        </div>

        {actionSlot}
      </div>
    </div>
  );
};
