/**
 * Locale Store
 *
 * Manages the current UI language (i18n). Persists to localStorage and syncs with i18next.
 */

import { create } from 'zustand';
import type { LocaleState, SupportedLocale } from '../types';
import i18n from '../i18n';

const STORAGE_KEY = 'locale';

function getStoredLocale(): SupportedLocale {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'en' || stored === 'he') {
    return stored;
  }
  return 'en';
}

export const useLocaleStore = create<LocaleState>((set) => ({
  locale: getStoredLocale(),

  setLocale: (locale: SupportedLocale) => {
    localStorage.setItem(STORAGE_KEY, locale);
    void i18n.changeLanguage(locale);
    set({ locale });
  },
}));
