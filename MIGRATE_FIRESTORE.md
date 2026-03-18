# Move Firestore to a closer region (Option A)

Firestore latency is dominated by geography. If admin feels slow, the highest-leverage fix is to **create a new Firebase project** with Firestore in a region close to you, then migrate your data.

This repo includes a small migration script that copies your `projects` + `tasks` and remaps `ownerUid` from the old UID to the new UID for the same Google account.

## 0) Create the new Firebase project

In Firebase Console:

- Create a new project (example: `portfolio-fast`)
- Create **Firestore Database** and pick a region close to you
- Enable **Authentication → Google**
- Add authorized domains (localhost + your Netlify domain)
- Publish the same rules (`firestore.rules`)

## 1) Create a web app + update env vars

In the new Firebase project:

- Project settings → Your apps → Web app → copy the config values
- Update your `.env` (local) and Netlify env vars (`VITE_FIREBASE_*`) to point at the new project

## 2) Download service account JSON keys (source + target)

For **each** Firebase project (old and new):

- Firebase / Google Cloud Console → Service Accounts
- Create a service account key (JSON) and download it

Save them locally (do **not** commit), e.g.:

- `./secrets/source-service-account.json`
- `./secrets/target-service-account.json`

## 3) Run the migration script

First install deps:

```bash
npm install
```

Dry run (no writes):

```bash
ADMIN_EMAIL="jbartenbach@gmail.com" \
SOURCE_SERVICE_ACCOUNT_JSON="./secrets/source-service-account.json" \
TARGET_SERVICE_ACCOUNT_JSON="./secrets/target-service-account.json" \
DRY_RUN=true \
node scripts/migrate-firestore.mjs
```

Then do the real write:

```bash
ADMIN_EMAIL="jbartenbach@gmail.com" \
SOURCE_SERVICE_ACCOUNT_JSON="./secrets/source-service-account.json" \
TARGET_SERVICE_ACCOUNT_JSON="./secrets/target-service-account.json" \
DRY_RUN=false \
node scripts/migrate-firestore.mjs
```

## 4) Verify

- Log into the admin UI (local and Netlify) using the **new** Firebase project env vars
- Confirm your projects + tasks exist

## Notes

- The target project will generate **new** document IDs for projects/tasks; tasks are remapped to the new project IDs automatically.
- If you used multiple admin accounts, rerun the script with a different `ADMIN_EMAIL`.

