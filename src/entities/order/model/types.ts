import type { CartItem } from '../../cart';

export type OrderStatus = 'pending' | 'processing' | 'delivered' | 'cancelled';
export type PaymentMethod = 'wallet' | 'kaspi_qr' | 'card';

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalPrice: number;
  status: OrderStatus;
  createdAt: string;
  deliveryAddress: string;
  paymentMethod: PaymentMethod;
}

export type CreateOrderDto = Omit<Order, 'id' | 'createdAt' | 'status'>;
