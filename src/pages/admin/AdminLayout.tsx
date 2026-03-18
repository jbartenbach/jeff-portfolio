import { Link, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function AdminLayout() {
  const { user, signOutUser } = useAuth()

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link to="/admin/dashboard" className="text-slate-900 hover:text-amber-700">
              Dashboard
            </Link>
            <Link to="/admin/tasks" className="text-slate-600 hover:text-amber-700">
              Tasks board
            </Link>
            <Link to="/" className="text-slate-400 hover:text-slate-600">
              View site
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-slate-500 sm:inline">{user?.email}</span>
            <button
              type="button"
              onClick={() => signOutUser()}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>
      <Outlet />
    </div>
  )
}
