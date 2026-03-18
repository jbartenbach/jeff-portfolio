import { useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { isFirebaseReady } from '../../lib/firebase'
import { getAdminEmailAllowlist } from '../../lib/authAllowlist'

export default function AdminLogin() {
  const { user, loading, signInGoogle, error } = useAuth()
  const nav = useNavigate()

  useEffect(() => {
    if (user) nav('/admin/dashboard', { replace: true })
  }, [user, nav])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400">
        Loading…
      </div>
    )
  }

  if (user) return <Navigate to="/admin/dashboard" replace />

  const missingFb = !isFirebaseReady()
  const missingEmail = getAdminEmailAllowlist().length === 0

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl">
        <h1 className="font-display text-2xl text-white">Admin</h1>
        <p className="mt-2 text-sm text-slate-400">Sign in with your Google account.</p>

        {missingFb && (
          <p className="mt-4 rounded-lg bg-red-950/50 p-3 text-sm text-red-300">
            Add <code className="text-xs">VITE_FIREBASE_*</code> to <code className="text-xs">.env</code>.
          </p>
        )}
        {missingEmail && (
          <p className="mt-4 rounded-lg bg-red-950/50 p-3 text-sm text-red-300">
            Set <code className="text-xs">VITE_ADMIN_EMAIL</code> in <code className="text-xs">.env</code>.
          </p>
        )}

        <button
          type="button"
          onClick={() => signInGoogle()}
          disabled={missingFb || missingEmail}
          className="mt-6 w-full rounded-xl bg-amber-500 py-3 text-sm font-semibold text-slate-950 hover:bg-amber-400 disabled:opacity-40"
        >
          Sign in with Google
        </button>
        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
        <p className="mt-6 text-center text-xs text-slate-600">
          <a href="/" className="text-slate-500 hover:text-slate-400">
            ← Back to site
          </a>
        </p>
      </div>
    </div>
  )
}
