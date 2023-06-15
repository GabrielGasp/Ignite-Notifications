import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    alias: {
      '@core': 'src/core',
      '@infra': 'src/infra',
      '@helpers': 'src/helpers',
      '@test': 'test',
    },
    root: './',
    globals: true,
  },
  resolve: {
    alias: {
      '@core': 'src/core',
      '@infra': 'src/infra',
      '@helpers': 'src/helpers',
      '@test': 'test',
    },
  },
  plugins: [swc.vite()],
});
