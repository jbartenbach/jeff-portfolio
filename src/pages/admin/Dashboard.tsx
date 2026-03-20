import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { adminFirstName } from '../../lib/authAllowlist'
import { isDueToday } from '../../lib/dates'
import {
  createProject,
  createTask,
  seedInitialData,
  subscribeProjectsForUser,
  subscribeTasksForUser,
} from '../../lib/firestoreOps'
import type { KanbanColumn, Project, Task } from '../../lib/types'
import { KANBAN_COLUMNS } from '../../lib/types'
import { fetchTodayWeather } from '../../lib/weather'
import Modal from '../../components/Modal'
import { Timestamp } from 'firebase/firestore'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import { SelectField, TextArea, TextField } from '../../components/ui/Field'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function Dashboard() {
  const { user, connectGoogleCalendar } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const [slowLoad, setSlowLoad] = useState(false)
  const [weather, setWeather] = useState<{ highF: number; summary: string } | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [projModalOpen, setProjModalOpen] = useState(false)
  const [taskModalOpen, setTaskModalOpen] = useState(false)

  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [activeNew, setActiveNew] = useState(true)

  const [taskTitle, setTaskTitle] = useState('')
  const [taskDesc, setTaskDesc] = useState('')
  const [taskProjectId, setTaskProjectId] = useState<string>('')
  const [taskCol, setTaskCol] = useState<KanbanColumn>('unstarted')
  const [taskDueEnabled, setTaskDueEnabled] = useState(false)
  const [taskDue, setTaskDue] = useState('') // YYYY-MM-DD

  const [calToken, setCalToken] = useState<string | null>(null)
  const [calLoading, setCalLoading] = useState(false)
  const [calError, setCalError] = useState<string | null>(null)
  const [events, setEvents] = useState<{ start: string; title: string }[]>([])

  const firebaseProjectId = import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined

  function fmtErr(err: unknown) {
    const anyErr = err as { code?: string; message?: string }
    if (anyErr?.code && anyErr?.message) return `${anyErr.code}: ${anyErr.message}`
    if (anyErr?.message) return anyErr.message
    return 'Could not load Firestore data.'
  }

  const reload = useCallback(async () => {
    // Subscriptions keep data up to date; keep this for any manual retry.
    if (!user) return
    setDataLoading(true)
    setSlowLoad(false)
    setLoadError(null)
    try {
      await seedInitialData(user.uid)
    } catch (e) {
      setLoadError(
        `${fmtErr(e)} Check Firestore is created and rules are published (see ADMIN_SETUP.md or firestore.rules).`,
      )
    } finally {
      setDataLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (!user) return
    let cancel = false
    let stopP: (() => void) | null = null
    let stopT: (() => void) | null = null
    const t = window.setTimeout(() => {
      if (!cancel) setSlowLoad(true)
    }, 6000)
    ;(async () => {
      setDataLoading(true)
      setSlowLoad(false)
      setLoadError(null)
      try {
        await seedInitialData(user.uid)
        if (cancel) return

        let gotP = false
        let gotT = false
        stopP = subscribeProjectsForUser(
          user.uid,
          (p) => {
            gotP = true
            setProjects(p)
            if (gotP && gotT) setDataLoading(false)
          },
          (e) => {
            setLoadError(
              `${fmtErr(e)} Check Firestore is created and rules are published (see ADMIN_SETUP.md or firestore.rules).`,
            )
            setDataLoading(false)
          },
        )
        stopT = subscribeTasksForUser(
          user.uid,
          (tt) => {
            gotT = true
            setTasks(tt)
            if (gotP && gotT) setDataLoading(false)
          },
          (e) => {
            setLoadError(
              `${fmtErr(e)} Check Firestore is created and rules are published (see ADMIN_SETUP.md or firestore.rules).`,
            )
            setDataLoading(false)
          },
        )
      } catch (err: unknown) {
        const msg = fmtErr(err)
        if (!cancel) {
          setLoadError(
            `${msg} Check Firestore is created and rules are published (see ADMIN_SETUP.md or firestore.rules).`,
          )
        }
      } finally {
        window.clearTimeout(t)
        // dataLoading is cleared by snapshot callbacks once both have fired
      }
    })()
    return () => {
      cancel = true
      window.clearTimeout(t)
      stopP?.()
      stopT?.()
    }
  }, [user])

  useEffect(() => {
    fetchTodayWeather().then(setWeather)
  }, [])

  useEffect(() => {
    if (!taskProjectId && projects.length > 0) setTaskProjectId(projects[0].id)
  }, [projects, taskProjectId])

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
    setProjModalOpen(false)
  }

  async function onCreateTask(e: React.FormEvent) {
    e.preventDefault()
    if (!user || !taskTitle.trim() || !taskProjectId) return
    const maxOrder = tasks
      .filter((t) => t.projectId === taskProjectId)
      .reduce((m, t) => Math.max(m, t.orderIndex), -1)
    const dueDate =
      taskDueEnabled && taskDue
        ? Timestamp.fromDate(new Date(`${taskDue}T00:00:00`))
        : null
    await createTask(user.uid, {
      projectId: taskProjectId,
      title: taskTitle.trim(),
      description: taskDesc.trim(),
      dueDate,
      orderIndex: maxOrder + 1,
      kanbanColumn: taskCol,
    })
    setTaskTitle('')
    setTaskDesc('')
    setTaskCol('unstarted')
    setTaskDueEnabled(false)
    setTaskDue('')
    setTaskModalOpen(false)
  }

  async function loadCalendarToday(token: string) {
    setCalLoading(true)
    setCalError(null)
    try {
      const start = new Date()
      start.setHours(0, 0, 0, 0)
      const end = new Date()
      end.setHours(23, 59, 59, 999)
      const qs = new URLSearchParams({
        timeMin: start.toISOString(),
        timeMax: end.toISOString(),
        singleEvents: 'true',
        orderBy: 'startTime',
        maxResults: '10',
      })
      const res = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?${qs.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } },
      )
      if (!res.ok) throw new Error(`Calendar API error: ${res.status}`)
      const json = (await res.json()) as {
        items?: { summary?: string; start?: { dateTime?: string; date?: string } }[]
      }
      const list = (json.items ?? []).map((i) => ({
        title: i.summary ?? '(Untitled)',
        start: i.start?.dateTime ?? i.start?.date ?? '',
      }))
      setEvents(list)
    } catch (e) {
      setCalError(e instanceof Error ? e.message : 'Could not load calendar.')
    } finally {
      setCalLoading(false)
    }
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
            <Card>
              <h2 className="ds-section-label">Weather today</h2>
              {weather ? (
                <p className="mt-2 text-2xl font-semibold text-slate-900">
                  {weather.highF}°F
                  <span className="ml-2 text-base font-normal text-slate-600">{weather.summary}</span>
                </p>
              ) : (
                <p className="mt-2 text-sm text-slate-500">Couldn&apos;t load weather.</p>
              )}
            </Card>
            <Card>
              <h2 className="ds-section-label">Calendar today</h2>
              {!calToken ? (
                <div className="mt-3 space-y-2">
                  <p className="text-sm text-slate-500">
                    Connect Google Calendar to show today’s events.
                  </p>
                  <Button
                    type="button"
                    size="md"
                    onClick={async () => {
                      setCalError(null)
                      const token = await connectGoogleCalendar()
                      if (!token) {
                        setCalError('Could not get a Calendar access token. (Enable Google Calendar API + consent screen.)')
                        return
                      }
                      setCalToken(token)
                      await loadCalendarToday(token)
                    }}
                  >
                    Connect calendar
                  </Button>
                  {calError ? <p className="text-xs text-red-600">{calError}</p> : null}
                </div>
              ) : (
                <div className="mt-3">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => loadCalendarToday(calToken)}
                      className="text-xs font-semibold text-amber-700 hover:text-amber-800"
                      disabled={calLoading}
                    >
                      {calLoading ? 'Refreshing…' : 'Refresh'}
                    </button>
                  </div>
                  {calError ? <p className="mt-2 text-xs text-red-600">{calError}</p> : null}
                  {events.length === 0 ? (
                    <p className="mt-2 text-sm text-slate-500">No events found.</p>
                  ) : (
                    <ul className="mt-2 space-y-1">
                      {events.map((e, idx) => (
                        <li key={idx} className="text-sm text-slate-700">
                          <span className="font-medium text-slate-900">{e.title}</span>
                          {e.start ? <span className="ml-2 text-xs text-slate-500">{new Date(e.start).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span> : null}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </Card>
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
              <Card>
                <div className="flex items-center justify-between">
                  <h2 className="ds-section-label">Tasks today</h2>
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
              </Card>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="ds-section-label">Projects</h2>
                  <p className="mt-1 text-xs text-slate-500">Each project is its own card.</p>
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="secondary" size="sm" onClick={() => setTaskModalOpen(true)}>
                    New task
                  </Button>
                  <Button type="button" size="sm" onClick={() => setProjModalOpen(true)}>
                    New project
                  </Button>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {sortedProjects.map((p) => (
                  <Card key={p.id} className="hover:border-amber-300">
                    <Link to={`/admin/projects/${p.id}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-semibold text-slate-900">{p.title}</h3>
                        {p.description ? (
                          <p className="mt-1 text-sm text-slate-600 line-clamp-2">{p.description}</p>
                        ) : null}
                      </div>
                      <span
                        className={
                          p.isActive
                            ? 'rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800'
                            : 'rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600'
                        }
                      >
                        {p.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    </Link>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <Modal
        open={projModalOpen}
        title="New project"
        onClose={() => {
          setProjModalOpen(false)
        }}
      >
        <form onSubmit={onCreateProject} className="space-y-3">
          <TextField
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextArea
            placeholder="Description"
            rows={3}
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
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setProjModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Create
            </Button>
          </div>
        </form>
      </Modal>
      <Modal
        open={taskModalOpen}
        title="New task"
        onClose={() => setTaskModalOpen(false)}
      >
        <form onSubmit={onCreateTask} className="space-y-3">
          <label className="space-y-1">
            <span className="text-xs font-medium text-slate-600">Project</span>
            <SelectField
              value={taskProjectId}
              onChange={(e) => setTaskProjectId(e.target.value)}
            >
              {sortedProjects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </SelectField>
          </label>
          <TextField
            placeholder="Title"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
          />
          <TextArea
            placeholder="Description (optional)"
            rows={2}
            value={taskDesc}
            onChange={(e) => setTaskDesc(e.target.value)}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1">
              <span className="text-xs font-medium text-slate-600">Status</span>
              <SelectField
                value={taskCol}
                onChange={(e) => setTaskCol(e.target.value as KanbanColumn)}
              >
                {KANBAN_COLUMNS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </SelectField>
            </label>
            <div className="space-y-1">
              <span className="text-xs font-medium text-slate-600">Due date</span>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={taskDueEnabled}
                    onChange={(e) => {
                      const on = e.target.checked
                      setTaskDueEnabled(on)
                      if (on && !taskDue) {
                        const d = new Date()
                        const yyyy = d.getFullYear()
                        const mm = String(d.getMonth() + 1).padStart(2, '0')
                        const dd = String(d.getDate()).padStart(2, '0')
                        setTaskDue(`${yyyy}-${mm}-${dd}`)
                      }
                      if (!on) setTaskDue('')
                    }}
                  />
                  Set due
                </label>
                {taskDueEnabled ? (
                  <input
                    type="date"
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    value={taskDue}
                    onChange={(e) => setTaskDue(e.target.value)}
                  />
                ) : null}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setTaskModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="accent">
              Create
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
