# Jeff — portfolio + admin

## Run locally

```bash
cp .env.example .env
# Then follow ADMIN_SETUP.md for Firebase + admin login
npm install
npm run dev
```

- **http://localhost:5173** — portfolio  
- **http://localhost:5173/admin** — admin (Google sign-in)

### Admin not working?

See **`ADMIN_SETUP.md`** (env vars, enable Google Auth, Firestore + **`firestore.rules`**). Restart `npm run dev` after editing `.env`.

## Deploy on Netlify

Step-by-step: **`NETLIFY.md`**. Summary: connect Git → add all `VITE_*` env vars in Netlify → add your `*.netlify.app` domain under Firebase **Authentication → Authorized domains** → redeploy.

`netlify.toml` sets build, Node 20, publish `dist`, and SPA redirects for `/admin`.

## Stack

Vite, React 19, TypeScript, Tailwind, Firebase Auth + Firestore, Open-Meteo (weather, no API key).
