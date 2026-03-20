# Design System Starter

This project now uses a small shared UI layer across homepage + admin.

## Principles

- **Token-first**: define visual decisions once, reuse everywhere.
- **Primitives over one-offs**: use shared components for buttons/fields/cards.
- **Surface-specific styling**: homepage can be expressive, admin can be utilitarian, both should still use the same tokens.

## Tokens (current)

Defined in `src/index.css` under `:root`:

- Radius scale: `--ds-radius-*`
- Spacing scale: `--ds-space-*`
- Elevation: `--ds-shadow-*`

Section-label utility:

- `.ds-section-label` for small uppercase section headings.

## Shared UI primitives (current)

Located in `src/components/ui/`:

- `Button.tsx`
  - Variants: `primary`, `secondary`, `ghost`, `accent`, `danger`
  - Sizes: `sm`, `md`
- `Card.tsx`
- `Field.tsx`
  - `TextField`
  - `TextArea`
  - `SelectField`

## Usage rules

1. Prefer primitives over raw utility strings when available.
2. Add new visual styles to primitives first, then consume in pages.
3. Avoid introducing one-off hex values in components; extend tokens instead.
4. Keep labels consistent with `.ds-section-label` where applicable.

## Next upgrades (recommended)

- Add typography tokens + utility classes (display, heading, body, label).
- Add semantic color tokens (`success`, `warning`, `danger`, `info`) for both themes.
- Add `Badge`, `Tabs`, and `EmptyState` primitives.
- Add Storybook or lightweight preview page for component states.

