import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/Signin': {
        target: 'http://localhost:5000', // Adjust this to your backend port
        changeOrigin: true,
      },
      // You can add other API routes that need proxying here
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  }
})