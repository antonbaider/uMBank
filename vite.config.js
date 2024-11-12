import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import fs from 'fs';

// Define paths for certificate files
const certPath = process.env.VITE_SSL_CERT_PATH || '/Users/antonbaider/dev/mthree/mbank/front/nginx/ssl/cert.pem';
const keyPath = process.env.VITE_SSL_KEY_PATH || '/Users/antonbaider/dev/mthree/mbank/front/nginx/ssl/private.key';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Alias "@" to "src" directory
    },
  },
  server: {
    https: {
      key: fs.readFileSync(keyPath),  // Path to your private key
      cert: fs.readFileSync(certPath),     // Path to your certificate
    },
    port: 3000,  // You can change the port if needed
  },
});