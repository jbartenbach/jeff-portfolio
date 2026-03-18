# Get admin working (`/admin`)

Do this in the **`jeff-portfolio`** folder (not `pointed-app`).

## 1. Create `.env`

```bash
cd jeff-portfolio
cp .env.example .env
```

Open `.env` and fill in:

| Variable | Where to get it |
|----------|-----------------|
| `VITE_FIREBASE_API_KEY` | Firebase → Project settings → Your apps → Web app → `apiKey` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `authDomain` |
| `VITE_FIREBASE_PROJECT_ID` | `projectId` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `storageBucket` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `messagingSenderId` |
| `VITE_FIREBASE_APP_ID` | `appId` |
| `VITE_ADMIN_EMAIL` | **Exact** Gmail you’ll sign in with (lowercase is fine) |
| `VITE_ADMIN_FIRST_NAME` | `Jeff` (for the greeting) |

Save the file.

## 2. Firebase Authentication

1. [Firebase Console](https://console.firebase.google.com) → your project  
2. **Build → Authentication** → **Get started** (if you haven’t)  
3. **Sign-in method** → **Google** → **Enable** → pick support email → **Save**

If you skip this, sign-in fails with **CONFIGURATION_NOT_FOUND**.

## 3. Authorized domains

**Authentication → Settings → Authorized domains**  
Ensure **`localhost`** is listed (it usually is by default).

## 4. Firestore database

1. **Build → Firestore Database** → **Create database**  
2. Choose a region → start in **production mode** (we’ll replace rules next).

## 5. Firestore security rules

**Firestore → Rules** → paste this → **Publish**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /projects/{id} {
      allow read, update, delete: if request.auth != null
        && request.auth.uid == resource.data.ownerUid;
      allow create: if request.auth != null
        && request.auth.uid == request.resource.data.ownerUid;
    }
    match /tasks/{id} {
      allow read, update, delete: if request.auth != null
        && request.auth.uid == resource.data.ownerUid;
      allow create: if request.auth != null
        && request.auth.uid == request.resource.data.ownerUid;
    }
  }
}
```

Without these rules (or while still on “deny all”), the dashboard will stay empty or error.

## 6. Restart the dev server

Env vars are read when Vite starts:

```bash
# Ctrl+C to stop, then:
npm run dev
```

## 7. Sign in

Open **http://localhost:5173/admin** → **Sign in with Google** → use the **same email** as `VITE_ADMIN_EMAIL`.

You should land on the dashboard; the first load seeds **Life** and **Example Project** if you had no projects yet.

---

### Still stuck?

| Symptom | Fix |
|--------|-----|
| Red box: missing `VITE_FIREBASE_*` | `.env` in `jeff-portfolio`, all 6 Firebase keys filled, server restarted |
| `CONFIGURATION_NOT_FOUND` | Authentication → enable **Google** |
| “Account is not allowed” | `VITE_ADMIN_EMAIL` must match the Google account exactly |
| Blank dashboard / permission errors in console | Firestore rules above + database created |
| Popup blocked | Allow popups for localhost |
