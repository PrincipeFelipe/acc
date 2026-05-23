import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        // Redirige las peticiones locales de /api a la carpeta de tu API en XAMPP
        target: 'http://localhost/acc',
        changeOrigin: true,
        secure: false
      }
    }
  }
})

