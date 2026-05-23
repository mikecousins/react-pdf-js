import { defineConfig } from 'astro/config';
import markdoc from '@astrojs/markdoc';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

import searchIndex from './src/markdoc/search-plugin.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://react-pdf.cousins.ai',
  integrations: [markdoc(), react(), sitemap()],
  vite: {
    plugins: [searchIndex()],
  },
});
