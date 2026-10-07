// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import zhLiterals from './src/i18n/vite-zh-literals.mjs';

export default defineConfig({
  site: 'https://himehina-budokan.example.workers.dev',
  integrations: [react()],
  build: { format: 'directory' },
  // Pages are written once in Simplified Chinese; /zh-hant/* is generated from them and
  // converted to Traditional Chinese by src/middleware.ts (see src/i18n/).
  i18n: {
    locales: ['zh-hans', 'zh-hant'],
    defaultLocale: 'zh-hans',
    fallback: { 'zh-hant': 'zh-hans' },
    routing: { prefixDefaultLocale: false, fallbackType: 'rewrite' },
  },
  vite: {
    plugins: [zhLiterals({ include: new URL('./src/', import.meta.url).pathname })],
  },
});
