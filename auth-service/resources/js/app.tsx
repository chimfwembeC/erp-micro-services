import './bootstrap';
import '../css/app.css';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { RouteContext } from '@/Hooks/useRoute';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { ThemeProvider } from '@/lib/theme-context';
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
      <ThemeProvider defaultTheme="system" storageKey="theme">
        <RouteContext.Provider value={(window as any).route}>
          <App {...props} />
          <Toaster richColors closeButton position="top-right" />
        </RouteContext.Provider>
      </ThemeProvider>,
    );
  },
});
