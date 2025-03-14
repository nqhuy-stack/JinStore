import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import react from '@vitejs/plugin-react';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  build: {
    emptyOutDir: true, // Để đảm bảo thư mục dist sạch khi build
  },
  plugins: [react()],
  base: '/JinStore/', // Đảm bảo tên repo đúng
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Dùng @ thay vì ~
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@routes': path.resolve(__dirname, 'src/routes'),
      '@json': path.resolve(__dirname, 'src/json'),
    },
  },
});
