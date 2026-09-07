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
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors pb-16 md:pb-0">
      <Header />
      <GlobalSidebar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {showSidebar && <Sidebar />}

        <main className="flex-1 min-w-0 px-6 md:px-10 lg:px-16 py-8">
          <Outlet />
        </main>
      </div>

      <Footer />
      <MobileBottomNav />
      <ToastContainer />
    </div>
  );
};
