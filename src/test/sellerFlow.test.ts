// src/test/sellerFlow.test.ts
import { describe, it, expect } from 'vitest';
import { useSellerStore } from '../entities/seller/model/sellerStore';

describe('Seller Space & Inventory Flow', () => {
  it('adds a new product and recalculates metrics', () => {
    const initialCount = useSellerStore.getState().products.length;

    useSellerStore.getState().addProduct({
      title: '<script>alert(1)</script>Жаңа кітап',
      author: 'Жазушы',
      price: 6500,
      stock: 15,
      sku: 'KZ-BK-TEST',
      genre: 'kazakh_classics',
      coverImage: 'https://images.unsplash.com/photo-1234',
      status: 'active',
    });

    const products = useSellerStore.getState().products;
    expect(products.length).toBe(initialCount + 1);

    const added = products[0];
    expect(added.title).toBe('Жаңа кітап'); // XSS sanitized
    expect(added.price).toBe(6500);
  });

  it('updates product stock and updates lowStock metric', () => {
    const product = useSellerStore.getState().products[0];
    useSellerStore.getState().updateProductStock(product.id, 2);

    const updated = useSellerStore.getState().products.find((p) => p.id === product.id);
    expect(updated?.stock).toBe(2);
    expect(useSellerStore.getState().metrics.lowStockCount).toBeGreaterThan(0);
  });
});
