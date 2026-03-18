import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { adminFirstName } from '../../lib/authAllowlist'
import { isDueToday } from '../../lib/dates'
import {
  createProject,
  fetchProjectsForUser,
  fetchTasksForUser,
  loadDashboardData,
  seedInitialData,
} from '../../lib/firestoreOps'
import type { Project, Task } from '../../lib/types'
import { fetchTodayWeather } from '../../lib/weather'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function Dashboard() {
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const [slowLoad, setSlowLoad] = useState(false)
  const [weather, setWeather] = useState<{ highF: number; summary: string } | null>(null)
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [activeNew, setActiveNew] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const firebaseProjectId = import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined

  function fmtErr(err: unknown) {
    const anyErr = err as { code?: string; message?: string }
    if (anyErr?.code && anyErr?.message) return `${anyErr.code}: ${anyErr.message}`
    if (anyErr?.message) return anyErr.message
    return 'Could not load Firestore data.'
  }

  const reload = useCallback(async () => {
    if (!user) return
    const [p, t] = await Promise.all([
      fetchProjectsForUser(user.uid),
      fetchTasksForUser(user.uid),
    ])
    setProjects(p)
    setTasks(t)
  }, [user])

  useEffect(() => {
    if (!user) return
    let cancel = false
    const t = window.setTimeout(() => {
      if (!cancel) setSlowLoad(true)
    }, 6000)
    ;(async () => {
      setDataLoading(true)
      setSlowLoad(false)
      setLoadError(null)
      try {
        const { projects: p, tasks: t } = await loadDashboardData(user.uid)
        if (cancel) return
        setProjects(p)
        setTasks(t)
      } catch (err: unknown) {
        const msg = fmtErr(err)
        if (!cancel) {
          setLoadError(
            `${msg} Check Firestore is created and rules are published (see ADMIN_SETUP.md or firestore.rules).`,
          )
        }
      } finally {
        window.clearTimeout(t)
        if (!cancel) setDataLoading(false)
      }
    })()
    return () => {
      cancel = true
      window.clearTimeout(t)
    }
  }, [user])

  useEffect(() => {
    fetchTodayWeather().then(setWeather)
  }, [])

  const sortedProjects = useMemo(() => {
    return [...projects].sort((a, b) => {
      if (a.isActive !== b.isActive) return a.isActive ? -1 : 1
      return a.title.localeCompare(b.title)
    })
  }, [projects])

  const activeProjectIds = useMemo(
    () => new Set(projects.filter((p) => p.isActive).map((p) => p.id)),
    [projects],
  )

  const todayTasks = useMemo(() => {
    return tasks.filter(
      (t) =>
        activeProjectIds.has(t.projectId) &&
        (isDueToday(t.dueDate) || t.kanbanColumn === 'today'),
    )
  }, [tasks, activeProjectIds])

  const name = adminFirstName()

  async function onCreateProject(e: React.FormEvent) {
    e.preventDefault()
    if (!user || !title.trim()) return
    await createProject(user.uid, {
      title: title.trim(),
      description: desc.trim(),
      isActive: activeNew,
    })
    setTitle('')
    setDesc('')
    setActiveNew(true)
    await reload()
  }

  if (loadError) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-900">
          <h1 className="text-lg font-semibold">Admin data could not load</h1>
          <p className="mt-2 text-sm">{loadError}</p>
          <p className="mt-3 text-xs text-red-800/80">
            Firebase project: <code className="rounded bg-red-100 px-1 py-0.5">{firebaseProjectId ?? '(missing)'}</code>
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => reload()}
              className="rounded-lg bg-red-900 px-3 py-2 text-xs font-semibold text-white hover:bg-red-800"
            >
              Retry
            </button>
            <button
              type="button"
              onClick={async () => {
                if (!user) return
                setDataLoading(true)
                setLoadError(null)
                try {
                  await seedInitialData(user.uid)
                  await reload()
                } catch (e) {
                  setLoadError(
                    `${fmtErr(e)} Check Firestore is created and rules are published (see ADMIN_SETUP.md or firestore.rules).`,
                  )
                } finally {
                  setDataLoading(false)
                }
              }}
              className="rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-900 hover:bg-red-50"
            >
              Seed demo data + retry
            </button>
          </div>
          <p className="mt-4 text-sm">
            Follow <strong>ADMIN_SETUP.md</strong> in the jeff-portfolio folder (Firestore + rules).
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="font-display text-3xl text-slate-900">
              {greeting()}, {name}
            </h1>
            <p className="mt-1 text-sm text-slate-500">{new Date().toLocaleDateString(undefined, {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Weather today
              </h2>
              {weather ? (
                <p className="mt-2 text-2xl font-semibold text-slate-900">
                  {weather.highF}°F
                  <span className="ml-2 text-base font-normal text-slate-600">{weather.summary}</span>
                </p>
              ) : (
                <p className="mt-2 text-sm text-slate-500">Couldn&apos;t load weather.</p>
              )}
            </div>
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Meetings today
              </h2>
              <p className="mt-3 text-sm text-slate-400">No meetings connected yet. (Google Calendar next.)</p>
            </div>
          </div>

          {dataLoading ? (
            <div className="space-y-3" aria-busy="true" aria-label="Loading dashboard data">
              {slowLoad && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
                  <p className="text-sm font-medium">Still loading…</p>
                  <p className="mt-1 text-xs text-amber-900/80">
                    If this never finishes, it usually means the deployed site is pointing at a different Firebase project
                    (or Firestore/rules aren’t set up). Firebase project:{' '}
                    <code className="rounded bg-amber-100 px-1 py-0.5">{firebaseProjectId ?? '(missing)'}</code>
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => reload()}
                      className="rounded-lg bg-amber-600 px-3 py-2 text-xs font-semibold text-white hover:bg-amber-500"
                    >
                      Retry
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        if (!user) return
                        try {
                          await seedInitialData(user.uid)
                          await reload()
                        } catch (e) {
                          setLoadError(
                            `${fmtErr(e)} Check Firestore is created and rules are published (see ADMIN_SETUP.md or firestore.rules).`,
                          )
                        }
                      }}
                      className="rounded-lg border border-amber-200 bg-white px-3 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-100"
                    >
                      Seed demo data
                    </button>
                  </div>
                </div>
              )}
              <div className="animate-pulse space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="h-4 w-32 rounded bg-slate-200" />
                <div className="mt-4 h-10 rounded-lg bg-slate-100" />
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="h-4 w-24 rounded bg-slate-200" />
                <div className="mt-4 space-y-3">
                  <div className="h-12 rounded-lg bg-slate-100" />
                  <div className="h-12 rounded-lg bg-slate-100" />
                  <div className="h-12 rounded-lg bg-slate-100" />
                </div>
              </div>
            </div>
            </div>
          ) : (
            <>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-slate-900">Tasks for today</h2>
                  <Link
                    to="/admin/tasks"
                    className="text-sm font-medium text-amber-700 hover:text-amber-800"
                  >
                    Open tasks board →
                  </Link>
                </div>
                {todayTasks.length === 0 ? (
                  <p className="mt-3 text-sm text-slate-500">Nothing flagged for today.</p>
                ) : (
                  <ul className="mt-3 space-y-2">
                    {todayTasks.map((t) => {
                      const proj = projects.find((p) => p.id === t.projectId)
                      return (
                        <li key={t.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
                          <Link to={`/admin/projects/${t.projectId}`} className="font-medium text-slate-800 hover:text-amber-800">
                            {t.title}
                          </Link>
                          <span className="text-xs text-slate-500">{proj?.title}</span>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-sm font-semibold text-slate-900">Projects</h2>
                <p className="mt-1 text-xs text-slate-500">Active projects appear first.</p>
                <ul className="mt-4 divide-y divide-slate-100">
                  {sortedProjects.map((p) => (
                    <li key={p.id}>
                      <Link
                        to={`/admin/projects/${p.id}`}
                        className="flex items-center justify-between py-3 hover:bg-slate-50/80 -mx-2 px-2 rounded-lg"
                      >
                        <span className="font-medium text-slate-900">{p.title}</span>
                        <span
                          className={
                            p.isActive
                              ? 'rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800'
                              : 'rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600'
                          }
                        >
                          {p.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>

                <form onSubmit={onCreateProject} className="mt-6 border-t border-slate-100 pt-6 space-y-3">
                  <h3 className="text-xs font-semibold uppercase text-slate-500">New project</h3>
                  <input
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <textarea
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    placeholder="Description"
                    rows={2}
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                  />
                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={activeNew}
                      onChange={(e) => setActiveNew(e.target.checked)}
                    />
                    Active project
                  </label>
                  <button
                    type="submit"
                    className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                  >
                    Create project
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
