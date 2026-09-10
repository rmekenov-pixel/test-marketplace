// src/test/themeAndLanguage.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { useTheme } from '../shared/lib/theme/useTheme';
import { useLang } from '../shared/lib/i18n/useLang';
import i18n from '../shared/lib/i18n/i18n';

describe('Theme and Language Switching Logic', () => {
  beforeEach(() => {
    useTheme.getState().setTheme('dark');
    useLang.getState().setLang('ru');
  });

  it('toggles theme between dark and light', () => {
    expect(useTheme.getState().theme).toBe('dark');
    useTheme.getState().toggleTheme();
    expect(useTheme.getState().theme).toBe('light');
    useTheme.getState().toggleTheme();
    expect(useTheme.getState().theme).toBe('dark');
  });

  it('sets theme directly to light or dark', () => {
    useTheme.getState().setTheme('light');
    expect(useTheme.getState().theme).toBe('light');
    useTheme.getState().setTheme('dark');
    expect(useTheme.getState().theme).toBe('dark');
  });

  it('switches language between RU, KK, EN, and supports KZ alias', () => {
    useLang.getState().setLang('kk');
    expect(useLang.getState().lang).toBe('kk');
    expect(i18n.language).toBe('kk');

    useLang.getState().setLang('en');
    expect(useLang.getState().lang).toBe('en');
    expect(i18n.language).toBe('en');

    // Test KZ alias
    useLang.getState().setLang('kz');
    expect(useLang.getState().lang).toBe('kk');
    expect(i18n.language).toBe('kk');

    useLang.getState().setLang('ru');
    expect(useLang.getState().lang).toBe('ru');
    expect(i18n.language).toBe('ru');
  });
});
