import { Timestamp } from 'firebase/firestore'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { dueDateLabel, isDueToday, isDueTomorrow } from '../../lib/dates'
import {
  createTask,
  getProject,
  reorderTasks,
  subscribeTasksForProject,
  updateProject,
  updateTask,
} from '../../lib/firestoreOps'
import type { KanbanColumn, Project, Task } from '../../lib/types'
import { KANBAN_COLUMNS } from '../../lib/types'

function sortTasks(list: Task[]) {
  return [...list].sort((a, b) => {
    if (!a.dueDate && !b.dueDate) return a.orderIndex - b.orderIndex
    if (!a.dueDate) return 1
    if (!b.dueDate) return -1
    const c = a.dueDate.toMillis() - b.dueDate.toMillis()
    if (c !== 0) return c
    return a.orderIndex - b.orderIndex
  })
}

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const [project, setProject] = useState<Project | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [slowLoad, setSlowLoad] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [dragId, setDragId] = useState<string | null>(null)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isActive, setIsActive] = useState(true)

  const [nt, setNt] = useState('')
  const [nd, setNd] = useState('')
  const [nCol, setNCol] = useState<KanbanColumn>('unstarted')
  const [dueEnabled, setDueEnabled] = useState(false)
  const [nDue, setNDue] = useState('') // YYYY-MM-DD

  const firebaseProjectId = import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined

  function fmtErr(err: unknown) {
    const anyErr = err as { code?: string; message?: string }
    if (anyErr?.code && anyErr?.message) return `${anyErr.code}: ${anyErr.message}`
    if (anyErr?.message) return anyErr.message
    return 'Could not load Firestore data.'
  }

  const load = useCallback(async () => {
    if (!user || !id) return
    const p = await getProject(id)
    if (!p || p.ownerUid !== user.uid) {
      setProject(null)
      setTasks([])
      return
    }
    setProject(p)
    setTitle(p.title)
    setDescription(p.description)
    setIsActive(p.isActive)
  }, [user, id])

  useEffect(() => {
    if (!user || !id) return
    let cancel = false
    let stopTasks: (() => void) | null = null
    const t = window.setTimeout(() => {
      if (!cancel) setSlowLoad(true)
    }, 6000)
    ;(async () => {
      setLoading(true)
      setSlowLoad(false)
      setLoadError(null)
      try {
        await load()
        if (cancel) return
        stopTasks = subscribeTasksForProject(
          id,
          user.uid,
          (tt) => setTasks(sortTasks(tt)),
          (e) => setLoadError(fmtErr(e)),
        )
      } catch (e) {
        if (!cancel) setLoadError(fmtErr(e))
      } finally {
        window.clearTimeout(t)
        if (!cancel) setLoading(false)
      }
    })()
    return () => {
      cancel = true
      window.clearTimeout(t)
      stopTasks?.()
    }
  }, [load])

  async function saveProject(e: React.FormEvent) {
    e.preventDefault()
    if (!id) return
    await updateProject(id, {
      title: title.trim(),
      description: description.trim(),
      isActive,
    })
    setLoading(true)
    setLoadError(null)
    try {
      await load()
    } catch (e) {
      setLoadError(fmtErr(e))
    } finally {
      setLoading(false)
    }
  }

  async function addTask(e: React.FormEvent) {
    e.preventDefault()
    if (!user || !id || !nt.trim()) return
    const maxOrder = tasks.reduce((m, t) => Math.max(m, t.orderIndex), -1)
    const dueDate =
      dueEnabled && nDue
        ? Timestamp.fromDate(new Date(`${nDue}T00:00:00`))
        : null
    await createTask(user.uid, {
      projectId: id,
      title: nt.trim(),
      description: nd.trim(),
      dueDate,
      orderIndex: maxOrder + 1,
      kanbanColumn: nCol,
    })
    setNt('')
    setNd('')
    setNCol('unstarted')
    setDueEnabled(false)
    setNDue('')
    setLoading(true)
    setLoadError(null)
    try {
      await load()
    } catch (e) {
      setLoadError(fmtErr(e))
    } finally {
      setLoading(false)
    }
  }

  const sorted = useMemo(() => sortTasks(tasks), [tasks])

  async function onDropReorder(targetId: string) {
    if (!dragId || dragId === targetId) return
    const ids = sorted.map((t) => t.id)
    const from = ids.indexOf(dragId)
    const to = ids.indexOf(targetId)
    if (from < 0 || to < 0) return
    ids.splice(from, 1)
    ids.splice(to, 0, dragId)
    await reorderTasks(ids)
    setDragId(null)
  }

  if (!id) return <Navigate to="/admin/dashboard" replace />
  if (!loading && (!project || project.ownerUid !== user?.uid)) {
    return <Navigate to="/admin/dashboard" replace />
  }

  if (loadError) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-900">
          <h1 className="text-lg font-semibold">Project could not load</h1>
          <p className="mt-2 text-sm">{loadError}</p>
          <p className="mt-3 text-xs text-red-800/80">
            Firebase project:{' '}
            <code className="rounded bg-red-100 px-1 py-0.5">{firebaseProjectId ?? '(missing)'}</code>
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => load().then(() => setLoadError(null))}
              className="rounded-lg bg-red-900 px-3 py-2 text-xs font-semibold text-white hover:bg-red-800"
            >
              Retry
            </button>
            <Link
              to="/admin/dashboard"
              className="rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-900 hover:bg-red-50"
            >
              Back to dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (loading || !project) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-slate-500">
        <p>Loading…</p>
        {slowLoad && (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
            <p className="text-sm font-medium">Still loading…</p>
            <p className="mt-1 text-xs text-amber-900/80">
              Firebase project:{' '}
              <code className="rounded bg-amber-100 px-1 py-0.5">{firebaseProjectId ?? '(missing)'}</code>
            </p>
            <button
              type="button"
              onClick={() => load()}
              className="mt-3 rounded-lg bg-amber-600 px-3 py-2 text-xs font-semibold text-white hover:bg-amber-500"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link to="/admin/dashboard" className="text-sm text-amber-700 hover:text-amber-800">
        ← Dashboard
      </Link>

      <form onSubmit={saveProject} className="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <input
          className="w-full text-2xl font-semibold text-slate-900 border-b border-transparent hover:border-slate-200 focus:border-amber-500 focus:outline-none"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="w-full text-sm text-slate-600 border rounded-lg p-3"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
          Active project (tasks appear on kanban)
        </label>
        <button type="submit" className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white">
          Save
        </button>
      </form>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-slate-900">Tasks</h2>
        <p className="text-xs text-slate-500">Sorted by nearest due date. Drag rows to reorder.</p>

        <ul className="mt-4 space-y-2">
          {sorted.map((t) => (
            <li
              key={t.id}
              draggable
              onDragStart={() => setDragId(t.id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDropReorder(t.id)}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm cursor-grab active:cursor-grabbing"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <span className="font-medium text-slate-900">{t.title}</span>
                  {t.description ? (
                    <p className="mt-1 text-sm text-slate-600">{t.description}</p>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-1">
                  {isDueToday(t.dueDate) || t.kanbanColumn === 'today' ? (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-900">
                      Today
                    </span>
                  ) : null}
                  {isDueTomorrow(t.dueDate) || t.kanbanColumn === 'tomorrow' ? (
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-900">
                      Tomorrow
                    </span>
                  ) : null}
                  {dueDateLabel(t.dueDate) && !isDueToday(t.dueDate) && !isDueTomorrow(t.dueDate) ? (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
                      Due {dueDateLabel(t.dueDate)}
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <select
                  className="rounded border border-slate-300 px-2 py-1"
                  value={t.kanbanColumn}
                  onChange={(e) => {
                    updateTask(t.id, {
                      kanbanColumn: e.target.value as Task['kanbanColumn'],
                    }).then(load)
                  }}
                >
                  {['unstarted', 'tomorrow', 'today', 'in_progress', 'completed'].map((c) => (
                    <option key={c} value={c}>
                      {c.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>
            </li>
          ))}
        </ul>

        <form onSubmit={addTask} className="mt-8 space-y-3 rounded-xl border border-dashed border-slate-300 p-4">
          <h3 className="text-sm font-semibold text-slate-800">New task</h3>
          <input
            className="w-full rounded-lg border px-3 py-2 text-sm"
            placeholder="Title"
            value={nt}
            onChange={(e) => setNt(e.target.value)}
          />
          <textarea
            className="w-full rounded-lg border px-3 py-2 text-sm"
            placeholder="Description (optional)"
            rows={2}
            value={nd}
            onChange={(e) => setNd(e.target.value)}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1">
              <span className="text-xs font-medium text-slate-600">Status</span>
              <select
                className="w-full rounded-lg border px-3 py-2 text-sm"
                value={nCol}
                onChange={(e) => setNCol(e.target.value as KanbanColumn)}
              >
                {KANBAN_COLUMNS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
            <div className="space-y-1">
              <span className="text-xs font-medium text-slate-600">Due date</span>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={dueEnabled}
                    onChange={(e) => {
                      const on = e.target.checked
                      setDueEnabled(on)
                      if (on && !nDue) {
                        const d = new Date()
                        const yyyy = d.getFullYear()
                        const mm = String(d.getMonth() + 1).padStart(2, '0')
                        const dd = String(d.getDate()).padStart(2, '0')
                        setNDue(`${yyyy}-${mm}-${dd}`)
                      }
                      if (!on) setNDue('')
                    }}
                  />
                  Set due
                </label>
                {dueEnabled ? (
                  <input
                    type="date"
                    className="rounded-lg border px-3 py-2 text-sm"
                    value={nDue}
                    onChange={(e) => setNDue(e.target.value)}
                  />
                ) : null}
              </div>
            </div>
          </div>
          <button type="submit" className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white">
            Add task
          </button>
        </form>
      </section>
    </div>
  )
}
