# Internationalization (i18n) Documentation

This document provides comprehensive information about the internationalization (i18n) implementation in the TekRem ERP system.

## Overview

The TekRem ERP system supports multiple languages through a comprehensive internationalization (i18n) system. The system is built using:

- **i18next**: A powerful internationalization framework for JavaScript
- **react-i18next**: React bindings for i18next
- **Backend synchronization**: Language preferences are stored in the user's profile

## Supported Languages

The system currently supports the following languages:

| Code | Language | Native Name | Flag |
|------|----------|-------------|------|
| en   | English  | English     | 🇬🇧   |
| bem  | Bemba    | Bemba       | 🇿🇲   |
| nya  | Nyanja   | Nyanja      | 🇿🇲   |
| toi  | Tonga    | Tonga       | 🇿🇲   |

## Architecture

### Frontend Components

1. **i18n Configuration** (`resources/js/i18n/index.ts`):
   - Configures i18next with supported languages
   - Sets up language detection
   - Handles synchronization with the backend
   - Manages toast notifications for language changes

2. **Language Switcher** (`resources/js/Components/LanguageSwitcher.tsx`):
   - Provides a dropdown menu for language selection
   - Displays the current language with a flag
   - Triggers language changes

3. **Translation Hook** (`resources/js/Hooks/useTranslate.ts`):
   - Provides a convenient hook for accessing translations
   - Supports fallback text for missing translations
   - Handles interpolation for dynamic content

### Backend Components

1. **Language Controller** (`app/Http/Controllers/LanguageController.php`):
   - Handles language change requests
   - Stores user language preferences
   - Provides endpoints for getting available languages

2. **SetLocale Middleware** (`app/Http/Middleware/SetLocale.php`):
   - Sets the application locale based on user preferences
   - Falls back to session or default locale if needed

3. **API Routes** (`routes/api.php`):
   - `/api/language/change`: Changes the user's language preference
   - `/api/language/current`: Gets the current language
   - `/api/language/available`: Gets all available languages

## Translation Files

Translation files are stored in JSON format in the following directory structure:

```
resources/js/i18n/locales/
├── en/
│   ├── translation.json
│   └── customer.json
├── bem/
│   ├── translation.json
│   └── customer.json
├── nya/
│   ├── translation.json
│   └── customer.json
└── toi/
    ├── translation.json
    └── customer.json
```

Each language has a main `translation.json` file and additional domain-specific files (e.g., `customer.json`).

## Usage

### Basic Translation

To translate text in a React component:

```tsx
import useTranslate from '@/Hooks/useTranslate';

function MyComponent() {
  const { t } = useTranslate();
  
  return (
    <div>
      <h1>{t('common.dashboard', 'Dashboard')}</h1>
      <p>{t('welcome.description', 'Welcome to our application')}</p>
    </div>
  );
}
```

The second parameter is a fallback text that will be used if the translation key is not found.

### Dynamic Content with Interpolation

For dynamic content, you can use interpolation:

```tsx
import useTranslate from '@/Hooks/useTranslate';

function WelcomeMessage({ name }) {
  const { t } = useTranslate();
  
  return (
    <div>
      <h1>{t('dashboard.welcome', 'Welcome, {{name}}!', { name })}</h1>
    </div>
  );
}
```

### Changing Language

The language can be changed using the LanguageSwitcher component or programmatically:

```tsx
import { useTranslation } from 'react-i18next';

function LanguageButtons() {
  const { i18n } = useTranslation();
  
  return (
    <div>
      <button onClick={() => i18n.changeLanguage('en')}>English</button>
      <button onClick={() => i18n.changeLanguage('bem')}>Bemba</button>
      <button onClick={() => i18n.changeLanguage('nya')}>Nyanja</button>
      <button onClick={() => i18n.changeLanguage('toi')}>Tonga</button>
    </div>
  );
}
```

## Recent Updates

### Toast Notifications

The system now displays toast notifications when changing languages:

- Success notification when the language is changed successfully
- Error notification when the language change fails

### Centralized Language Change Handling

Language changes are now handled centrally in the i18n configuration:

1. The language is changed using `i18n.changeLanguage()`
2. The `languageChanged` event is triggered
3. The event listener in `i18n/index.ts` handles:
   - Updating document attributes
   - Synchronizing with the backend
   - Displaying toast notifications

## Adding a New Language

To add a new language to the system:

1. Create new translation files:
   ```
   resources/js/i18n/locales/[language-code]/translation.json
   resources/js/i18n/locales/[language-code]/customer.json
   ```

2. Add the language to the `languages` object in `resources/js/i18n/index.ts`:
   ```typescript
   export const languages = {
     // Existing languages...
     [language-code]: { nativeName: 'Native Name', flag: '🏳️' },
   };
   ```

3. Add the language to the `resources` object in `resources/js/i18n/index.ts`:
   ```typescript
   const resources = {
     // Existing resources...
     [language-code]: {
       translation: { ...translationNewLang, ...customerNewLang }
     },
   };
   ```

4. Add the language to the validation rule in `app/Http/Controllers/LanguageController.php`:
   ```php
   $request->validate([
       'language' => 'required|string|in:en,bem,nya,toi,[language-code]',
   ]);
   ```

5. Add the language to the valid locales in `app/Http/Middleware/SetLocale.php`:
   ```php
   $validLocales = ['en', 'bem', 'nya', 'toi', '[language-code]'];
   ```

## Troubleshooting

### Missing Translations

If a translation is missing, the system will:

1. First try to use the provided fallback text
2. If no fallback is provided, it will display the translation key itself

This helps identify missing translations during development.

### Language Not Changing

If the language is not changing:

1. Check the browser console for errors
2. Verify that the language code is correct and supported
3. Check if the backend API is responding correctly
4. Clear browser cache and cookies

### Backend Synchronization Issues

If the language preference is not being saved:

1. Check if the user is authenticated
2. Verify that the API endpoint is accessible
3. Check the Laravel logs for errors
