// src/shared/lib/i18n/useLang.ts
import { create } from 'zustand';
import i18n from './i18n';

export type Language = 'ru' | 'en' | 'kk' | 'kz';

interface LangState {
  lang: Language;
  setLang: (lang: Language) => void;
}

const STORAGE_KEY = 'qazaq_market_lang';

export const useLang = create<LangState>((set) => ({
  lang: ((i18n.language === 'kz' ? 'kk' : i18n.language) as Language) || 'ru',

  setLang: (lang: Language) => {
    const target = lang === 'kz' ? 'kk' : lang;
    i18n.changeLanguage(target);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, target);
      document.documentElement.lang = target === 'kk' ? 'kk' : target;
    }
    set({ lang: target });
  },
}));

