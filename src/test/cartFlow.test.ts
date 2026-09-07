// src/test/cartFlow.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore, getPopulatedCart } from '../entities/cart/model/cartStore';
import type { Book } from '../entities/book/model/types';

const MOCK_BOOKS: Book[] = [
  {
    id: 'book-1',
    title: 'Абай жолы',
    author: 'Мұхтар Әуезов',
    price: 12500,
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c',
    description: 'Эпопея',
    genre: 'kazakh_classics',
    language: 'kz',
    stock: 10,
    rating: 5,
    reviewsCount: 100,
    publicationYear: 2021,
    pages: 1400,
    isbn: '978-601-04-1234-5',
  },
  {
    id: 'book-2',
    title: 'Көшпенділер',
    author: 'Ілияс Есенберлин',
    price: 9800,
    coverImage: 'https://images.unsplash.com/photo-1532012164546-f432f2e37b29',
    description: 'Трилогия',
    genre: 'history',
    language: 'kz',
    stock: 5,
    rating: 5,
    reviewsCount: 80,
    publicationYear: 2022,
    pages: 1100,
    isbn: '978-601-04-9012-3',
  },
];

describe('Cart Store & Normalized Flow', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  it('adds item to cart and normalizes reference ID', () => {
    useCartStore.getState().addItem('book-1', 2, 10);
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0]).toEqual({ bookId: 'book-1', quantity: 2 });
  });

  it('caps quantity at max stock', () => {
    const { addItem } = useCartStore.getState();
    addItem('book-2', 10, 5);

    const updated = useCartStore.getState().items;
    expect(updated[0].quantity).toBe(5);
  });

  it('correctly calculates total sum via getPopulatedCart selector', () => {
    const { addItem } = useCartStore.getState();
    addItem('book-1', 2, 10); // 12500 * 2 = 25000
    addItem('book-2', 1, 5);  // 9800 * 1 = 9800

    const { items } = useCartStore.getState();
    const { populatedItems, totalPrice, totalCount } = getPopulatedCart(items, MOCK_BOOKS);

    expect(totalCount).toBe(3);
    expect(totalPrice).toBe(34800);
    expect(populatedItems).toHaveLength(2);
  });

  it('removes item when quantity updated to 0', () => {
    const { addItem, updateQuantity } = useCartStore.getState();
    addItem('book-1', 2, 10);
    updateQuantity('book-1', 0);

    expect(useCartStore.getState().items).toHaveLength(0);
  });
});
