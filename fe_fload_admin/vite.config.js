// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import path from 'path';

// export default defineConfig({
//   plugins: [react()],

//   base: "./", // 👈 thêm dòng này cho production

//   resolve: {
//     alias: {
//       '@': path.resolve(__dirname, './src'),
//     },
//   },
// });
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  base: "./",   // 👈 QUAN TRỌNG NHẤT

  server: {
    proxy: {
      '/api': {
        target: 'https://api-rescue.purintech.id.vn',
        changeOrigin: true,
      },
    },
  },
})