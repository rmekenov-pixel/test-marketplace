import type { Order, CreateOrderDto, OrderItem } from '../model/types';
import { storageService } from '../../../shared/api/storage';
import { mockNetworkDelay } from '../../../shared/api/baseApi';
import { sanitizeId, sanitizeInput, sanitizePrice, sanitizeQuantity, sanitizeUrl } from '../../../shared/lib/security';

const STORAGE_KEY = 'kitap_all_orders_v3';

const INITIAL_ORDERS_SEED: Order[] = [
  {
    id: 'ORD-9842',
    userId: 'user-client-1',
    items: [
      {
        bookId: 'book-1',
        title: 'Абай жолы (4 томдық)',
        author: 'Мұхтар Әуезов',
        coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
        priceAtOrder: 12500,
        quantity: 1,
      },
    ],
    totalPrice: 12500,
    status: 'delivered',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    deliveryAddress: 'г. Алматы, пр. Абая 150, кв. 12',
    paymentMethod: 'kaspi_qr',
  },
];

export const orderApi = {
  async getAll(): Promise<Order[]> {
    await mockNetworkDelay();
    return storageService.get<Order[]>(STORAGE_KEY, INITIAL_ORDERS_SEED);
  },

  async getByUserId(userId: string): Promise<Order[]> {
    await mockNetworkDelay();
    const cleanUserId = sanitizeId(userId);
    const orders = storageService.get<Order[]>(STORAGE_KEY, INITIAL_ORDERS_SEED);
    return orders.filter((o) => o.userId === cleanUserId);
  },

  async create(dto: CreateOrderDto): Promise<Order> {
    await mockNetworkDelay();
    const orders = storageService.get<Order[]>(STORAGE_KEY, INITIAL_ORDERS_SEED);

    const cleanItems: OrderItem[] = (dto.items || []).map((item) => ({
      bookId: sanitizeId(item.bookId),
      title: sanitizeInput(item.title),
      author: sanitizeInput(item.author),
      coverImage: sanitizeUrl(item.coverImage),
      priceAtOrder: sanitizePrice(item.priceAtOrder),
      quantity: sanitizeQuantity(item.quantity),
    })).filter((item) => Boolean(item.bookId));

    const calculatedTotal = cleanItems.reduce(
      (sum, item) => sum + item.priceAtOrder * item.quantity,
      0
    );

    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: sanitizeId(dto.userId),
      items: cleanItems,
      totalPrice: sanitizePrice(dto.totalPrice || calculatedTotal),
      deliveryAddress: sanitizeInput(dto.deliveryAddress),
      paymentMethod: dto.paymentMethod || 'kaspi_qr',
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
