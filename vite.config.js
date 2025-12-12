import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // บังคับให้ Polyfill เฉพาะ Buffer ที่ TON ต้องการ
      include: ['buffer'],
      globals: {
        Buffer: true,
      },
    }),
  ],
  base: '/',
});
