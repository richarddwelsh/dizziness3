import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: '0.0.0.0', // or host: true
    port: 8000, // or any other port you prefer
    allowedHosts: ['zinc.local']
  },
});