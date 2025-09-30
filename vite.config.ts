import path from 'node:path';

import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/ip2country/',
  plugins: [vue()],
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
});
