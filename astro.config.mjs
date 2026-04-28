import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://cphxnotes.com',
  devToolbar: {
    enabled: false,
  },
  integrations: [mdx(), sitemap()],
});
