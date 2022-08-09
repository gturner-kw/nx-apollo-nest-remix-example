import { defineConfig } from 'cypress';
import { nxE2EPreset } from '@nrwl/cypress/plugins/cypress-preset';

const config = defineConfig({
  e2e: {
    ...nxE2EPreset(__dirname),
    baseUrl: 'http://localhost:3000',
  },
});

console.log('config:', config);

export default config;
