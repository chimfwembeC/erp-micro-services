import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    laravel({
      input: 'resources/js/app.tsx',
      refresh: true,
    }),
    react(),
  ],
  resolve: {
    alias: {
      '@': '/resources/js',
    },
  },
  server: {
    host: '0.0.0.0',
    hmr: {
      host: 'localhost',
      port: 5173,
    },
    cors: {
      origin: [
        'http://localhost:8001',
        'http://127.0.0.1:8001'
      ],
      credentials: true,
    },
  },
});
