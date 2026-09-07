// src/test/i18n.test.ts
import { describe, it, expect } from 'vitest';
import i18n from '../shared/lib/i18n/i18n';
import ruLocale from '../shared/lib/i18n/locales/ru.json';
import enLocale from '../shared/lib/i18n/locales/en.json';
import kkLocale from '../shared/lib/i18n/locales/kk.json';

describe('i18n Localization Integrity', () => {
  it('has consistent top-level keys across ru, en, kk', () => {
    const ruKeys = Object.keys(ruLocale);
    const enKeys = Object.keys(enLocale);
    const kkKeys = Object.keys(kkLocale);

    expect(enKeys).toEqual(ruKeys);
    expect(kkKeys).toEqual(ruKeys);
  });

  it('switches languages correctly in i18next', async () => {
    await i18n.changeLanguage('kk');
    expect(i18n.language).toBe('kk');
    expect(i18n.t('nav.catalog')).toBe('Каталог');

    await i18n.changeLanguage('en');
    expect(i18n.language).toBe('en');
    expect(i18n.t('nav.catalog')).toBe('Catalog');

    await i18n.changeLanguage('ru');
    expect(i18n.language).toBe('ru');
    expect(i18n.t('nav.catalog')).toBe('Каталог');
  });
});
