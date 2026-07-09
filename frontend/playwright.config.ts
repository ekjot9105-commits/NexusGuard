import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  fullyParallel: true,
  retries: 1,
  workers: 1,
  reporter: 'html',
  use: {
    actionTimeout: 0,
    trace: 'on-first-retry',
    baseURL: 'http://localhost:5175',
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    }
  ],
  webServer: {
    command: 'npm run dev -- --port 5175 --strictPort',
    port: 5175,
    reuseExistingServer: false,
  },
});
