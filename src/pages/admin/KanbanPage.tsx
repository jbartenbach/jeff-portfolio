import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  seedInitialData,
  subscribeProjectsForUser,
  subscribeTasksForUser,
  updateTask,
} from '../../lib/firestoreOps'
import type { KanbanColumn, Project, Task } from '../../lib/types'
import { KANBAN_COLUMNS } from '../../lib/types'
import Card from '../../components/ui/Card'

export default function KanbanPage() {
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [slowLoad, setSlowLoad] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [dragId, setDragId] = useState<string | null>(null)

  const firebaseProjectId = import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined

  function fmtErr(err: unknown) {
    const anyErr = err as { code?: string; message?: string }
    if (anyErr?.code && anyErr?.message) return `${anyErr.code}: ${anyErr.message}`
    if (anyErr?.message) return anyErr.message
    return 'Could not load Firestore data.'
  }

  const reload = useCallback(async () => {
    if (!user) return
    setLoading(true)
    setSlowLoad(false)
    setLoadError(null)
    try {
      await seedInitialData(user.uid)
    } catch (e) {
      setLoadError(fmtErr(e))
    } finally {
      setLoading(false)
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
      setLoading(true)
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
            if (gotP && gotT) setLoading(false)
          },
          (e) => {
            setLoadError(fmtErr(e))
            setLoading(false)
          },
        )
        stopT = subscribeTasksForUser(
          user.uid,
          (tt) => {
            gotT = true
            setTasks(tt)
            if (gotP && gotT) setLoading(false)
          },
          (e) => {
            setLoadError(fmtErr(e))
            setLoading(false)
          },
        )
      } catch (e) {
        if (!cancel) setLoadError(fmtErr(e))
      } finally {
        window.clearTimeout(t)
        // cleared by snapshot callbacks once both have fired
      }
    })()
    return () => {
      cancel = true
      window.clearTimeout(t)
      stopP?.()
      stopT?.()
    }
  }, [user, reload])

  const activeIds = useMemo(
    () => new Set(projects.filter((p) => p.isActive).map((p) => p.id)),
    [projects],
  )

  const boardTasks = useMemo(
    () => tasks.filter((t) => activeIds.has(t.projectId)),
    [tasks, activeIds],
  )

  const byCol = useMemo(() => {
    const m: Record<KanbanColumn, Task[]> = {
      unstarted: [],
      tomorrow: [],
      today: [],
      in_progress: [],
      completed: [],
    }
    for (const t of boardTasks) {
      const c = t.kanbanColumn in m ? t.kanbanColumn : 'unstarted'
      m[c].push(t)
    }
    for (const c of Object.keys(m) as KanbanColumn[]) {
      m[c].sort((a, b) => a.orderIndex - b.orderIndex)
    }
    return m
  }, [boardTasks])

  async function dropOnColumn(col: KanbanColumn, taskId: string | null) {
    const id = taskId ?? dragId
    if (!id) return
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, kanbanColumn: col } : t)))
    await updateTask(id, { kanbanColumn: col })
    setDragId(null)
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 text-slate-500">
        <p>Loading board…</p>
        {slowLoad && (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
            <p className="text-sm font-medium">Still loading…</p>
            <p className="mt-1 text-xs text-amber-900/80">
              Firebase project:{' '}
              <code className="rounded bg-amber-100 px-1 py-0.5">{firebaseProjectId ?? '(missing)'}</code>
            </p>
            <button
              type="button"
              onClick={() => reload()}
              className="mt-3 rounded-lg bg-amber-600 px-3 py-2 text-xs font-semibold text-white hover:bg-amber-500"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-900">
          <h1 className="text-lg font-semibold">Tasks board could not load</h1>
          <p className="mt-2 text-sm">{loadError}</p>
          <p className="mt-3 text-xs text-red-800/80">
            Firebase project:{' '}
            <code className="rounded bg-red-100 px-1 py-0.5">{firebaseProjectId ?? '(missing)'}</code>
          </p>
          <button
            type="button"
            onClick={() => reload()}
            className="mt-4 rounded-lg bg-red-900 px-3 py-2 text-xs font-semibold text-white hover:bg-red-800"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-slate-900">Tasks board</h1>
          <p className="text-sm text-slate-500">Only tasks from active projects.</p>
        </div>
        <Link to="/admin/dashboard" className="text-sm text-amber-700 hover:text-amber-800">
          ← Dashboard
        </Link>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-4">
        {KANBAN_COLUMNS.map((col) => (
          <Card
            key={col.id}
            className="min-w-[260px] flex-1 rounded-2xl bg-slate-50/80 p-3 shadow-none hover:border-slate-200"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              const id = e.dataTransfer.getData('text/task-id') || null
              dropOnColumn(col.id, id)
            }}
          >
            <h2 className="ds-section-label mb-3 border-b border-slate-200 pb-2">
              {col.label}
            </h2>
            <ul className="space-y-2">
              {byCol[col.id].map((t) => {
                const proj = projects.find((p) => p.id === t.projectId)
                return (
                  <li
                    key={t.id}
                    draggable
                    onDragStart={(e) => {
                      setDragId(t.id)
                      try {
                        e.dataTransfer.setData('text/task-id', t.id)
                        e.dataTransfer.effectAllowed = 'move'
                      } catch {
                        // ignore
                      }
                    }}
                    className="cursor-grab rounded-xl border border-slate-200 bg-white p-3 shadow-sm active:cursor-grabbing"
                  >
                    <p className="text-sm font-medium text-slate-900">{t.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{proj?.title}</p>
                  </li>
                )
              })}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  )
}
