# Deploy to Netlify

## 1. Push code to GitHub (or GitLab / Bitbucket)

Netlify deploys from Git. If this folder isn’t a repo yet:

```bash
cd jeff-portfolio
git init
git add .
git commit -m "Initial commit"
```

Create an empty repo on GitHub, then:

```bash
git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git
git branch -M main
git push -u origin main
```

`.env` is gitignored—**never commit** Firebase keys.

## 2. Create the site on Netlify

1. Log in at [app.netlify.com](https://app.netlify.com).
2. **Add new site → Import an existing project**.
3. Connect GitHub and pick your repo.
4. Netlify should auto-detect settings from **`netlify.toml`**:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Click **Deploy** (it will fail until step 3—expected).

## 3. Environment variables (required)

**Site configuration → Environment variables → Add a variable** (or **Add multiple**).

Add **every** variable from your local `.env`, same names and values:

| Name | Notes |
|------|--------|
| `VITE_FIREBASE_API_KEY` | From Firebase web app config |
| `VITE_FIREBASE_AUTH_DOMAIN` | |
| `VITE_FIREBASE_PROJECT_ID` | |
| `VITE_FIREBASE_STORAGE_BUCKET` | |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | |
| `VITE_FIREBASE_APP_ID` | |
| `VITE_ADMIN_EMAIL` | Gmail that may sign in to `/admin` on production |
| `VITE_ADMIN_FIRST_NAME` | Shown in dashboard greeting |
| `VITE_WEATHER_LAT` | Optional (e.g. Burbank) |
| `VITE_WEATHER_LON` | Optional |

Then **Deploys → Trigger deploy → Clear cache and deploy site** so the build picks them up.

## 4. Firebase: authorize your Netlify URL

1. [Firebase Console](https://console.firebase.google.com) → your project.
2. **Authentication → Settings → Authorized domains**.
3. **Add domain**: your Netlify hostname, e.g. `random-name-123.netlify.app`.
4. If you add a **custom domain** in Netlify later, add that domain here too.

Without this step, Google sign-in on the live site will fail.

## 5. Smoke test

Open `https://YOUR-SITE.netlify.app` → portfolio.

Open `https://YOUR-SITE.netlify.app/admin` → sign in with the same Google account as `VITE_ADMIN_EMAIL`.

---

### Build fails on Netlify?

- **Logs**: Deploy log shows TypeScript or missing env errors.
- **Missing `VITE_*`**: Any empty required var can break the build or runtime—double-check all keys from `.env.example`.
- **Node version**: This repo pins Node **20** in `netlify.toml` for Vite 8.

### Deploy previews

Each PR gets a URL like `deploy-preview-42--yoursite.netlify.app`. To use **Admin** on previews, add that pattern to Firebase authorized domains—or test admin only on the main production URL.
