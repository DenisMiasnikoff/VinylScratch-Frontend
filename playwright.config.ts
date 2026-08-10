import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false, 
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  timeout: 60000, 
  workers: 1,

  reporter: [['html', { open: 'never' }], ['list']],

  use: {
    baseURL: 'https://vinylscratch-frontend.netlify.app',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  
    
  },

  projects: [
    
    {
      name: 'setup',
      testMatch: /global\.setup\.ts/,
      use: { storageState: undefined }, 
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: 'tests/.auth/user.json',},
      dependencies: ['setup'],
    },
  ],
});