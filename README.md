# Jeff — portfolio + admin

## Run locally

```bash
cp .env.example .env
# Then follow ADMIN_SETUP.md for Firebase + admin login
npm install
npm run dev
```

- **http://localhost:5173** — portfolio  
- **http://localhost:5173/work** — case study index · **/work/wink** — Wink case study  
- **http://localhost:5173/admin** — admin (Google sign-in)

Case study content and template mapping: **`CASE_STUDIES.md`**.

### `npm run build` vs localhost

| Command | What it does |
|--------|----------------|
| **`npm run dev`** | Starts the **Vite dev server** (usually **http://localhost:5173**). Use this day to day — hot reload, fast. |
| **`npm run build`** | Runs TypeScript check + **production compile** into **`dist/`** only. **Does not start a server** — nothing will open on localhost by itself. |
| **`npm run preview`** | After a successful build, **serves `dist/`** locally (often **http://localhost:4173**) to test the production bundle. |

So: to see the site while developing, run **`npm run dev`**, not `npm run build`.

### Admin not working?

See **`ADMIN_SETUP.md`** (env vars, enable Google Auth, Firestore + **`firestore.rules`**). Restart `npm run dev` after editing `.env`.

## Deploy on Netlify

Step-by-step: **`NETLIFY.md`**. Summary: connect Git → add all `VITE_*` env vars in Netlify → add your `*.netlify.app` domain under Firebase **Authentication → Authorized domains** → redeploy.

`netlify.toml` sets build, Node 20, publish `dist`, and SPA redirects for `/admin`.

## Stack

Vite, React 19, TypeScript, Tailwind, Firebase Auth + Firestore, Open-Meteo (weather, no API key).
