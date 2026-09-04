import React, { useEffect } from 'react';
import {
  TrendingUp,
  Award,
  Users,
  CreditCard,
  PieChart as PieChartIcon,
} from 'lucide-react';
import { useBookStore } from '../../../entities/book';
import { BOOK_GENRES } from '../../../shared/config/genres';
import { formatKZT } from '../../../shared/lib/format';

export const AdminAnalyticsPage: React.FC = () => {
  const books = useBookStore((state) => state.books);
  const fetchBooks = useBookStore((state) => state.fetchBooks);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const topBooks = [...books]
    .sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0))
    .slice(0, 5);

  const genreStats = BOOK_GENRES.filter((g) => g.id !== 'all').map((genre) => {
    const booksInGenre = books.filter((b) => b.genre === genre.id);
    const count = booksInGenre.length;
    const share = Math.round((count / (books.length || 1)) * 100);
    return {
      name: genre.name,
      count,
      share,
    };
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="pb-3 border-b border-[#30363d]">
        <h1 className="text-xl font-semibold text-[#f0f6fc]">
          Аналитика
        </h1>
        <p className="text-xs text-[#8d96a0]">
          Показатели активности и распределение каталога
        </p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-[#161b22] p-4 rounded-md border border-[#30363d] shadow-gh space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#8d96a0]">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Средний чек (AOV)</span>
          </div>
          <div className="text-xl font-mono font-bold text-[#f0f6fc]">
            {formatKZT(14800)}
          </div>
          <p className="text-[11px] text-[#8d96a0]">
            2.4 книги в чеке
          </p>
        </div>

        <div className="bg-[#161b22] p-4 rounded-md border border-[#30363d] shadow-gh space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#8d96a0]">
            <Users className="w-3.5 h-3.5" />
            <span>Покупатели</span>
          </div>
          <div className="text-xl font-mono font-bold text-[#f0f6fc]">
            840
          </div>
          <p className="text-[11px] text-[#8d96a0]">
            Повторные покупки: 42%
          </p>
        </div>

        <div className="bg-[#161b22] p-4 rounded-md border border-[#30363d] shadow-gh space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#8d96a0]">
            <CreditCard className="w-3.5 h-3.5" />
            <span>Kaspi QR</span>
          </div>
          <div className="text-xl font-mono font-bold text-[#f0f6fc]">
            78.5%
          </div>
          <p className="text-[11px] text-[#8d96a0]">
            Кошелек: 21.5%
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Genre Breakdown */}
        <div className="bg-[#161b22] rounded-md border border-[#30363d] p-4 shadow-gh space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-[#30363d]">
            <PieChartIcon className="w-4 h-4 text-[#8d96a0]" />
            <h3 className="font-semibold text-xs text-[#f0f6fc]">
              Каталог по жанрам
            </h3>
          </div>

          <div className="space-y-2.5 pt-1">
            {genreStats.map((item) => (
              <div key={item.name} className="space-y-1">
                <div className="flex justify-between text-xs text-[#f0f6fc]">
                  <span>{item.name}</span>
                  <span className="text-[#8d96a0] font-mono">
                    {item.count} ({item.share}%)
                  </span>
                </div>
                <div className="w-full bg-[#0d1117] border border-[#30363d] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#1f6feb] h-full"
                    style={{ width: `${Math.max(5, item.share)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top 5 */}
        <div className="bg-[#161b22] rounded-md border border-[#30363d] p-4 shadow-gh space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-[#30363d]">
            <Award className="w-4 h-4 text-[#8d96a0]" />
            <h3 className="font-semibold text-xs text-[#f0f6fc]">
              Популярные книги
            </h3>
          </div>

          <div className="divide-y divide-[#30363d]">
            {topBooks.map((book, idx) => (
              <div
                key={book.id}
                className="py-2 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-[#8d96a0]">
                    #{idx + 1}
                  </span>
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-7 aspect-[3/4] object-cover rounded border border-[#30363d] shrink-0"
                  />
                  <div>
                    <div className="font-medium text-[#f0f6fc] truncate max-w-xs">
                      {book.title}
                    </div>
                    <div className="text-[11px] text-[#8d96a0]">{book.author}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono font-semibold text-[#f0f6fc]">
                    {formatKZT(book.price)}
                  </div>
                  <span className="text-[11px] text-[#8d96a0]">
                    ★ {book.rating} ({book.reviewsCount})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
