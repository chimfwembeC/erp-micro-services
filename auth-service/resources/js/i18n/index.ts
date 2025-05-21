import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import axios from 'axios';
import { toast } from 'sonner';

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

// Define resources
const resources = {
  en: {
    translation: { ...translationEN, ...customerEN }
  },
  bem: {
    translation: { ...translationBemba, ...customerBemba }
  },
  nya: {
    translation: { ...translationNyanja, ...customerNyanja }
  },
  toi: {
    translation: { ...translationTonga, ...customerTonga }
  }
};

// Function to sync language change with backend
const syncLanguageWithBackend = async (language: string) => {
  // Don't make API call during SSR
  if (typeof window === 'undefined') return;

  try {
    // Send language preference to backend
    const response = await axios.post('/api/language/change', { language });
    return response.data;
  } catch (error) {
    console.error('Failed to sync language with backend:', error);
    throw error;
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
    debug: typeof process !== 'undefined' && process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false, // React already safes from XSS
    },
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
      lookupQuerystring: 'lang',
      lookupCookie: 'i18next',
      caches: ['localStorage', 'cookie'],
    },
  });

// Use toast for notifications

// Add language change listener to sync with backend
i18n.on('languageChanged', (language) => {
  // Update document attributes
  document.documentElement.lang = language;
  document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';

  // Sync with backend
  syncLanguageWithBackend(language)
    .then(data => {
      if (data?.success) {
        // Get the translated message using the current i18n instance
        const message = i18n.t('common.languageChanged');
        toast.success(message);
      }
    })
    .catch(() => {
      const errorMessage = i18n.t('common.languageChangeError');
      toast.error(errorMessage);
    });
});

export default i18n;
