import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // Le site est servi sous https://<user>.github.io/animation/ → chemin de base.
  base: '/animation/',
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
});
