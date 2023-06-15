/* eslint-disable @typescript-eslint/no-var-requires */
const baseConfig = require('./jest.config');

module.exports = {
  ...baseConfig,
  testRegex: '.e2e-spec.ts$',
  setupFilesAfterEnv: ['./test/jest.setup.ts'],
};
