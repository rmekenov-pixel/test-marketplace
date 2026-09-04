import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Order, OrderStatus, CartItem } from '../types';

interface OrderState {
  orders: Order[];
  createOrder: (data: {
    userId: string;
    items: CartItem[];
    totalPrice: number;
    deliveryAddress: string;
    paymentMethod: 'wallet' | 'kaspi_qr';
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    userId: 'user-client-1',
    items: [
      {
        book: {
          id: 'book-1',
          title: 'Абай жолы (4 томдық)',
          author: 'Мұхтар Әуезов',
          price: 12500,
          coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
          description: '',
          genre: 'kazakh_classics',
          language: 'kz',
          stock: 25,
          rating: 4.9,
          reviewsCount: 142,
          publicationYear: 2022,
          pages: 1200,
          isbn: '978-601-01-2345-1',
        },
        quantity: 1,
      },
    ],
    totalPrice: 12500,
    status: 'delivered',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    deliveryAddress: 'г. Алматы, пр. Абая 52, кв. 14',
    paymentMethod: 'wallet',
  },
  {
    id: 'ord-1002',
    userId: 'user-client-1',
    items: [
      {
        book: {
          id: 'book-4',
          title: 'Атомные привычки',
          author: 'Джеймс Клир',
          price: 4500,
          coverImage: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&auto=format&fit=crop&q=80',
          description: '',
          genre: 'business',
          language: 'ru',
          stock: 45,
          rating: 4.9,
          reviewsCount: 340,
          publicationYear: 2020,
          pages: 320,
          isbn: '978-5-04-102543-2',
        },
        quantity: 2,
      },
    ],
    totalPrice: 9000,
    status: 'processing',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    deliveryAddress: 'г. Алматы, ул. Достык 105',
    paymentMethod: 'kaspi_qr',
  },
];

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      orders: INITIAL_ORDERS,

      createOrder: (data) => {
        const newOrder: Order = {
          ...data,
          id: `ord-${Math.floor(1000 + Math.random() * 9000)}`,
          status: 'pending',
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          orders: [newOrder, ...state.orders],
        }));

        return newOrder;
      },

      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId ? { ...order, status } : order
          ),
        }));
      },
    }),
    {
      name: 'kitap_orders_storage',
    }
  )
);
