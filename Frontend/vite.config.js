import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,        // Accept connections from outside the container
    port: 5173,
    watch: {
      usePolling: true // Required for Windows/WSL filesystem event detection
    },
    hmr: {
      clientPort: 5173 // Forces HMR websocket to use the exposed tunnel port
    }
  }
})
