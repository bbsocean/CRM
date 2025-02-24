import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Alias '@' for src folder
// 'jwt-decode': '/node_modules/jwt-decode/build/jwt-decode.esm.js'
    },
  },
});
