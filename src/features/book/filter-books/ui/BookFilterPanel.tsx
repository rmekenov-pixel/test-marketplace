import React from 'react';
import { BOOK_GENRES } from '../../../../shared/config/genres';
import type { BookLanguage, BookFilterParams } from '../../../../entities/book';

export interface BookFilterPanelProps {
  filters: BookFilterParams;
  onFilterChange: (updated: Partial<BookFilterParams>) => void;
  totalFound?: number;
}

export const BookFilterPanel: React.FC<BookFilterPanelProps> = ({
  filters,
  onFilterChange,
  totalFound,
}) => {
  const languages: { id: BookLanguage | 'all'; label: string }[] = [
    { id: 'all', label: 'Все языки' },
    { id: 'kz', label: 'Қазақша' },
    { id: 'ru', label: 'Русский' },
  ];

  const sortOptions = [
    { id: 'popular', label: 'По популярности' },
    { id: 'rating', label: 'По рейтингу' },
    { id: 'price_asc', label: 'Сначала дешевле' },
    { id: 'price_desc', label: 'Сначала дороже' },
    { id: 'newest', label: 'Сначала новые' },
  ];

  return (
    <div className="bg-[#161b22] rounded-md border border-[#30363d] p-3 shadow-gh space-y-3">
      {/* Genres Pills */}
      <div>
        <label className="block text-[11px] font-semibold text-[#8d96a0] uppercase tracking-wider mb-2">
          Категории
        </label>
        <div className="flex flex-wrap gap-1.5">
          {BOOK_GENRES.map((g) => {
            const isSelected = (filters.genre || 'all') === g.id;
            return (
              <button
                key={g.id}
                onClick={() => onFilterChange({ genre: g.id })}
                className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                  isSelected
                    ? 'bg-[#1f6feb] text-white border-[#388bfd]'
                    : 'bg-[#21262d] text-[#f0f6fc] border-[#30363d] hover:bg-[#30363d]'
                }`}
              >
                {g.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Language filter and Sorting */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#30363d]">
        <div>
          <label className="block text-[11px] font-semibold text-[#8d96a0] uppercase tracking-wider mb-1.5">
            Язык издания
          </label>
          <div className="flex rounded-md border border-[#30363d] bg-[#0d1117] p-0.5">
            {languages.map((l) => (
              <button
                key={l.id}
                onClick={() => onFilterChange({ language: l.id })}
                className={`flex-1 py-1 rounded text-xs font-medium transition-colors ${
                  (filters.language || 'all') === l.id
                    ? 'bg-[#21262d] text-[#f0f6fc] font-semibold shadow-sm'
                    : 'text-[#8d96a0] hover:text-[#f0f6fc]'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-[#8d96a0] uppercase tracking-wider mb-1.5">
            Сортировка
          </label>
          <select
            value={filters.sortBy || 'popular'}
            onChange={(e) =>
              onFilterChange({
                sortBy: e.target.value as BookFilterParams['sortBy'],
              })
            }
            className="w-full bg-[#0d1117] text-xs font-medium text-[#f0f6fc] rounded-md px-2.5 py-1.5 border border-[#30363d] focus:outline-none focus:border-[#2f81f7]"
          >
            {sortOptions.map((opt) => (
              <option key={opt.id} value={opt.id} className="bg-[#161b22] text-[#f0f6fc]">
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {totalFound !== undefined && (
        <div className="pt-1 text-xs text-[#8d96a0]">
          Найдено книг: <span className="font-semibold text-[#f0f6fc]">{totalFound}</span>
        </div>
      )}
    </div>
  );
};
