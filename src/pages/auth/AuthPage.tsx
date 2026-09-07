// src/pages/auth/AuthPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../entities/user/model/authStore';
import { LoginForm } from '../../features/auth/ui/LoginForm';
import { RegisterForm } from '../../features/auth/ui/RegisterForm';

export const AuthPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuthStore();
  const [isLoginMode, setIsLoginMode] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(role === 'admin' ? '/admin' : '/dashboard', { replace: true });
    }
  }, [isAuthenticated, role, navigate]);

  return (
    <div className="py-12 flex items-center justify-center">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded p-8 shadow-sm">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {isLoginMode ? t('auth.titleLogin') : t('auth.titleRegister')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            QazaqMarket — Книжный маркетплейс
          </p>
        </div>

        {isLoginMode ? (
          <LoginForm onSwitchToRegister={() => setIsLoginMode(false)} />
        ) : (
          <RegisterForm onSwitchToLogin={() => setIsLoginMode(true)} />
        )}
      </div>
    </div>
  );
};
