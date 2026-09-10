import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ruLocale from './locales/ru.json';
import kkLocale from './locales/kk.json';

const STORAGE_KEY = 'qazaq_market_lang';
const savedLang = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
const initialLanguage = savedLang && ['ru', 'kk', 'kz'].includes(savedLang) ? (savedLang === 'kz' ? 'kk' : savedLang) : 'kk';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ru: { translation: ruLocale },
      kk: { translation: kkLocale },
      kz: { translation: kkLocale },
    },
    lng: initialLanguage,
    fallbackLng: 'kk',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
