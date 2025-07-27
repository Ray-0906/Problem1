import { defineConfig } from 'vite';
import nodePolyfills from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    nodePolyfills({
      // include specific polyfills
      protocolImports: true,
    }),
  ],
  resolve: {
    alias: {
      stream: 'stream-browserify',
      util: 'util',
      events: 'events/',
      buffer: 'buffer/',
    },
  },
  define: {
    global: 'globalThis',
  },
});
