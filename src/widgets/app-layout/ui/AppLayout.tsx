import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '../../header';
import { Sidebar } from '../../sidebar';
import { MobileNav } from '../../mobile-nav';
import { Footer } from '../../footer';
import { ROUTES } from '../../../shared/config/routes';

export const AppLayout: React.FC = () => {
  const location = useLocation();

  const isClientArea = location.pathname.startsWith('/client');
  const isAdminArea = location.pathname.startsWith('/admin');
  const isLandingOrLogin =
    location.pathname === ROUTES.HOME || location.pathname === ROUTES.LOGIN;

  return (
    <div className="min-h-screen flex flex-col bg-[#0d1117] text-[#f0f6fc]">
      <Header />

      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 py-6">
        {isClientArea || isAdminArea ? (
          <div className="flex gap-6 items-start">
            <Sidebar type={isAdminArea ? 'admin' : 'client'} />
            <div className="flex-1 min-w-0">
              <Outlet />
            </div>
          </div>
        ) : (
          <Outlet />
        )}
      </main>

      {!isLandingOrLogin && <MobileNav />}
      <Footer />
    </div>
  );
};
