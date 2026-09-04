import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0d1117] border-t border-[#30363d] mt-16 py-8 text-xs text-[#8d96a0]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="font-semibold text-[#f0f6fc]">Kitap All</span>
          <span>© {new Date().getFullYear()} Kitap All, Inc.</span>
          <Link to="/client/catalog" className="text-[#58a6ff] hover:underline">
            Каталог
          </Link>
          <Link to="/login" className="text-[#58a6ff] hover:underline">
            Вход в систему
          </Link>
        </div>

        <div className="text-right text-[#6e7681]">
          Книжный маркетплейс Казахстана • Kaspi Pay
        </div>
      </div>
    </footer>
  );
};
