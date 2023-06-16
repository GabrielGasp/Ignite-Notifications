import os from 'os';
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
    globalSetup: './test/globalSetup.ts',
    globals: true,
    maxThreads: os.cpus().length / 2, // 50% of the CPU cores
    minThreads: 1,
    threads: false, // for some reason this is faster than running tests in parallel
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
