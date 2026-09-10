// src/test/marketplaceFlow.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { useBookStore } from '../entities/book/model/bookStore';
import { useCartStore, getPopulatedCart } from '../entities/cart/model/cartStore';
import { useAuthStore } from '../entities/user/model/authStore';
import { useSellerStore } from '../entities/seller/model/sellerStore';

describe('Marketplace End-to-End Integration Flow', () => {
  beforeEach(async () => {
    useCartStore.getState().clearCart();
    useAuthStore.getState().logout();
    await useBookStore.getState().resetToInitial();
  });

  it('1. Fetches books and filters by search query and genre', async () => {
    const bookStore = useBookStore.getState();
    await bookStore.fetchBooks();
    expect(bookStore.books.length).toBeGreaterThan(0);

    // Filter by genre
    useBookStore.getState().setFilters({ genre: 'kazakh_classics' });
    await useBookStore.getState().fetchBooks();
    const classics = useBookStore.getState().books;
    expect(classics.every((b) => b.genre === 'kazakh_classics')).toBe(true);

    // Filter by search query
    useBookStore.getState().setFilters({ genre: 'all', searchQuery: 'Абай' });
    await useBookStore.getState().fetchBooks();
    const abaiBooks = useBookStore.getState().books;
    expect(abaiBooks.length).toBeGreaterThan(0);
    expect(abaiBooks.some((b) => b.title.includes('Абай') || b.author.includes('Абай'))).toBe(true);
  });

  it('2. Adds items to cart, checks quantity limits and calculates total', async () => {
    await useBookStore.getState().resetToInitial();
    const books = useBookStore.getState().books;
    const targetBook = books[0];

    // Add to cart
    useCartStore.getState().addItem(targetBook.id, 2, targetBook.stock);
    expect(useCartStore.getState().items[0].quantity).toBe(2);

    // Try to exceed stock
    useCartStore.getState().addItem(targetBook.id, targetBook.stock + 5, targetBook.stock);
    expect(useCartStore.getState().items[0].quantity).toBe(targetBook.stock);

    // Calculate total populated cart
    const { populatedItems, totalPrice, totalCount } = getPopulatedCart(
      useCartStore.getState().items,
      books
    );
    expect(totalCount).toBe(targetBook.stock);
    expect(totalPrice).toBe(targetBook.price * targetBook.stock);
    expect(populatedItems[0].book.title).toBe(targetBook.title);
  });

  it('3. Handles RBAC authentication for client, seller, and admin roles', () => {
    // Client login
    useAuthStore.getState().login('client', { name: 'Арман', email: 'user@qazaqmarket.kz' });
    const clientState = useAuthStore.getState();
    expect(clientState.isAuthenticated).toBe(true);
    expect(clientState.role).toBe('client');
    expect(clientState.user?.email).toBe('user@qazaqmarket.kz');

    // Seller login
    useAuthStore.getState().login('seller', { name: 'Seller Store', email: 'seller@qazaqmarket.kz' });
    const sellerState = useAuthStore.getState();
    expect(sellerState.role).toBe('seller');

    // Admin login
    useAuthStore.getState().login('admin', { name: 'System Admin', email: 'admin@qazaqmarket.kz' });
    const adminState = useAuthStore.getState();
    expect(adminState.role).toBe('admin');
    expect(adminState.verifySession()).toBe(true);
  });

  it('4. Seller manages catalog items, sanitizes input, and tracks stock', () => {
    const sellerStore = useSellerStore.getState();
    const initialProductCount = sellerStore.products.length;

    // Add product as seller
    sellerStore.addProduct({
      title: '<script>test</script>Қара сөздер',
      author: 'Абай Құнанбаев',
      price: 4500,
      stock: 20,
      sku: 'KZ-ABAI-01',
      genre: 'kazakh_classics',
      coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c',
      status: 'active',
    });

    const updatedProducts = useSellerStore.getState().products;
    expect(updatedProducts.length).toBe(initialProductCount + 1);
    expect(updatedProducts[0].title).toBe('Қара сөздер'); // Sanitized

    // Update stock to 1 to trigger low stock alert
    sellerStore.updateProductStock(updatedProducts[0].id, 1);
    const lowStockProduct = useSellerStore.getState().products.find((p) => p.id === updatedProducts[0].id);
    expect(lowStockProduct?.stock).toBe(1);
    expect(useSellerStore.getState().metrics.lowStockCount).toBeGreaterThan(0);
  });
});
