import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.hssolar.com',
  build: {
    format: 'file',
    inlineStylesheets: 'auto',
  },
});