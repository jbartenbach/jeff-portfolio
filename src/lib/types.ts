import type { Timestamp } from 'firebase/firestore'

export type KanbanColumn =
  | 'unstarted'
  | 'tomorrow'
  | 'today'
  | 'in_progress'
  | 'completed'

export interface Project {
  id: string
  title: string
  description: string
  isActive: boolean
  ownerUid: string
  createdAt?: Timestamp
}

export interface Task {
  id: string
  projectId: string
  title: string
  description: string
  dueDate: Timestamp | null
  kanbanColumn: KanbanColumn
  orderIndex: number
  ownerUid: string
  createdAt?: Timestamp
}

export const KANBAN_COLUMNS: { id: KanbanColumn; label: string }[] = [
  { id: 'unstarted', label: 'Unstarted' },
  { id: 'tomorrow', label: 'Tomorrow' },
  { id: 'today', label: 'Today' },
  { id: 'in_progress', label: 'In progress' },
  { id: 'completed', label: 'Completed' },
]
