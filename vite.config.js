import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',           // Allow external connections (needed on Render)
    port: process.env.PORT || 5173,  // Use Render’s PORT or fallback
    strictPort: true            // Fail if port is in use
  },
  preview: {
    host: '0.0.0.0',
    port: process.env.PORT || 4173
  }
})
