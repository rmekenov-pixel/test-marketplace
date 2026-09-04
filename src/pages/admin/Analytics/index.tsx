import React from 'react';
import {
  TrendingUp,
  Award,
  Users,
  CreditCard,
  PieChart as PieChartIcon,
} from 'lucide-react';
import { useBookStore } from '../../../store/bookStore';
import { formatKZT } from '../../../utils/format';
import { GENRES } from '../../../data/books';

export const AdminAnalyticsPage: React.FC = () => {
  const books = useBookStore((state) => state.books);

  const topBooks = [...books]
    .sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0))
    .slice(0, 5);

  const genreStats = GENRES.filter((g) => g.id !== 'all').map((genre) => {
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
      <div className="pb-3 border-b border-[#d0d7de]">
        <h1 className="text-xl font-semibold text-[#1f2328]">
          Аналитика
        </h1>
        <p className="text-xs text-[#656d76]">
          Показатели активности и распределение каталога
        </p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-md border border-[#d0d7de] shadow-gh-sm space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#656d76]">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Средний чек (AOV)</span>
          </div>
          <div className="text-xl font-mono font-bold text-[#1f2328]">
            {formatKZT(14800)}
          </div>
          <p className="text-[11px] text-[#656d76]">
            2.4 книги в чеке
          </p>
        </div>

        <div className="bg-white p-4 rounded-md border border-[#d0d7de] shadow-gh-sm space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#656d76]">
            <Users className="w-3.5 h-3.5" />
            <span>Покупатели</span>
          </div>
          <div className="text-xl font-mono font-bold text-[#1f2328]">
            840
          </div>
          <p className="text-[11px] text-[#656d76]">
            Повторные покупки: 42%
          </p>
        </div>

        <div className="bg-white p-4 rounded-md border border-[#d0d7de] shadow-gh-sm space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#656d76]">
            <CreditCard className="w-3.5 h-3.5" />
            <span>Kaspi QR</span>
          </div>
          <div className="text-xl font-mono font-bold text-[#1f2328]">
            78.5%
          </div>
          <p className="text-[11px] text-[#656d76]">
            Кошелек: 21.5%
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Genre Breakdown */}
        <div className="bg-white rounded-md border border-[#d0d7de] p-4 shadow-gh-sm space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-[#d0d7de]">
            <PieChartIcon className="w-4 h-4 text-[#656d76]" />
            <h3 className="font-semibold text-xs text-[#1f2328]">
              Каталог по жанрам
            </h3>
          </div>

          <div className="space-y-2.5 pt-1">
            {genreStats.map((item) => (
              <div key={item.name} className="space-y-1">
                <div className="flex justify-between text-xs text-[#1f2328]">
                  <span>{item.name}</span>
                  <span className="text-[#656d76] font-mono">
                    {item.count} ({item.share}%)
                  </span>
                </div>
                <div className="w-full bg-[#f6f8fa] border border-[#d0d7de] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#1f2328] h-full"
                    style={{ width: `${Math.max(5, item.share)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top 5 */}
        <div className="bg-white rounded-md border border-[#d0d7de] p-4 shadow-gh-sm space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-[#d0d7de]">
            <Award className="w-4 h-4 text-[#656d76]" />
            <h3 className="font-semibold text-xs text-[#1f2328]">
              Популярные книги
            </h3>
          </div>

          <div className="divide-y divide-[#d0d7de]">
            {topBooks.map((book, idx) => (
              <div
                key={book.id}
                className="py-2 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-[#656d76]">
                    #{idx + 1}
                  </span>
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-7 aspect-[3/4] object-cover rounded border border-[#d0d7de] filter grayscale shrink-0"
                  />
                  <div>
                    <div className="font-medium text-[#1f2328] truncate max-w-xs">
                      {book.title}
                    </div>
                    <div className="text-[11px] text-[#656d76]">{book.author}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono font-semibold text-[#1f2328]">
                    {formatKZT(book.price)}
                  </div>
                  <span className="text-[11px] text-[#656d76]">
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
