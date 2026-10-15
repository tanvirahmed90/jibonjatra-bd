import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Listen on all network addresses (LAN access for mobile phones)
  },
  optimizeDeps: {
    exclude: ['maplibre-gl'],
  },
})
