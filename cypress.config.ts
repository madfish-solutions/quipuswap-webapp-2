import { defineConfig } from 'cypress'

export default defineConfig({
  projectId: '4ytwek',
  defaultCommandTimeout: 10000,
  numTestsKeptInMemory: 10,
  retries: {
    runMode: 2,
    openMode: 2,
  },
  env: {
    'cypress-plugin-snapshots': {
      imageConfig: {
        threshold: 0.01,
      },
    },
  },
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
    baseUrl: 'https://qs-develop.vercel.app/',
    excludeSpecPattern: ['**/__snapshots__/*', '**/__image_snapshots__/*'],
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
})
