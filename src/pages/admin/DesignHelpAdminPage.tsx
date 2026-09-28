import { useEffect, useMemo, useState } from 'react'
import {
  fetchDesignHelpEvents,
  subscribeDesignHelpLeads,
  updateDesignHelpLeadStatus,
} from '../../lib/designHelpOps'
import {
  DESIGN_HELP_OFFER_LABELS,
  DESIGN_HELP_STATUS_LABELS,
  type DesignHelpEvent,
  type DesignHelpLead,
  type DesignHelpLeadStatus,
  type DesignHelpOffer,
} from '../../lib/designHelpTypes'

function formatWhen(lead: DesignHelpLead) {
  const ms = lead.createdAt?.toMillis?.()
  if (!ms) return '—'
  return new Date(ms).toLocaleString()
}

function FunnelStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
    </div>
  )
}

export default function DesignHelpAdminPage() {
  const [leads, setLeads] = useState<DesignHelpLead[]>([])
  const [events, setEvents] = useState<DesignHelpEvent[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loadingEvents, setLoadingEvents] = useState(true)

  useEffect(() => {
    return subscribeDesignHelpLeads(setLeads, (err) => {
      console.error(err)
      setError('Could not load leads. Check Firestore rules and indexes.')
    })
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await fetchDesignHelpEvents()
        if (!cancelled) setEvents(data)
      } catch (err) {
        console.error(err)
        if (!cancelled) setError('Could not load funnel events. A composite index may be needed.')
      } finally {
        if (!cancelled) setLoadingEvents(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const funnel = useMemo(() => {
    const count = (name: string, offer?: DesignHelpOffer | null) =>
      events.filter((e) => e.name === name && (offer == null || e.offer === offer)).length

    const offers: DesignHelpOffer[] = ['consult', 'design_day', 'weekly']
    return {
      pageViews: count('design_help_page_view'),
      ctaClicks: count('design_help_cta_click'),
      formViews: count('design_help_form_view'),
      submissions: count('design_help_lead_submit'),
      byOffer: offers.map((offer) => ({
        offer,
        label: DESIGN_HELP_OFFER_LABELS[offer],
        ctaClicks: count('design_help_cta_click', offer),
        formViews: count('design_help_form_view', offer),
        submissions: count('design_help_lead_submit', offer),
      })),
    }
  }, [events])

  async function onStatusChange(id: string, status: DesignHelpLeadStatus) {
    try {
      await updateDesignHelpLeadStatus(id, status)
    } catch (err) {
      console.error(err)
      setError('Could not update lead status.')
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">Design help leads</h1>
        <p className="mt-1 text-sm text-slate-500">
          Funnel and inbound interest from /design-help
        </p>
      </div>

      {error ? (
        <p className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <section className="mb-10">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">
          Funnel {loadingEvents ? '(loading…)' : ''}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <FunnelStat label="Page views" value={funnel.pageViews} />
          <FunnelStat label="CTA clicks" value={funnel.ctaClicks} />
          <FunnelStat label="Form views" value={funnel.formViews} />
          <FunnelStat label="Lead submissions" value={funnel.submissions} />
        </div>

        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Offer</th>
                <th className="px-4 py-3">CTA clicks</th>
                <th className="px-4 py-3">Form views</th>
                <th className="px-4 py-3">Submissions</th>
              </tr>
            </thead>
            <tbody>
              {funnel.byOffer.map((row) => (
                <tr key={row.offer} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3 text-slate-800">{row.label}</td>
                  <td className="px-4 py-3 text-slate-600">{row.ctaClicks}</td>
                  <td className="px-4 py-3 text-slate-600">{row.formViews}</td>
                  <td className="px-4 py-3 text-slate-600">{row.submissions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">
          Leads ({leads.length})
        </h2>
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Offer</th>
                <th className="px-4 py-3">Submitted</th>
                <th className="px-4 py-3">Source / referrer</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    No leads yet.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="border-b border-slate-100 last:border-0">
                    <td className="px-4 py-3 font-medium text-slate-900">{lead.email}</td>
                    <td className="px-4 py-3 text-slate-700">
                      {DESIGN_HELP_OFFER_LABELS[lead.offer] ?? lead.offer}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">{formatWhen(lead)}</td>
                    <td className="max-w-[220px] truncate px-4 py-3 text-slate-500">
                      {lead.source || lead.referrer || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={lead.status}
                        onChange={(e) =>
                          void onStatusChange(lead.id, e.target.value as DesignHelpLeadStatus)
                        }
                        className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-800"
                      >
                        {(Object.keys(DESIGN_HELP_STATUS_LABELS) as DesignHelpLeadStatus[]).map(
                          (status) => (
                            <option key={status} value={status}>
                              {DESIGN_HELP_STATUS_LABELS[status]}
                            </option>
                          ),
                        )}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
