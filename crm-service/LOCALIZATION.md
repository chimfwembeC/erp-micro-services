# Localization in TekRem Microservices

This document describes the localization implementation used across the TekRem microservices ecosystem.

## Overview

TekRem supports multiple languages using i18next:

- English (en)
- Bemba (bem)
- Nyanja (nya)
- Tonga (toi)

## Implementation Details

### Directory Structure

Each microservice follows this directory structure for localization:

```
resources/js/i18n/
├── index.ts                  # Main configuration file
└── locales/
    ├── en/                   # English translations
    │   └── translation.json
    ├── bem/                  # Bemba translations
    │   └── translation.json
    ├── nya/                  # Nyanja translations
    │   └── translation.json
    └── toi/                  # Tonga translations
        └── translation.json
```

### Configuration

The i18n configuration is defined in `resources/js/i18n/index.ts`:

```typescript
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
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
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
```

### Language Switcher Component

The LanguageSwitcher component allows users to change the language:

```tsx
import { useTranslation } from 'react-i18next';
import { languages } from '@/i18n';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import { Button } from '@/Components/ui/button';

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lng: string) => {
    console.log('Changing language to:', lng);
    i18n.changeLanguage(lng);
  };

  // Get current language details
  const currentLang = languages[i18n.language as keyof typeof languages] || languages.en;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 px-0">
          <span className="text-lg">{currentLang.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(languages).map(([lng, lang]) => (
          <DropdownMenuItem
            key={lng}
            onClick={() => changeLanguage(lng)}
            className="cursor-pointer flex items-center justify-between"
          >
            <div>
              <span className="mr-2">{lang.flag}</span>
              {lang.nativeName}
            </div>
            {i18n.language === lng && (
              <div className="h-2 w-2 rounded-full bg-primary"></div>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

### Using Translations in Components

To use translations in components:

```tsx
import { useTranslation } from 'react-i18next';

export default function MyComponent() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('common.dashboard')}</h1>
      <p>{t('common.welcome', { name: 'John' })}</p>
    </div>
  );
}
```

## Critical Configuration Requirements

### 1. Correct Language Codes

Use the correct language codes:

- English: 'en'
- Bemba: 'bem' (not 'bemba')
- Nyanja: 'nya' (not 'nyanja')
- Tonga: 'toi' (not 'tonga')

### 2. Consistent Directory Structure

Ensure the directory structure is consistent:

- Use `/locales/{en,bem,nya,toi}/translation.json` for translations
- Don't mix different structures like `/locales/en.json` and `/locales/en/translation.json`

### 3. Consistent Component Imports

Use consistent component imports:

- Import from '@/Components/LanguageSwitcher' (capital C)
- Avoid duplicate components with different paths (e.g., '@/components/LanguageSwitcher' with lowercase c)

## Translation Files

### English Example (en/translation.json)

```json
{
  "common": {
    "dashboard": "Dashboard",
    "clients": "Clients",
    "leads": "Leads",
    "communications": "Communications",
    "profile": "Profile",
    "logout": "Log Out",
    "welcome": "Welcome, {{name}}!"
  }
}
```

### Bemba Example (bem/translation.json)

```json
{
  "common": {
    "dashboard": "Icipampa",
    "clients": "Abantu",
    "leads": "Abaletungulula",
    "communications": "Ukusokolola",
    "profile": "Ilyashi lyandi",
    "logout": "Fuma",
    "welcome": "Mwaiseni, {{name}}!"
  }
}
```

## Troubleshooting

### Common Issues

1. **Language Not Changing**
   - Check if the language code is correct
   - Verify that the translation file exists in the correct directory
   - Check browser console for errors

2. **Missing Translations**
   - Ensure the translation key exists in all language files
   - Check for typos in translation keys
   - Verify that the translation file is properly formatted JSON

3. **Component Not Found**
   - Check if you're importing from the correct path (capital vs. lowercase)
   - Verify that the component exists in the specified location

### Debugging

Add console logs to help diagnose issues:

```tsx
const changeLanguage = (lng: string) => {
  console.log('Changing language to:', lng);
  console.log('Current language:', i18n.language);
  console.log('Available languages:', Object.keys(languages));
  i18n.changeLanguage(lng);
};
```

## Next Steps

1. Implement a language preference API to store user language preferences
2. Add more Zambian languages
3. Implement right-to-left (RTL) support for languages that require it
4. Add translation management tools for non-technical users
