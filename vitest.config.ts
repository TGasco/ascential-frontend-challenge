import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: './setupTests.ts', // Path to setup file
    globals: true,
  }
});