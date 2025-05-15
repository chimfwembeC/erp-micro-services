import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Import translations
import translationEN from './locales/en/translation.json';
import translationBemba from './locales/bem/translation.json';
import translationNyanja from './locales/nya/translation.json';
import translationTonga from './locales/toi/translation.json';

// Define available languages
export const languages = {
  en: { nativeName: 'English', flag: '🇬🇧' },
  bem: { nativeName: 'Bemba', flag: '🇿🇲' },
  nya: { nativeName: 'Nyanja', flag: '🇿🇲' },
  toi: { nativeName: 'Tonga', flag: '🇿🇲' },
};

// Define resources
const resources = {
  en: {
    translation: translationEN
  },
  bem: {
    translation: translationBemba
  },
  nya: {
    translation: translationNyanja
  },
  toi: {
    translation: translationTonga
  }
};

i18n
  // Load translation using http -> see /public/locales
  // Learn more: https://github.com/i18next/i18next-http-backend
  .use(Backend)
  // Detect user language
  // Learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Init i18next
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false, // React already safes from XSS
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
