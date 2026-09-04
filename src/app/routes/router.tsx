import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../../widgets/app-layout';
import { ProtectedRoute } from './ProtectedRoute';

import { LandingPage } from '../../pages/landing';
import { LoginPage } from '../../pages/login';
import { CatalogPage } from '../../pages/catalog';
import { CartPage } from '../../pages/cart';
import { OrdersPage } from '../../pages/orders';
import { WalletPage } from '../../pages/wallet';
import { ClientDashboardPage } from '../../pages/client-dashboard';
import { AdminDashboardPage } from '../../pages/admin-dashboard';
import { AdminCatalogPage } from '../../pages/admin-catalog';
import { AdminWarehousePage } from '../../pages/admin-warehouse';
import { AdminAnalyticsPage } from '../../pages/admin-analytics';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      // Client Routes
      {
        path: 'client',
        children: [
          {
            path: 'catalog',
            element: <CatalogPage />,
          },
          {
            path: 'cart',
            element: <CartPage />,
          },
          {
            path: 'dashboard',
            element: (
              <ProtectedRoute allowedRoles={['client']}>
                <ClientDashboardPage />
              </ProtectedRoute>
            ),
          },
          {
            path: 'orders',
            element: (
              <ProtectedRoute allowedRoles={['client']}>
                <OrdersPage />
              </ProtectedRoute>
            ),
          },
          {
            path: 'wallet',
            element: (
              <ProtectedRoute allowedRoles={['client']}>
                <WalletPage />
              </ProtectedRoute>
            ),
          },
        ],
      },
      // Admin Routes
      {
        path: 'admin',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/dashboard',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/catalog',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminCatalogPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/warehouse',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminWarehousePage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/analytics',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminAnalyticsPage />
          </ProtectedRoute>
        ),
      },
      // Fallback
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);
