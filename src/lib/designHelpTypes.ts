import type { Timestamp } from 'firebase/firestore'

export type DesignHelpOffer = 'consult' | 'design_day' | 'weekly'

export type DesignHelpLeadStatus = 'new' | 'contacted' | 'booked' | 'closed'

export type DesignHelpEventName =
  | 'design_help_page_view'
  | 'design_help_cta_click'
  | 'design_help_form_view'
  | 'design_help_lead_submit'

export interface DesignHelpLead {
  id: string
  email: string
  offer: DesignHelpOffer
  status: DesignHelpLeadStatus
  referrer: string | null
  source: string | null
  path: string
  createdAt?: Timestamp
}

export interface DesignHelpEvent {
  id: string
  name: DesignHelpEventName
  offer: DesignHelpOffer | null
  referrer: string | null
  source: string | null
  path: string
  createdAt?: Timestamp
}

export const DESIGN_HELP_OFFER_LABELS: Record<DesignHelpOffer, string> = {
  consult: '90-Minute Design Consult',
  design_day: 'Design Day',
  weekly: 'Weekly engagement',
}

export const DESIGN_HELP_STATUS_LABELS: Record<DesignHelpLeadStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  booked: 'Booked',
  closed: 'Closed',
}
