// src/app/router/AppRouter.tsx
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppLayout } from '../../widgets/layout/AppLayout';
import { HomePage } from '../../pages/home/HomePage';
import { AuthPage } from '../../pages/auth/AuthPage';
import { CatalogPage } from '../../pages/catalog/CatalogPage';
import { ProductPage } from '../../pages/product/ProductPage';
import { WishlistPage } from '../../pages/wishlist/WishlistPage';
import { CartPage } from '../../pages/cart/CartPage';
import { OrderSuccessPage } from '../../pages/checkout/OrderSuccessPage';
import { ClientDashboardPage } from '../../pages/dashboard/ClientDashboardPage';
import { AdminDashboardPage } from '../../pages/admin/AdminDashboardPage';
import { ProfilePage } from '../../pages/profile/ProfilePage';
import { ForbiddenPage } from '../../pages/forbidden/ForbiddenPage';
import { NotFoundPage } from '../../pages/not-found/NotFoundPage';
import { ProtectedRoute } from '../../shared/lib/auth/ProtectedRoute';

// Seller Portal
import { SellerLayout } from '../../features/seller/ui/SellerLayout';
import { SellerDashboard } from '../../features/seller/ui/SellerDashboard';
import { SellerProducts } from '../../features/seller/ui/SellerProducts';
import { SellerOrders } from '../../features/seller/ui/SellerOrders';
import { SellerAnalytics } from '../../features/seller/ui/SellerAnalytics';

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <AppLayout />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: 'auth',
          element: <AuthPage />,
        },
        {
          path: 'catalog',
          element: <CatalogPage />,
        },
        {
          path: 'catalog/:id',
          element: <ProductPage />,
        },
        {
          path: 'wishlist',
          element: <WishlistPage />,
        },
        {
          path: 'cart',
          element: <CartPage />,
        },
        {
          path: 'checkout/success',
          element: <OrderSuccessPage />,
        },
        {
          path: 'dashboard',
          element: (
            <ProtectedRoute allowedRoles={['CLIENT', 'ADMIN', 'SELLER', 'client', 'admin', 'seller']}>
              <ClientDashboardPage />
            </ProtectedRoute>
          ),
        },
        {
          path: 'seller',
          element: (
            <ProtectedRoute allowedRoles={['SELLER', 'seller', 'ADMIN', 'admin']}>
              <SellerLayout />
            </ProtectedRoute>
          ),
          children: [
            {
              index: true,
              element: <SellerDashboard />,
            },
            {
              path: 'products',
              element: <SellerProducts />,
            },
            {
              path: 'orders',
              element: <SellerOrders />,
            },
            {
              path: 'analytics',
              element: <SellerAnalytics />,
            },
          ],
        },
        {
          path: 'admin',
          element: (
            <ProtectedRoute allowedRoles={['ADMIN', 'admin']}>
              <AdminDashboardPage />
            </ProtectedRoute>
          ),
        },
        {
          path: 'profile',
          element: (
            <ProtectedRoute allowedRoles={['CLIENT', 'ADMIN', 'SELLER', 'client', 'admin', 'seller']}>
              <ProfilePage />
            </ProtectedRoute>
          ),
        },
        {
          path: '403',
          element: <ForbiddenPage />,
        },
        {
          path: '*',
          element: <NotFoundPage />,
        },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  }
);

export const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};
