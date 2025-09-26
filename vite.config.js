import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/super-tic-tac-toe/',
  build: {
    rollupOptions: {
      input: 'index-react.html'
    }
  },
  server: {
    open: 'index-react.html'
  }
})
