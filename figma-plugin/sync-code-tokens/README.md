# Jeff Portfolio — Sync variables from JSON

Figma plugin that reads **`design/figma-variables.json`** (same shape produced by `npm run design:sync`) and **creates or updates** local variables in a collection named **`Jeff Portfolio — Code`**.

## Behavior

| JSON group   | Figma variable type | Notes                                      |
|-------------|---------------------|--------------------------------------------|
| `color`     | **COLOR**           | Hex strings `#RRGGBB`                      |
| Other keys  | **COLOR** only if value looks like `#hex` | Otherwise **STRING** (radius, space, shadow, typography) |

Variable names use slashes so Figma groups them: `color/slate900`, `radius/md`, `space/4`, etc.

Existing variables with the **same name** get **updated**. If the **type** changed (e.g. you switched a token from hex to a string), the plugin **removes and recreates** that variable.

## Install (development)

1. In Figma: **Plugins → Development → Import plugin from manifest…**
2. Choose `figma-plugin/sync-code-tokens/manifest.json` in this repo.
3. Run **Plugins → Development → Jeff Portfolio — Sync variables from JSON**.

## Use

1. In the repo: `npm run design:sync` (refreshes `design/figma-variables.json`).
2. Open `design/figma-variables.json`, copy **all** JSON.
3. Paste into the plugin textarea → **Apply / update variables**.
4. In Figma: **Local variables** (e.g. from the variables panel) — open collection **Jeff Portfolio — Code**.

## Implementation note

The manifest uses `"documentAccess": "dynamic-page"`, so the plugin uses **`getLocalVariableCollectionsAsync`** and **`getLocalVariablesAsync`** (the sync `getLocal*` APIs are not allowed in that mode).

## Limits

- **Paste only** — Figma plugins cannot read your disk; you must paste JSON (or extend the plugin with network access if you host the file).
- **Single mode** — values apply to the collection’s default mode (no multi-brand modes in this v1).
