import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['tests/integration/**/*.test.tsx'],
    setupFiles: ['tests/setup.ts'],
  },
});
