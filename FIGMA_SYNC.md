# Figma Sync Workflow

This project can now generate Figma-ready design metadata from code.

## Generated files

Run:

```bash
npm run design:sync
```

Outputs in `design/`:

- `design-tokens.json` – canonical tokens for code + docs
- `figma-variables.json` – import-friendly token JSON for Figma plugins
- `component-manifest.json` – UI component prop/variant map from `src/components/ui/*.tsx`

## Import into Figma

### Tokens / variables

Use **Tokens Studio** (or equivalent) in Figma:

1. Import `design/figma-variables.json`
2. Map groups to Variable collections:
   - `color`
   - `space`
   - `radius`
   - `shadow`
   - `typography`
3. Publish/Apply variables in your Figma library file

### Components

Use `design/component-manifest.json` as your build sheet:

- Build component sets with matching properties:
  - `Button.variant`, `Button.size`
  - `Badge.variant`, `Badge.size`
  - `Field` kind (`TextField`, `TextArea`, `SelectField`)
- Apply variable tokens to fills/strokes/type/effects.

## Change loop (Figma ↔ Code)

1. **Token changes**: edit code token source (`src/index.css` vars or token script inputs), run `npm run design:sync`, re-import variables in Figma.
2. **Component changes in Figma**: update variants, document intent, then implement in `src/components/ui/*`.
3. **Component API changes in code**: run `npm run design:components` and update Figma properties to match the new manifest.

## Source of truth

- **Design tokens**: code (`design-tokens.json` generated from code inputs)
- **UI behavior/state logic**: code (`src/components/ui`)
- **Layout exploration and visual composition**: Figma

