export type OrderStatus = 'pending' | 'processing' | 'delivered' | 'cancelled';
export type PaymentMethod = 'wallet' | 'kaspi_qr' | 'card';

/**
 * Historical snapshot of an ordered book item.
 * Captures the exact price, title and author at the time of purchase.
 */
export interface OrderItem {
  bookId: string;
  title: string;
  author: string;
  coverImage: string;
  priceAtOrder: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
  createdAt: string;
  deliveryAddress: string;
  paymentMethod: PaymentMethod;
}

export type CreateOrderDto = Omit<Order, 'id' | 'createdAt' | 'status'>;
