import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite config: dev proxy for /api to avoid CORS during local development
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://cursos-online-api.desarrollo-software.xyz',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  }
})
