// src/entities/seller/model/sellerStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SellerProduct, SellerOrder, SellerMetrics, SellerOrderStatus, ProductStatus } from './types';
import { sanitizeId, sanitizeInput, sanitizePrice, sanitizeStock, sanitizeUrl } from '../../../shared/lib/security';

interface SellerState {
  products: SellerProduct[];
  orders: SellerOrder[];
  metrics: SellerMetrics;
  isLoading: boolean;

  addProduct: (data: Omit<SellerProduct, 'id' | 'salesCount' | 'revenue'>) => void;
  updateProduct: (id: string, data: Partial<SellerProduct>) => void;
  deleteProduct: (id: string) => void;
  updateOrderStatus: (orderId: string, status: SellerOrderStatus) => void;
  updateProductStock: (productId: string, newStock: number) => void;
}

const INITIAL_SELLER_PRODUCTS: SellerProduct[] = [
  {
    id: 'sp-1',
    title: 'Абай жолы (4 томдық)',
    author: 'Мұхтар Әуезов',
    price: 12500,
    stock: 24,
    sku: 'KZ-BK-001',
    genre: 'kazakh_classics',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    status: 'active',
    salesCount: 142,
    revenue: 1775000,
  },
  {
    id: 'sp-2',
    title: 'Қан мен тер (Трилогия)',
    author: 'Әбдіжәмил Нұрпейісов',
    price: 8900,
    stock: 18,
    sku: 'KZ-BK-002',
    genre: 'kazakh_classics',
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
    status: 'active',
    salesCount: 68,
    revenue: 605200,
  },
  {
    id: 'sp-3',
    title: 'Көшпенділер (Трилогия)',
    author: 'Ілияс Есенберлин',
    price: 9800,
    stock: 4,
    sku: 'KZ-BK-003',
    genre: 'history',
    coverImage: 'https://images.unsplash.com/photo-1532012164546-f432f2e37b29?w=600&auto=format&fit=crop&q=80',
    status: 'active',
    salesCount: 210,
    revenue: 2058000,
  },
];

const INITIAL_SELLER_ORDERS: SellerOrder[] = [
  {
    id: 'so-1',
    orderNumber: 'ORD-9842',
    customerName: 'Арыстан Мекен',
    customerPhone: '+7 777 123 4567',
    itemsCount: 2,
    total: 21400,
    status: 'packing',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    deliveryAddress: 'г. Алматы, пр. Абая 150, кв. 12',
  },
  {
    id: 'so-2',
    orderNumber: 'ORD-9841',
    customerName: 'Динара Сейфуллина',
    customerPhone: '+7 701 555 8899',
    itemsCount: 1,
    total: 12500,
    status: 'shipped',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    deliveryAddress: 'г. Астана, ул. Достык 5',
  },
  {
    id: 'so-3',
    orderNumber: 'ORD-9840',
    customerName: 'Ернар Касымов',
    customerPhone: '+7 705 333 2211',
    itemsCount: 3,
    total: 31200,
    status: 'delivered',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    deliveryAddress: 'г. Шымкент, мкр. Самал 12',
  },
];

function calculateMetrics(products: SellerProduct[], orders: SellerOrder[]): SellerMetrics {
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const averageCheck = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const activeProductsCount = products.filter((p) => p.status === 'active').length;
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 5).length;

  return {
    totalRevenue,
    totalOrders,
    averageCheck,
    activeProductsCount,
    lowStockCount,
  };
}

export const useSellerStore = create<SellerState>()(
  persist(
    (set, get) => ({
      products: INITIAL_SELLER_PRODUCTS,
      orders: INITIAL_SELLER_ORDERS,
      metrics: calculateMetrics(INITIAL_SELLER_PRODUCTS, INITIAL_SELLER_ORDERS),
      isLoading: false,

      addProduct: (data) => {
        const cleanProduct: SellerProduct = {
          id: `sp-${Date.now()}`,
          title: sanitizeInput(data.title),
          author: sanitizeInput(data.author),
          price: sanitizePrice(data.price),
          stock: sanitizeStock(data.stock),
          sku: sanitizeInput(data.sku) || `SKU-${Date.now()}`,
          genre: sanitizeInput(data.genre) || 'kazakh_classics',
          coverImage: sanitizeUrl(data.coverImage),
          status: data.status || 'active',
          salesCount: 0,
          revenue: 0,
        };

        const updatedProducts = [cleanProduct, ...get().products];
        set({
          products: updatedProducts,
          metrics: calculateMetrics(updatedProducts, get().orders),
        });
      },

      updateProduct: (id, data) => {
        const cleanId = sanitizeId(id);
        const updatedProducts = get().products.map((p) => {
          if (p.id !== cleanId) return p;
          return {
            ...p,
            ...(data.title !== undefined && { title: sanitizeInput(data.title) }),
            ...(data.author !== undefined && { author: sanitizeInput(data.author) }),
            ...(data.price !== undefined && { price: sanitizePrice(data.price) }),
            ...(data.stock !== undefined && { stock: sanitizeStock(data.stock) }),
            ...(data.sku !== undefined && { sku: sanitizeInput(data.sku) }),
            ...(data.genre !== undefined && { genre: sanitizeInput(data.genre) }),
            ...(data.coverImage !== undefined && { coverImage: sanitizeUrl(data.coverImage) }),
            ...(data.status !== undefined && { status: data.status as ProductStatus }),
          };
        });

        set({
          products: updatedProducts,
          metrics: calculateMetrics(updatedProducts, get().orders),
        });
      },

      deleteProduct: (id) => {
        const cleanId = sanitizeId(id);
        const updatedProducts = get().products.filter((p) => p.id !== cleanId);
        set({
          products: updatedProducts,
          metrics: calculateMetrics(updatedProducts, get().orders),
        });
      },

      updateOrderStatus: (orderId, status) => {
        const cleanOrderId = sanitizeId(orderId);
        const updatedOrders = get().orders.map((o) =>
          o.id === cleanOrderId ? { ...o, status } : o
        );
        set({
          orders: updatedOrders,
          metrics: calculateMetrics(get().products, updatedOrders),
        });
      },

      updateProductStock: (productId, newStock) => {
        const cleanId = sanitizeId(productId);
        const cleanStock = sanitizeStock(newStock);
        const updatedProducts = get().products.map((p) =>
          p.id === cleanId ? { ...p, stock: cleanStock } : p
        );
        set({
          products: updatedProducts,
          metrics: calculateMetrics(updatedProducts, get().orders),
        });
      },
    }),
    {
      name: 'qazaq_market_seller_v1',
      version: 1,
    }
  )
);
