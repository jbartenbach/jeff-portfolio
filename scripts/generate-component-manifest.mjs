import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const uiDir = path.join(root, 'src', 'components', 'ui')
const outDir = path.join(root, 'design')
fs.mkdirSync(outDir, { recursive: true })

function read(file) {
  return fs.readFileSync(path.join(uiDir, file), 'utf8')
}

function parseUnionType(src, typeName) {
  const m = src.match(new RegExp(`type\\s+${typeName}\\s*=\\s*([^\\n]+)`))
  if (!m) return []
  return m[1]
    .split('|')
    .map((x) => x.replace(/['";]/g, '').trim())
    .filter(Boolean)
}

function parseDefaults(src, names) {
  const out = {}
  for (const n of names) {
    const m = src.match(new RegExp(`${n}\\s*=\\s*'([^']+)'`))
    if (m) out[n] = m[1]
  }
  return out
}

const buttonSrc = read('Button.tsx')
const badgeSrc = read('Badge.tsx')
const fieldSrc = read('Field.tsx')
const cardSrc = read('Card.tsx')
const tabsSrc = read('Tabs.tsx')
const modalPath = path.join(root, 'src', 'components', 'Modal.tsx')
const modalSrc = fs.existsSync(modalPath) ? fs.readFileSync(modalPath, 'utf8') : ''

const manifest = {
  generatedAt: new Date().toISOString(),
  source: 'src/components/ui/*.tsx',
  components: {
    Button: {
      file: 'src/components/ui/Button.tsx',
      props: {
        variant: parseUnionType(buttonSrc, 'Variant'),
        size: parseUnionType(buttonSrc, 'Size'),
      },
      defaults: parseDefaults(buttonSrc, ['variant', 'size']),
      notes: 'Map to Figma component set: Button / variant / size / state.',
    },
    Badge: {
      file: 'src/components/ui/Badge.tsx',
      props: {
        variant: parseUnionType(badgeSrc, 'Variant'),
        size: parseUnionType(badgeSrc, 'Size'),
      },
      defaults: parseDefaults(badgeSrc, ['variant', 'size']),
      notes: 'Map to Figma component set: Badge / variant / size.',
    },
    Field: {
      file: 'src/components/ui/Field.tsx',
      exports: ['TextField', 'TextArea', 'SelectField'],
      baseClass:
        (fieldSrc.match(/const base = '([^']+)'/) || [])[1] ??
        'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm',
      notes: 'Use one Figma field base with kind=Text|Textarea|Select.',
    },
    Card: {
      file: 'src/components/ui/Card.tsx',
      baseClass:
        (cardSrc.match(/'rounded-2xl[^']+'/) || [])[0]?.replace(/'/g, '') ?? '',
      notes: 'Use as shared surface primitive.',
    },
    Tabs: {
      file: 'src/components/ui/Tabs.tsx',
      props: ['defaultValue', 'value', 'onValueChange'],
      notes: 'Primitive placeholder; refine when tabs are used in screens.',
    },
    Modal: modalSrc
      ? {
          file: 'src/components/Modal.tsx',
          props: ['open', 'title', 'onClose'],
          notes: 'Shared overlay/dialog shell.',
        }
      : undefined,
  },
}

// remove undefined optional entries
for (const k of Object.keys(manifest.components)) {
  if (manifest.components[k] === undefined) delete manifest.components[k]
}

fs.writeFileSync(
  path.join(outDir, 'component-manifest.json'),
  `${JSON.stringify(manifest, null, 2)}\n`,
)
console.log('Wrote design/component-manifest.json')

