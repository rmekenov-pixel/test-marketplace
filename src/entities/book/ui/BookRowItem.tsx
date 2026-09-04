import React from 'react';
import type { Book } from '../model/types';
import { formatKZT } from '../../../shared/lib/format';

export interface BookRowItemProps {
  book: Book;
  actionSlot?: React.ReactNode;
}

export const BookRowItem: React.FC<BookRowItemProps> = ({ book, actionSlot }) => {
  return (
    <tr className="hover:bg-[#1c2128]">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2.5">
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-8 aspect-[3/4] object-cover rounded border border-[#30363d] shrink-0"
          />
          <div>
            <div className="font-semibold text-[#f0f6fc]">{book.title}</div>
            <div className="text-[11px] text-[#8d96a0]">{book.author}</div>
          </div>
        </div>
      </td>

      <td className="px-4 py-3 text-[#8d96a0]">{book.genre}</td>

      <td className="px-4 py-3 font-mono font-semibold text-[#f0f6fc]">
        {formatKZT(book.price)}
      </td>

      <td className="px-4 py-3">
        <span className="font-mono border border-[#30363d] bg-[#0d1117] px-1.5 py-0.5 rounded text-[11px] text-[#f0f6fc]">
          {book.stock} шт.
        </span>
      </td>

      {actionSlot && <td className="px-4 py-3 text-right">{actionSlot}</td>}
    </tr>
  );
};
