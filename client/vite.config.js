import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './'
  },
  server: {
    proxy: {
       '/api': 'http://localhost:3001'
    }
  }
})