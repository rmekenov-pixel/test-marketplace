import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, RotateCcw } from 'lucide-react';
import type { Book } from '../../../entities/book';
import { useBookStore, BookRowItem } from '../../../entities/book';
import { BookFormModal } from '../../../features/book/manage-book';
import { BookSearchInput } from '../../../features/book/search-books';
import { Button } from '../../../shared/ui/Button';
import { BOOK_GENRES } from '../../../shared/config/genres';

export const AdminCatalogPage: React.FC = () => {
  const { books, fetchBooks, deleteBook, resetToInitial } = useBookStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const filteredBooks = books.filter((b) => {
    if (selectedGenre !== 'all' && b.genre !== selectedGenre) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.isbn.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenAddModal = () => {
    setEditingBook(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (book: Book) => {
    setEditingBook(book);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#30363d]">
        <div>
          <h1 className="text-xl font-semibold text-[#f0f6fc]">
            Управление каталогом
          </h1>
          <p className="text-xs text-[#8d96a0]">
            Всего книг: <span className="font-mono text-[#f0f6fc]">{books.length}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={resetToInitial}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Сбросить
          </Button>
          <Button
            variant="primary"
            onClick={handleOpenAddModal}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Добавить
          </Button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <BookSearchInput value={searchQuery} onChange={setSearchQuery} />
        </div>
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-1.5 text-xs text-[#f0f6fc] focus:outline-none focus:border-[#2f81f7]"
        >
          {BOOK_GENRES.map((g) => (
            <option key={g.id} value={g.id} className="bg-[#161b22] text-[#f0f6fc]">
              {g.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#161b22] rounded-md border border-[#30363d] shadow-gh overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0d1117] text-[#8d96a0] font-semibold border-b border-[#30363d]">
              <tr>
                <th className="px-4 py-2.5">Книга</th>
                <th className="px-4 py-2.5">Жанр</th>
                <th className="px-4 py-2.5">Цена</th>
                <th className="px-4 py-2.5">Остаток</th>
                <th className="px-4 py-2.5 text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#30363d]">
              {filteredBooks.map((book) => (
                <BookRowItem
                  key={book.id}
                  book={book}
                  actionSlot={
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEditModal(book)}
                        className="p-1 text-[#8d96a0] hover:text-[#f0f6fc] hover:bg-[#21262d] rounded"
                        title="Редактировать"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Удалить книгу "${book.title}"?`)) {
                            deleteBook(book.id);
                          }
                        }}
                        className="p-1 text-[#8d96a0] hover:text-[#f85149] hover:bg-[#da3633]/20 rounded"
                        title="Удалить"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  }
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Book Form Modal */}
      <BookFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingBook={editingBook}
      />
    </div>
  );
};
