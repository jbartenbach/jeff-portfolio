import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

const rootDir = path.dirname(fileURLToPath(import.meta.url))
const jeffwaDir = path.resolve(rootDir, 'Jeffwa-TestKit')

/** Local-only: serve Jeffwa-TestKit during `npm run dev` — never copied into production `dist`. */
function serveJeffwaTestKitDevOnly(): Plugin {
  const mime: Record<string, string> = {
    '.html': 'text/html; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.md': 'text/markdown; charset=utf-8',
    '.txt': 'text/plain; charset=utf-8',
  }

  return {
    name: 'serve-jeffwa-testkit-dev-only',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith('/Jeffwa-TestKit')) return next()

        const urlPath = decodeURIComponent(req.url.split('?')[0] ?? '')
        const rel = urlPath.replace(/^\/Jeffwa-TestKit\/?/, '') || 'table.html'
        const filePath = path.resolve(jeffwaDir, rel)

        if (!filePath.startsWith(jeffwaDir) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
          return next()
        }

        const ext = path.extname(filePath)
        res.setHeader('Content-Type', mime[ext] ?? 'application/octet-stream')
        fs.createReadStream(filePath).pipe(res)
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), serveJeffwaTestKitDevOnly()],
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
