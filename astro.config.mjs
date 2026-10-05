// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://himehina-budokan.example.workers.dev',
  integrations: [react()],
  build: { format: 'directory' },
});
