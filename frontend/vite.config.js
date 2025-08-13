import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    proxy: {
      // En desarrollo: /api/* -> http://localhost:8080/*
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
