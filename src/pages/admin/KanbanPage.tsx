import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  fetchProjectsForUser,
  fetchTasksForUser,
  seedInitialData,
  updateTask,
} from '../../lib/firestoreOps'
import type { KanbanColumn, Project, Task } from '../../lib/types'
import { KANBAN_COLUMNS } from '../../lib/types'

export default function KanbanPage() {
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [dragId, setDragId] = useState<string | null>(null)

  const reload = useCallback(async () => {
    if (!user) return
    await seedInitialData(user.uid)
    const [p, t] = await Promise.all([
      fetchProjectsForUser(user.uid),
      fetchTasksForUser(user.uid),
    ])
    setProjects(p)
    setTasks(t)
  }, [user])

  useEffect(() => {
    if (!user) return
    ;(async () => {
      setLoading(true)
      await reload()
      setLoading(false)
    })()
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
    return m
  }, [boardTasks])

  async function dropOnColumn(col: KanbanColumn) {
    if (!dragId) return
    await updateTask(dragId, { kanbanColumn: col })
    setDragId(null)
    await reload()
  }

  if (loading) {
    return <div className="mx-auto max-w-6xl px-4 py-12 text-slate-500">Loading board…</div>
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
          <div
            key={col.id}
            className="min-w-[260px] flex-1 rounded-2xl border border-slate-200 bg-slate-50/80 p-3"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => dropOnColumn(col.id)}
          >
            <h2 className="mb-3 border-b border-slate-200 pb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
              {col.label}
            </h2>
            <ul className="space-y-2">
              {byCol[col.id].map((t) => {
                const proj = projects.find((p) => p.id === t.projectId)
                return (
                  <li
                    key={t.id}
                    draggable
                    onDragStart={() => setDragId(t.id)}
                    className="cursor-grab rounded-xl border border-slate-200 bg-white p-3 shadow-sm active:cursor-grabbing"
                  >
                    <p className="text-sm font-medium text-slate-900">{t.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{proj?.title}</p>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
