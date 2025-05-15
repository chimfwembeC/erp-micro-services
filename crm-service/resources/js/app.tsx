import './bootstrap';
import '../css/app.css';
import './i18n';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { RouteContext } from '@/Hooks/useRoute';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { ThemeProvider } from '@/Components/ThemeProvider';
import { Toaster } from 'sonner';

const appName =
  window.document.getElementsByTagName('title')[0]?.innerText || 'Laravel';

createInertiaApp({
  title: title => `${title} - ${appName}`,
  progress: {
    color: '#4B5563',
  },
  resolve: name =>
    resolvePageComponent(
      `./Pages/${name}.tsx`,
      import.meta.glob('./Pages/**/*.tsx'),
    ),
  setup({ el, App, props }) {
    const root = createRoot(el);
    return root.render(
      <RouteContext.Provider value={(window as any).route}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <I18nextProvider i18n={i18n}>
            <App {...props} />
            <Toaster richColors closeButton position="top-right" />
          </I18nextProvider>
        </ThemeProvider>
      </RouteContext.Provider>,
    );
  },
});
