import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', 
  build: {
    outDir: 'dist' // build folder
  },
  server: {
    open: true,
    proxy: {
      '/api': 'http://localhost:5000', // dev proxy
    },
  },
})
