import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import { copyFileSync } from 'fs';
import react from '@vitejs/plugin-react';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  build: {
    emptyOutDir: false, // Không xoá dist trước khi build
  },
  plugins: [
    react(),
    {
      name: 'copy-readme',
      closeBundle() {
        copyFileSync('dist/README.md', 'dist/README.md'); // Copy lại file README.md sau khi build
      },
    },
  ],
  base: '/JinStore/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Trỏ đến src
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@routes': path.resolve(__dirname, 'src/routes'),
      '@json': path.resolve(__dirname, 'src/json'),
      '@services': path.resolve(__dirname, 'src/services'),
    },
  },
});
