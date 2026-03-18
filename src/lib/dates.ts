import { Timestamp } from 'firebase/firestore'

export function startOfDay(d: Date) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

export function isSameCalendarDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function isDueToday(ts: Timestamp | null | undefined) {
  if (!ts) return false
  return isSameCalendarDay(ts.toDate(), new Date())
}

export function isDueTomorrow(ts: Timestamp | null | undefined) {
  if (!ts) return false
  const t = new Date()
  t.setDate(t.getDate() + 1)
  return isSameCalendarDay(ts.toDate(), t)
}

export function dueDateLabel(ts: Timestamp | null | undefined) {
  if (!ts) return null
  const d = ts.toDate()
  const now = new Date()
  if (isSameCalendarDay(d, now)) return 'Today'
  const tom = new Date(now)
  tom.setDate(tom.getDate() + 1)
  if (isSameCalendarDay(d, tom)) return 'Tomorrow'
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  })
}
