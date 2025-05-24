import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/instalment-widget.ts'),
      name: 'seQueraInstalmentWidget',
      fileName: 'seQueraInstalmentWidget',
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    env: {
      VITE_API_URL: 'http://api.test',
    },
  },
});
