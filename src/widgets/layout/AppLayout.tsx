// src/widgets/layout/AppLayout.tsx
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '../header/Header';
import { Sidebar } from '../sidebar/Sidebar';
import { GlobalSidebar } from '../sidebar/GlobalSidebar';
import { Footer } from '../footer/Footer';
import { ToastContainer } from '../../shared/ui/Toast/ToastContainer';
import { MobileBottomNav } from '../navigation/MobileBottomNav';

export const AppLayout: React.FC = () => {
  const location = useLocation();

  const showSidebar =
    location.pathname.startsWith('/dashboard') ||
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/profile');

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 text-zinc-900 dark:bg-[#0a0a0c] dark:text-zinc-100 transition-colors pb-16 md:pb-0 selection:bg-zinc-900 selection:text-white dark:selection:bg-white/20 dark:selection:text-white">
      <Header />
      <GlobalSidebar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {showSidebar && <Sidebar />}

        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </main>
      </div>

      <Footer />
      <MobileBottomNav />
      <ToastContainer />
    </div>
  );
};
