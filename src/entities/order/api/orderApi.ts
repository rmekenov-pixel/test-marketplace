import type { Order, CreateOrderDto } from '../model/types';
import { storageService } from '../../../shared/api/storage';
import { mockNetworkDelay } from '../../../shared/api/baseApi';

const STORAGE_KEY = 'kitap_all_orders_v2';

const INITIAL_ORDERS_SEED: Order[] = [
  {
    id: 'ORD-9842',
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
          stock: 20,
          rating: 4.9,
          reviewsCount: 128,
          publicationYear: 2021,
          pages: 1420,
          isbn: '978-601-04-1234-5',
        },
        quantity: 1,
      },
    ],
    totalPrice: 12500,
    status: 'delivered',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    deliveryAddress: 'г. Алматы, пр. Абая 150, кв. 12',
    paymentMethod: 'wallet',
  },
];

export const orderApi = {
  async getAll(): Promise<Order[]> {
    await mockNetworkDelay();
    return storageService.get<Order[]>(STORAGE_KEY, INITIAL_ORDERS_SEED);
  },

  async getByUserId(userId: string): Promise<Order[]> {
    await mockNetworkDelay();
    const orders = storageService.get<Order[]>(STORAGE_KEY, INITIAL_ORDERS_SEED);
    return orders.filter((o) => o.userId === userId);
  },

  async create(dto: CreateOrderDto): Promise<Order> {
    await mockNetworkDelay();
    const orders = storageService.get<Order[]>(STORAGE_KEY, INITIAL_ORDERS_SEED);
    const newOrder: Order = {
      ...dto,
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'processing',
      createdAt: new Date().toISOString(),
    };
    const updated = [newOrder, ...orders];
    storageService.set(STORAGE_KEY, updated);
    return newOrder;
  },

  async updateStatus(id: string, status: Order['status']): Promise<Order> {
    await mockNetworkDelay();
    const orders = storageService.get<Order[]>(STORAGE_KEY, INITIAL_ORDERS_SEED);
    const index = orders.findIndex((o) => o.id === id);
    if (index === -1) throw new Error(`Order ${id} not found`);

    orders[index].status = status;
    storageService.set(STORAGE_KEY, orders);
    return orders[index];
  },
};
