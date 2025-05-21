import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Import translations
import translationEN from './locales/en/translation.json';
import customerEN from './locales/en/customer.json';
import translationBemba from './locales/bem/translation.json';
import customerBemba from './locales/bem/customer.json';
import translationNyanja from './locales/nya/translation.json';
import customerNyanja from './locales/nya/customer.json';
import translationTonga from './locales/toi/translation.json';
import customerTonga from './locales/toi/customer.json';

// Define available languages
export const languages = {
  en: { nativeName: 'English', flag: '🇬🇧' },
  bem: { nativeName: 'Bemba', flag: '🇿🇲' },
  nya: { nativeName: 'Nyanja', flag: '🇿🇲' },
  toi: { nativeName: 'Tonga', flag: '🇿🇲' },
};

// Helper function to safely merge translations
const safelyMergeTranslations = (base: any, additional: any) => {
  if (!base || typeof base !== 'object') base = {};
  if (!additional || typeof additional !== 'object') additional = {};
  return { ...base, ...additional };
};

// Define resources
const resources = {
  en: {
    translation: safelyMergeTranslations(translationEN, customerEN)
  },
  bem: {
    translation: safelyMergeTranslations(translationBemba, customerBemba)
  },
  nya: {
    translation: safelyMergeTranslations(translationNyanja, customerNyanja)
  },
  toi: {
    translation: safelyMergeTranslations(translationTonga, customerTonga)
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
