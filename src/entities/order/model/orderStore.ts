import { create } from 'zustand';
import type { Order, CreateOrderDto } from './types';
import { orderApi } from '../api/orderApi';

interface OrderState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;

  fetchOrders: () => Promise<void>;
  createOrder: (dto: CreateOrderDto) => Promise<Order>;
  updateOrderStatus: (id: string, status: Order['status']) => Promise<void>;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  isLoading: false,
  error: null,

  fetchOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await orderApi.getAll();
      set({ orders: data, isLoading: false });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Ошибка загрузки заказов';
      set({ error: message, isLoading: false });
    }
  },

  createOrder: async (dto) => {
    set({ isLoading: true });
    try {
      const newOrder = await orderApi.create(dto);
      await get().fetchOrders();
      return newOrder;
    } finally {
      set({ isLoading: false });
    }
  },

  updateOrderStatus: async (id, status) => {
    await orderApi.updateStatus(id, status);
    await get().fetchOrders();
  },
}));
