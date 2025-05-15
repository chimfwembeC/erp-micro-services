import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Import translations
import enTranslation from './locales/en.json';
import bembaTranslation from './locales/bemba.json';
import nyanjaTranslation from './locales/nyanja.json';
import tongaTranslation from './locales/tonga.json';

const resources = {
  en: {
    translation: enTranslation
  },
  bemba: {
    translation: bembaTranslation
  },
  nyanja: {
    translation: nyanjaTranslation
  },
  tonga: {
    translation: tongaTranslation
  }
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false, // not needed for React
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
