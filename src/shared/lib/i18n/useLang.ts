// src/shared/lib/i18n/useLang.ts
import { create } from 'zustand';
import i18n from './i18n';

export type Language = 'ru' | 'en' | 'kk';

interface LangState {
  lang: Language;
  setLang: (lang: Language) => void;
}

const STORAGE_KEY = 'qazaq_market_lang';

export const useLang = create<LangState>((set) => ({
  lang: (i18n.language as Language) || 'ru',

  setLang: (lang: Language) => {
    i18n.changeLanguage(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, lang);
    }
    set({ lang });
  },
}));
