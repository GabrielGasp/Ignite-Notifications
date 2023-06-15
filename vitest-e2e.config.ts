import baseConfig from './vitest.config';
import { mergeConfig, defineConfig } from 'vitest/config';

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      include: ['**/*.e2e-spec.ts'],
      setupFiles: ['./test/vitest.setup.ts'],
    },
  }),
);
