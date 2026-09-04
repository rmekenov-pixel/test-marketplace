import React, { useState } from 'react';
import { Plus, Edit2, Trash2, RotateCcw } from 'lucide-react';
import { useBookStore } from '../../../store/bookStore';
import type { Book, BookLanguage } from '../../../types';
import { GENRES } from '../../../data/books';
import { formatKZT } from '../../../utils/format';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';
import { SearchBar } from '../../../components/shared/SearchBar';

export const AdminCatalogPage: React.FC = () => {
  const { books, addBook, updateBook, deleteBook, resetToInitial } = useBookStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBookId, setEditingBookId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    price: 3500,
    oldPrice: 4200,
    coverImage: '',
    description: '',
    genre: 'fiction',
    language: 'kz' as BookLanguage,
    stock: 20,
    rating: 4.8,
    reviewsCount: 15,
    isFeatured: false,
    publicationYear: 2023,
    pages: 300,
    isbn: '978-601-00-0000-0',
  });

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
    setEditingBookId(null);
    setFormData({
      title: '',
      author: '',
      price: 3500,
      oldPrice: 0,
      coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
      description: '',
      genre: 'kazakh_classics',
      language: 'kz',
      stock: 20,
      rating: 5.0,
      reviewsCount: 1,
      isFeatured: false,
      publicationYear: 2023,
      pages: 280,
      isbn: '978-601-12-3456-7',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (book: Book) => {
    setEditingBookId(book.id);
    setFormData({
      title: book.title,
      author: book.author,
      price: book.price,
      oldPrice: book.oldPrice || 0,
      coverImage: book.coverImage,
      description: book.description,
      genre: book.genre,
      language: book.language,
      stock: book.stock,
      rating: book.rating,
      reviewsCount: book.reviewsCount,
      isFeatured: Boolean(book.isFeatured),
      publicationYear: book.publicationYear,
      pages: book.pages,
      isbn: book.isbn,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBookId) {
      updateBook(editingBookId, {
        ...formData,
        oldPrice: formData.oldPrice ? Number(formData.oldPrice) : undefined,
      });
    } else {
      addBook({
        ...formData,
        oldPrice: formData.oldPrice ? Number(formData.oldPrice) : undefined,
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#d0d7de]">
        <div>
          <h1 className="text-xl font-semibold text-[#1f2328]">
            Управление каталогом
          </h1>
          <p className="text-xs text-[#656d76]">
            Всего книг: <span className="font-mono text-[#1f2328]">{books.length}</span>
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
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="bg-[#f6f8fa] border border-[#d0d7de] rounded-md px-3 py-1.5 text-xs text-[#1f2328] focus:outline-none focus:bg-white"
        >
          {GENRES.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-md border border-[#d0d7de] shadow-gh-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f6f8fa] text-[#656d76] font-semibold border-b border-[#d0d7de]">
              <tr>
                <th className="px-4 py-2.5">Книга</th>
                <th className="px-4 py-2.5">Жанр</th>
                <th className="px-4 py-2.5">Цена</th>
                <th className="px-4 py-2.5">Остаток</th>
                <th className="px-4 py-2.5 text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d0d7de]">
              {filteredBooks.map((book) => (
                <tr key={book.id} className="hover:bg-[#f6f8fa]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-8 aspect-[3/4] object-cover rounded border border-[#d0d7de] filter grayscale shrink-0"
                      />
                      <div>
                        <div className="font-semibold text-[#1f2328]">
                          {book.title}
                        </div>
                        <div className="text-[11px] text-[#656d76]">
                          {book.author}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-[#656d76]">
                    {book.genre}
                  </td>

                  <td className="px-4 py-3 font-mono font-semibold text-[#1f2328]">
                    {formatKZT(book.price)}
                  </td>

                  <td className="px-4 py-3">
                    <span className="font-mono border border-[#d0d7de] bg-[#f6f8fa] px-1.5 py-0.5 rounded text-[11px]">
                      {book.stock} шт.
                    </span>
                  </td>

                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEditModal(book)}
                        className="p-1 text-[#656d76] hover:text-[#1f2328] hover:bg-[#ebf0f4] rounded"
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
                        className="p-1 text-[#656d76] hover:text-[#cf222e] hover:bg-[#ffebe9] rounded"
                        title="Удалить"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBookId ? 'Редактировать запись' : 'Новое издание'}
        maxWidth="md"
      >
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            label="Название"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <Input
            label="Автор"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Цена (₸)"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              required
            />
            <Input
              label="Остаток на складе"
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
              required
            />
          </div>

          <Input
            label="Ссылка на изображение"
            value={formData.coverImage}
            onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-[#1f2328] mb-1">
              Описание
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              className="w-full bg-[#f6f8fa] border border-[#d0d7de] rounded-md p-2 text-xs text-[#1f2328] focus:outline-none focus:bg-white focus:border-[#0969da]"
              required
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Отмена
            </Button>
            <Button type="submit" variant="primary">
              Сохранить
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
