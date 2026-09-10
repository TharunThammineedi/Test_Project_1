const { defineConfig } = require('@playwright/test');

 module.exports = defineConfig({
  testDir: '.',
  testMatch: '**/*.spec.js',
  testIgnore: ['**/helpers/**', '**/fixtures/**'],
  globalSetup: require.resolve('./global-setup.js'),
  globalTeardown: require.resolve('./global-teardown.js'),
  fullyParallel: false,
  workers: 1,
  retries: 2,
  timeout: 360000,
  expect: {
    timeout: 120000,
  },
  reporter: [
    ['line'],
    ['json', { outputFile: 'test-results/report.json' }],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['allure-playwright', { resultsDir: 'allure-results' }],
  ],
  use: {
    actionTimeout: 60000,
    navigationTimeout: 60000,
    headless: process.env.HEADLESS !== 'false',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on',
    launchOptions: {
      slowMo: process.env.CI ? 1500 : 3000,
    },
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'msedge', use: { browserName: 'chromium', channel: 'msedge' } },
    { name: 'firefox', use: { browserName: 'firefox' } },
    { name: 'webkit', use: { browserName: 'webkit' } },
  ],
});
