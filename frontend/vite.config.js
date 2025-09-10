import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: false,
    proxy: {
      '/api': {
        target: 'https://job-portal-4haa.onrender.com',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  define: {
    'import.meta.env.VITE_API_BASE_URL': JSON.stringify('https://job-portal-4haa.onrender.com/api/v1')
  }
})