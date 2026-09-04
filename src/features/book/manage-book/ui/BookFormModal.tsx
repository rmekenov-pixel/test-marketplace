import React, { useState, useEffect } from 'react';
import type { Book, CreateBookDto, BookLanguage } from '../../../../entities/book';
import { useBookStore } from '../../../../entities/book';
import { Modal } from '../../../../shared/ui/Modal';
import { Input } from '../../../../shared/ui/Input';
import { Button } from '../../../../shared/ui/Button';

export interface BookFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingBook?: Book | null;
}

export const BookFormModal: React.FC<BookFormModalProps> = ({
  isOpen,
  onClose,
  editingBook,
}) => {
  const addBook = useBookStore((state) => state.addBook);
  const updateBook = useBookStore((state) => state.updateBook);

  const [formData, setFormData] = useState<CreateBookDto>({
    title: '',
    author: '',
    price: 3500,
    oldPrice: 4200,
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    description: '',
    genre: 'kazakh_classics',
    language: 'kz' as BookLanguage,
    stock: 20,
    rating: 5.0,
    reviewsCount: 1,
    isFeatured: false,
    publicationYear: 2023,
    pages: 280,
    isbn: '978-601-12-3456-7',
  });

  useEffect(() => {
    if (editingBook) {
      setFormData({
        title: editingBook.title,
        author: editingBook.author,
        price: editingBook.price,
        oldPrice: editingBook.oldPrice || 0,
        coverImage: editingBook.coverImage,
        description: editingBook.description,
        genre: editingBook.genre,
        language: editingBook.language,
        stock: editingBook.stock,
        rating: editingBook.rating,
        reviewsCount: editingBook.reviewsCount,
        isFeatured: Boolean(editingBook.isFeatured),
        publicationYear: editingBook.publicationYear,
        pages: editingBook.pages,
        isbn: editingBook.isbn,
      });
    } else {
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
    }
  }, [editingBook, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBook) {
      await updateBook(editingBook.id, {
        ...formData,
        oldPrice: formData.oldPrice ? Number(formData.oldPrice) : undefined,
      });
    } else {
      await addBook({
        ...formData,
        oldPrice: formData.oldPrice ? Number(formData.oldPrice) : undefined,
      });
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingBook ? 'Редактировать запись' : 'Новое издание'}
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
            onChange={(e) =>
              setFormData({ ...formData, price: Number(e.target.value) })
            }
            required
          />
          <Input
            label="Остаток на складе"
            type="number"
            value={formData.stock}
            onChange={(e) =>
              setFormData({ ...formData, stock: Number(e.target.value) })
            }
            required
          />
        </div>

        <Input
          label="Ссылка на изображение"
          value={formData.coverImage}
          onChange={(e) =>
            setFormData({ ...formData, coverImage: e.target.value })
          }
          required
        />

        <div>
          <label className="block text-xs font-semibold text-[#f0f6fc] mb-1">
            Описание
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={2}
            className="w-full bg-[#0d1117] border border-[#30363d] rounded-md p-2 text-xs text-[#f0f6fc] focus:outline-none focus:border-[#2f81f7]"
            required
          />
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Отмена
          </Button>
          <Button type="submit" variant="primary">
            Сохранить
          </Button>
        </div>
      </form>
    </Modal>
  );
};
