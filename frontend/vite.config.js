import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import rollupNodePolyFill from 'rollup-plugin-node-polyfills';

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis', // 👈 Fix "global is not defined"
  },
  resolve: {
    alias: {
      stream: 'rollup-plugin-node-polyfills/polyfills/stream',
      crypto: 'rollup-plugin-node-polyfills/polyfills/crypto-browserify',
    },
  },
  optimizeDeps: {
    include: ['simple-peer'],
  },
  build: {
    rollupOptions: {
      plugins: [rollupNodePolyFill()],
    },
  },
});
