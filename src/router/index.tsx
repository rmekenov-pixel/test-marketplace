import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { ProtectedRoute } from './ProtectedRoute';

// Public Pages
import { LandingPage } from '../pages/Landing';
import { LoginPage } from '../pages/Login';

// Client Pages
import { ClientDashboardPage } from '../pages/client/Dashboard';
import { ClientCatalogPage } from '../pages/client/Catalog';
import { ClientCartPage } from '../pages/client/Cart';
import { ClientOrdersPage } from '../pages/client/Orders';
import { ClientWalletPage } from '../pages/client/Wallet';

// Admin Pages
import { AdminDashboardPage } from '../pages/admin/Dashboard';
import { AdminCatalogPage } from '../pages/admin/Catalog';
import { AdminWarehousePage } from '../pages/admin/Warehouse';
import { AdminAnalyticsPage } from '../pages/admin/Analytics';

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
            element: <ClientCatalogPage />,
          },
          {
            path: 'cart',
            element: (
              <ProtectedRoute allowedRole="client">
                <ClientCartPage />
              </ProtectedRoute>
            ),
          },
          {
            path: 'dashboard',
            element: (
              <ProtectedRoute allowedRole="client">
                <ClientDashboardPage />
              </ProtectedRoute>
            ),
          },
          {
            path: 'orders',
            element: (
              <ProtectedRoute allowedRole="client">
                <ClientOrdersPage />
              </ProtectedRoute>
            ),
          },
          {
            path: 'wallet',
            element: (
              <ProtectedRoute allowedRole="client">
                <ClientWalletPage />
              </ProtectedRoute>
            ),
          },
        ],
      },

      // Admin Routes
      {
        path: 'admin',
        children: [
          {
            path: 'dashboard',
            element: (
              <ProtectedRoute allowedRole="admin">
                <AdminDashboardPage />
              </ProtectedRoute>
            ),
          },
          {
            path: 'catalog',
            element: (
              <ProtectedRoute allowedRole="admin">
                <AdminCatalogPage />
              </ProtectedRoute>
            ),
          },
          {
            path: 'warehouse',
            element: (
              <ProtectedRoute allowedRole="admin">
                <AdminWarehousePage />
              </ProtectedRoute>
            ),
          },
          {
            path: 'analytics',
            element: (
              <ProtectedRoute allowedRole="admin">
                <AdminAnalyticsPage />
              </ProtectedRoute>
            ),
          },
        ],
      },

      // Catch-all redirect
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);
