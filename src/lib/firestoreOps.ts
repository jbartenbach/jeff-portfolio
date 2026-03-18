import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
  type Timestamp,
} from 'firebase/firestore'
import { getDb } from './firebase'
import type { KanbanColumn, Project, Task } from './types'

const projectsCol = () => {
  const db = getDb()
  if (!db) throw new Error('Firestore not configured')
  return collection(db, 'projects')
}
const tasksCol = () => {
  const db = getDb()
  if (!db) throw new Error('Firestore not configured')
  return collection(db, 'tasks')
}

export async function getProject(id: string): Promise<Project | null> {
  const db = getDb()
  if (!db) return null
  const d = await getDoc(doc(db, 'projects', id))
  if (!d.exists()) return null
  return { id: d.id, ...(d.data() as Omit<Project, 'id'>) }
}

export async function fetchProjectsForUser(uid: string): Promise<Project[]> {
  const q = query(projectsCol(), where('ownerUid', '==', uid))
  const snap = await getDocs(q)
  const list = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Project, 'id'>) }))
  return list.sort((a, b) => {
    const ta = a.createdAt?.toMillis?.() ?? 0
    const tb = b.createdAt?.toMillis?.() ?? 0
    return tb - ta
  })
}

export async function fetchTasksForUser(uid: string): Promise<Task[]> {
  const q = query(tasksCol(), where('ownerUid', '==', uid))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Task, 'id'>) }))
}

export async function fetchTasksForProject(projectId: string, uid: string): Promise<Task[]> {
  const q = query(
    tasksCol(),
    where('ownerUid', '==', uid),
    where('projectId', '==', projectId),
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Task, 'id'>) }))
}

export async function hasAnyProject(uid: string): Promise<boolean> {
  const q = query(projectsCol(), where('ownerUid', '==', uid), limit(1))
  const snap = await getDocs(q)
  return !snap.empty
}

/** One seed at a time per user (React Strict Mode runs effects twice in dev). */
const seedPromises = new Map<string, Promise<void>>()

export async function seedInitialData(uid: string) {
  const pending = seedPromises.get(uid)
  if (pending) return pending

  const run = (async () => {
    const exists = await hasAnyProject(uid)
    if (exists) return

    const db = getDb()
    if (!db) throw new Error('Firestore not configured')
    const pCol = collection(db, 'projects')
    const tCol = collection(db, 'tasks')
    const lifeRef = doc(pCol)
    const exRef = doc(pCol)
    const batch = writeBatch(db)

    batch.set(lifeRef, {
      title: 'Life',
      description: 'A place for all of the random things I need to get done.',
      isActive: true,
      ownerUid: uid,
      createdAt: serverTimestamp(),
    })
    batch.set(exRef, {
      title: 'Example Project',
      description: 'Placeholder text',
      isActive: false,
      ownerUid: uid,
      createdAt: serverTimestamp(),
    })

    const baseTask = {
      description: '',
      dueDate: null,
      kanbanColumn: 'unstarted' as KanbanColumn,
      ownerUid: uid,
      createdAt: serverTimestamp(),
    }
    batch.set(doc(tCol), {
      ...baseTask,
      projectId: lifeRef.id,
      title: 'Finish resume',
      orderIndex: 0,
    })
    batch.set(doc(tCol), {
      ...baseTask,
      projectId: lifeRef.id,
      title: 'Open mail',
      orderIndex: 1,
    })
    batch.set(doc(tCol), {
      ...baseTask,
      projectId: exRef.id,
      title: 'Review design system tokens',
      description: 'Audit color and type scale against product surfaces.',
      orderIndex: 0,
    })
    batch.set(doc(tCol), {
      ...baseTask,
      projectId: exRef.id,
      title: 'Draft Q2 roadmap outline',
      description: 'Stakeholder themes and dependency notes.',
      orderIndex: 1,
    })

    await batch.commit()
  })()

  seedPromises.set(uid, run)
  try {
    await run
  } finally {
    seedPromises.delete(uid)
  }
}

/** Parallel reads; seeds only if empty. Faster than serial hasAny + seed + fetch. */
export async function loadDashboardData(uid: string): Promise<{
  projects: Project[]
  tasks: Task[]
}> {
  const [projects, tasks] = await Promise.all([
    fetchProjectsForUser(uid),
    fetchTasksForUser(uid),
  ])
  if (projects.length === 0) {
    await seedInitialData(uid)
    const [p2, t2] = await Promise.all([
      fetchProjectsForUser(uid),
      fetchTasksForUser(uid),
    ])
    return { projects: p2, tasks: t2 }
  }
  return { projects, tasks }
}

export async function createProject(
  uid: string,
  data: { title: string; description: string; isActive: boolean },
) {
  return addDoc(projectsCol(), {
    ...data,
    ownerUid: uid,
    createdAt: serverTimestamp(),
  })
}

export async function updateProject(
  id: string,
  data: Partial<Pick<Project, 'title' | 'description' | 'isActive'>>,
) {
  const db = getDb()
  if (!db) return
  await updateDoc(doc(db, 'projects', id), data)
}

export async function createTask(
  uid: string,
  data: {
    projectId: string
    title: string
    description: string
    dueDate: Timestamp | null
    orderIndex: number
  },
) {
  return addDoc(tasksCol(), {
    ...data,
    kanbanColumn: 'unstarted' as KanbanColumn,
    ownerUid: uid,
    createdAt: serverTimestamp(),
  })
}

export async function updateTask(
  id: string,
  data: Partial<Pick<Task, 'title' | 'description' | 'dueDate' | 'kanbanColumn' | 'orderIndex'>>,
) {
  const db = getDb()
  if (!db) return
  await updateDoc(doc(db, 'tasks', id), data)
}

export async function reorderTasks(taskIdsInOrder: string[]) {
  const db = getDb()
  if (!db) return
  const batch = writeBatch(db)
  taskIdsInOrder.forEach((id, i) => {
    batch.update(doc(db, 'tasks', id), { orderIndex: i })
  })
  await batch.commit()
}
