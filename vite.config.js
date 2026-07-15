import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    // @reduxjs/toolkit v2 ships an exports map that some bundlers struggle with.
    // recharts depends on it, so we alias directly to the pre-built CJS bundle
    // using an absolute path to bypass Vite's strict exports-map validation.
    alias: {
      '@reduxjs/toolkit': path.resolve(__dirname, 'node_modules/@reduxjs/toolkit/dist/cjs/index.js'),
    },
  },

  optimizeDeps: {
    // Force Vite to pre-bundle recharts and its redux dependency together,
    // avoiding the broken exports-map resolution during dep pre-bundling.
    include: [
      'recharts',
      '@reduxjs/toolkit',
    ],
  },

  server: {
    port: 5173,
    proxy: {
      // Forward /api/* and /health to the FastAPI backend
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
      '/health': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})

