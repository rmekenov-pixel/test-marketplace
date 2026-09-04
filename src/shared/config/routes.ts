export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  CLIENT: {
    CATALOG: '/client/catalog',
    CART: '/client/cart',
    DASHBOARD: '/client/dashboard',
    ORDERS: '/client/orders',
    WALLET: '/client/wallet',
  },
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    CATALOG: '/admin/catalog',
    WAREHOUSE: '/admin/warehouse',
    ANALYTICS: '/admin/analytics',
  },
} as const;
