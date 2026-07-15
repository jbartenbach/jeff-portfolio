import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // If 5173 is already taken (stale `npm run dev`), Vite uses the next free port — check the terminal URL.
    strictPort: false,
    open: true,
    // Proxy HOS Codex test API for the Jeffwa-TestKit table viewer (avoids browser CORS).
    proxy: {
      '/hoscodex': {
        target: 'https://test.api.hoscodex.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/hoscodex/, ''),
      },
    },
  },
  build: {
    // Vite 8 uses Rolldown; it can warn when plugin time dominates the link phase.
    // `externalize-deps` often triggers this even on healthy builds — safe to silence.
    // See https://rolldown.rs/options/checks#plugintimings
    rolldownOptions: {
      checks: {
        pluginTimings: false,
      },
    },
  },
  // Ensure Tailwind runs (Vite 8 + some setups skip postcss.config.js)
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()],
    },
  },
})
