import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5001' //5000 port is for Mac Airplay receiver
    },
    port: 3000,
    host: true
  }
});
