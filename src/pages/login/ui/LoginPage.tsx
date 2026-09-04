import React from 'react';
import { BookOpen } from 'lucide-react';
import { LoginForm } from '../../../features/auth';
import { APP_CONFIG } from '../../../shared/config/constants';

export const LoginPage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="text-center mb-8 space-y-2">
        <div className="w-12 h-12 rounded-md border border-[#30363d] bg-[#161b22] text-[#f0f6fc] flex items-center justify-center mx-auto shadow-gh">
          <BookOpen className="w-6 h-6 stroke-[1.75]" />
        </div>
        <h1 className="text-2xl font-bold text-[#f0f6fc] tracking-tight">
          Вход в {APP_CONFIG.NAME}
        </h1>
        <p className="text-xs text-[#8d96a0]">
          Переключайтесь между профилем покупателя и панелью администратора
        </p>
      </div>

      <LoginForm />
    </div>
  );
};
