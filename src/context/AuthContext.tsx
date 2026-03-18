import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth'
import { getAuthInstance, googleProvider, isFirebaseReady } from '../lib/firebase'
import { isAllowedAdminEmail } from '../lib/authAllowlist'

type Ctx = {
  user: User | null
  loading: boolean
  signInGoogle: () => Promise<void>
  signOutUser: () => Promise<void>
  error: string | null
}

const AuthContext = createContext<Ctx | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const auth = getAuthInstance()
    if (!auth) {
      setLoading(false)
      return
    }
    return onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
  }, [])

  const signInGoogle = useCallback(async () => {
    setError(null)
    if (!isFirebaseReady()) {
      setError('Missing Firebase env vars.')
      return
    }
    try {
      const auth = getAuthInstance()
      if (!auth) return
      const res = await signInWithPopup(auth, googleProvider)
      const email = res.user.email
      if (!isAllowedAdminEmail(email)) {
        await signOut(auth)
        setError(`Signed in as ${email}, but that account is not allowed.`)
        return
      }
    } catch (e: unknown) {
      const fe = e as { code?: string; message?: string }
      if (fe.code === 'auth/configuration-not-found' || fe.message?.includes('CONFIGURATION_NOT_FOUND')) {
        setError(
          'Firebase Auth is not ready: Firebase Console → Authentication → Get started, then enable Google. See ADMIN_SETUP.md',
        )
        return
      }
      if (fe.code === 'auth/popup-blocked') {
        setError('Popup was blocked. Allow popups for this site and try again.')
        return
      }
      if (fe.code === 'auth/unauthorized-domain') {
        setError(
          'Domain not authorized: Firebase → Authentication → Settings → Authorized domains (include localhost).',
        )
        return
      }
      if (fe.code && fe.message) {
        setError(`${fe.code}: ${fe.message}`)
        return
      }
      setError(e instanceof Error ? e.message : 'Sign-in failed.')
    }
  }, [])

  const signOutUser = useCallback(async () => {
    const auth = getAuthInstance()
    if (auth) await signOut(auth)
  }, [])

  const v = useMemo(
    () => ({ user, loading, signInGoogle, signOutUser, error }),
    [user, loading, signInGoogle, signOutUser, error],
  )

  return <AuthContext.Provider value={v}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const c = useContext(AuthContext)
  if (!c) throw new Error('useAuth outside provider')
  return c
}
