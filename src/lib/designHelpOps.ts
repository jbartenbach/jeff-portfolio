import {
  addDoc,
  collection,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  doc,
  where,
  type Timestamp,
} from 'firebase/firestore'
import { getDb } from './firebase'
import type {
  DesignHelpEvent,
  DesignHelpEventName,
  DesignHelpLead,
  DesignHelpLeadStatus,
  DesignHelpOffer,
} from './designHelpTypes'

const leadsCol = () => {
  const db = getDb()
  if (!db) throw new Error('Firestore not configured')
  return collection(db, 'designHelpLeads')
}

const eventsCol = () => {
  const db = getDb()
  if (!db) throw new Error('Firestore not configured')
  return collection(db, 'designHelpEvents')
}

function attribution() {
  if (typeof window === 'undefined') {
    return { referrer: null as string | null, source: null as string | null, path: '/' }
  }
  const params = new URLSearchParams(window.location.search)
  const source =
    params.get('utm_source') ||
    params.get('source') ||
    params.get('ref') ||
    null
  return {
    referrer: document.referrer || null,
    source,
    path: window.location.pathname + window.location.search,
  }
}

export async function trackDesignHelpEvent(
  name: DesignHelpEventName,
  offer: DesignHelpOffer | null = null,
) {
  if (!getDb()) return
  const attr = attribution()
  await addDoc(eventsCol(), {
    name,
    offer,
    ...attr,
    createdAt: serverTimestamp(),
  })
}

export async function submitDesignHelpLead(input: {
  email: string
  offer: DesignHelpOffer
  /** Honeypot — if filled, silently no-op */
  companyWebsite?: string
}) {
  if (input.companyWebsite?.trim()) {
    return { ok: true as const, spam: true as const }
  }
  const email = input.email.trim().toLowerCase()
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Please enter a valid email address.')
  }
  if (!getDb()) {
    throw new Error('Form is temporarily unavailable. Please email jbartenbach@gmail.com.')
  }
  const attr = attribution()
  await addDoc(leadsCol(), {
    email,
    offer: input.offer,
    status: 'new' satisfies DesignHelpLeadStatus,
    ...attr,
    createdAt: serverTimestamp(),
  })
  await trackDesignHelpEvent('design_help_lead_submit', input.offer)
  return { ok: true as const, spam: false as const }
}

export function subscribeDesignHelpLeads(
  onData: (leads: DesignHelpLead[]) => void,
  onError?: (err: unknown) => void,
) {
  const q = query(leadsCol(), orderBy('createdAt', 'desc'), limit(100))
  return onSnapshot(
    q,
    (snap) => {
      onData(
        snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<DesignHelpLead, 'id'>),
        })),
      )
    },
    (err) => onError?.(err),
  )
}

export async function updateDesignHelpLeadStatus(id: string, status: DesignHelpLeadStatus) {
  const db = getDb()
  if (!db) throw new Error('Firestore not configured')
  await updateDoc(doc(db, 'designHelpLeads', id), { status })
}

export async function fetchDesignHelpEvents(max = 500): Promise<DesignHelpEvent[]> {
  const q = query(eventsCol(), orderBy('createdAt', 'desc'), limit(max))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<DesignHelpEvent, 'id'>),
  }))
}

export function eventCreatedAtMs(event: { createdAt?: Timestamp }) {
  return event.createdAt?.toMillis?.() ?? 0
}

export async function fetchRecentDesignHelpEventsByName(name: DesignHelpEventName, max = 200) {
  const q = query(eventsCol(), where('name', '==', name), orderBy('createdAt', 'desc'), limit(max))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<DesignHelpEvent, 'id'>),
  }))
}
