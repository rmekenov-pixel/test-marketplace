// src/shared/lib/i18n/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ruLocale from './locales/ru.json';
import enLocale from './locales/en.json';
import kkLocale from './locales/kk.json';

const STORAGE_KEY = 'qazaq_market_lang';
const savedLang = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
const initialLanguage = savedLang && ['ru', 'en', 'kk'].includes(savedLang) ? savedLang : 'ru';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ru: { translation: ruLocale },
      en: { translation: enLocale },
      kk: { translation: kkLocale },
    },
    lng: initialLanguage,
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
