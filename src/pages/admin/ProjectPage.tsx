import { Timestamp } from 'firebase/firestore'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { dueDateLabel, isDueToday, isDueTomorrow } from '../../lib/dates'
import {
  createTask,
  fetchTasksForProject,
  getProject,
  reorderTasks,
  updateProject,
  updateTask,
} from '../../lib/firestoreOps'
import type { Project, Task } from '../../lib/types'

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
  const [dragId, setDragId] = useState<string | null>(null)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isActive, setIsActive] = useState(true)

  const [nt, setNt] = useState('')
  const [nd, setNd] = useState('')
  const [nDue, setNDue] = useState('')

  const load = useCallback(async () => {
    if (!user || !id) return
    const p = await getProject(id)
    if (!p || p.ownerUid !== user.uid) {
      setProject(null)
      setLoading(false)
      return
    }
    setProject(p)
    setTitle(p.title)
    setDescription(p.description)
    setIsActive(p.isActive)
    const t = await fetchTasksForProject(id, user.uid)
    setTasks(sortTasks(t))
    setLoading(false)
  }, [user, id])

  useEffect(() => {
    setLoading(true)
    load()
  }, [load])

  async function saveProject(e: React.FormEvent) {
    e.preventDefault()
    if (!id) return
    await updateProject(id, {
      title: title.trim(),
      description: description.trim(),
      isActive,
    })
    await load()
  }

  async function addTask(e: React.FormEvent) {
    e.preventDefault()
    if (!user || !id || !nt.trim()) return
    const maxOrder = tasks.reduce((m, t) => Math.max(m, t.orderIndex), -1)
    await createTask(user.uid, {
      projectId: id,
      title: nt.trim(),
      description: nd.trim(),
      dueDate: nDue ? Timestamp.fromDate(new Date(nDue)) : null,
      orderIndex: maxOrder + 1,
    })
    setNt('')
    setNd('')
    setNDue('')
    await load()
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
    await load()
  }

  if (!id) return <Navigate to="/admin/dashboard" replace />
  if (!loading && (!project || project.ownerUid !== user?.uid)) {
    return <Navigate to="/admin/dashboard" replace />
  }

  if (loading || !project) {
    return <div className="mx-auto max-w-3xl px-4 py-12 text-slate-500">Loading…</div>
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
          <input
            type="datetime-local"
            className="rounded-lg border px-3 py-2 text-sm"
            value={nDue}
            onChange={(e) => setNDue(e.target.value)}
          />
          <button type="submit" className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white">
            Add task
          </button>
        </form>
      </section>
    </div>
  )
}
