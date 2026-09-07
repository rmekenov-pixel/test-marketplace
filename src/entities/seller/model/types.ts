// src/entities/seller/model/types.ts

export type ProductStatus = 'active' | 'draft' | 'archived';
export type SellerOrderStatus = 'new' | 'packing' | 'shipped' | 'delivered' | 'cancelled';

export interface SellerProduct {
  id: string;
  title: string;
  author: string;
  price: number;
  stock: number;
  sku: string;
  genre: string;
  coverImage: string;
  status: ProductStatus;
  salesCount: number;
  revenue: number;
}

export interface SellerOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  itemsCount: number;
  total: number;
  status: SellerOrderStatus;
  createdAt: string;
  deliveryAddress: string;
}

export interface SellerMetrics {
  totalRevenue: number;
  totalOrders: number;
  averageCheck: number;
  activeProductsCount: number;
  lowStockCount: number;
}
