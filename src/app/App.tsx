// src/app/App.tsx
import React from 'react';
import { ThemeProvider } from './providers/ThemeProvider';
import { AppRouter } from './router/AppRouter';
import '../shared/lib/i18n/i18n';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppRouter />
    </ThemeProvider>
  );
};
