import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const outDir = path.join(root, 'design')
fs.mkdirSync(outDir, { recursive: true })

function parseRootVars(cssText) {
  const rootMatch = cssText.match(/:root\s*\{([\s\S]*?)\}/)
  if (!rootMatch) return {}
  const body = rootMatch[1]
  const vars = {}
  for (const line of body.split('\n')) {
    const m = line.trim().match(/^--([a-z0-9-]+)\s*:\s*([^;]+);$/i)
    if (!m) continue
    vars[m[1]] = m[2].trim()
  }
  return vars
}

function toFigmaTokens(tokens) {
  const out = {}
  for (const [group, entries] of Object.entries(tokens)) {
    out[group] = {}
    for (const [key, value] of Object.entries(entries)) {
      out[group][key] = { $type: 'string', $value: String(value) }
    }
  }
  return out
}

const cssPath = path.join(root, 'src', 'index.css')
const css = fs.readFileSync(cssPath, 'utf8')
const vars = parseRootVars(css)

const tokens = {
  radius: {
    md: vars['ds-radius-md'] ?? '0.75rem',
    lg: vars['ds-radius-lg'] ?? '1rem',
    xl: vars['ds-radius-xl'] ?? '1.25rem',
  },
  space: {
    1: vars['ds-space-1'] ?? '0.25rem',
    2: vars['ds-space-2'] ?? '0.5rem',
    3: vars['ds-space-3'] ?? '0.75rem',
    4: vars['ds-space-4'] ?? '1rem',
    5: vars['ds-space-5'] ?? '1.25rem',
    6: vars['ds-space-6'] ?? '1.5rem',
  },
  shadow: {
    sm: vars['ds-shadow-sm'] ?? '0 1px 2px rgba(2, 6, 23, 0.06)',
    md: vars['ds-shadow-md'] ?? '0 8px 20px rgba(2, 6, 23, 0.08)',
  },
  color: {
    slate900: '#0f172a',
    slate800: '#1e293b',
    slate700: '#334155',
    slate600: '#475569',
    slate500: '#64748b',
    slate300: '#cbd5e1',
    slate200: '#e2e8f0',
    slate100: '#f1f5f9',
    white: '#ffffff',
    amber600: '#d97706',
    amber500: '#f59e0b',
    amber100: '#fef3c7',
    red900: '#7f1d1d',
    red100: '#fee2e2',
    blue100: '#dbeafe',
    blue900: '#1e3a8a',
    emerald100: '#d1fae5',
    emerald800: '#065f46',
  },
  typography: {
    fontSans: 'DM Sans, system-ui, sans-serif',
    fontDisplay: 'Instrument Serif, Georgia, serif',
    labelXs: '12px/16px 600',
    bodySm: '14px/20px 400',
    bodyMd: '16px/24px 400',
    headingLg: '30px/36px 600',
  },
}

const figmaTokens = toFigmaTokens(tokens)

fs.writeFileSync(
  path.join(outDir, 'design-tokens.json'),
  `${JSON.stringify(tokens, null, 2)}\n`,
)
fs.writeFileSync(
  path.join(outDir, 'figma-variables.json'),
  `${JSON.stringify(figmaTokens, null, 2)}\n`,
)

console.log('Wrote design/design-tokens.json')
console.log('Wrote design/figma-variables.json')

