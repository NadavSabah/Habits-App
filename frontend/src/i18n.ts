/**
 * i18n configuration for the frontend.
 * Initializes i18next with react-i18next and loads translation resources.
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enCommon from './locales/en.json';
import heCommon from './locales/he.json';

const defaultNS = 'common';
const fallbackLng = 'en';
const supportedLngs: string[] = ['en', 'he'];

void i18n.use(initReactI18next).init({
  defaultNS,
  fallbackLng,
  supportedLngs,
  resources: {
    en: { [defaultNS]: enCommon as Record<string, unknown> },
    he: { [defaultNS]: heCommon as Record<string, unknown> },
  },
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
