import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
