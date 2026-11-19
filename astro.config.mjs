import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.hssolar.com',
  build: {
    // 关键配置：强制生成扁平的 xxx.html，而不是 xxx/index.html
    format: 'file',
  },
});