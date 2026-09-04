import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../shared/config/routes';
import { APP_CONFIG } from '../../../shared/config/constants';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0d1117] border-t border-[#30363d] mt-16 py-8 text-xs text-[#8d96a0]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="font-semibold text-[#f0f6fc]">{APP_CONFIG.NAME}</span>
          <span>© {new Date().getFullYear()} {APP_CONFIG.NAME}, Inc.</span>
          <Link to={ROUTES.CLIENT.CATALOG} className="text-[#58a6ff] hover:underline">
            Каталог
          </Link>
          <Link to={ROUTES.LOGIN} className="text-[#58a6ff] hover:underline">
            Вход в систему
          </Link>
        </div>

        <div className="text-right text-[#6e7681]">
          {APP_CONFIG.DESCRIPTION} • Kaspi Pay
        </div>
      </div>
    </footer>
  );
};
