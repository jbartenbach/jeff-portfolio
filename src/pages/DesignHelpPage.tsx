import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import PublicSiteChrome from '../components/case-study/PublicSiteChrome'
import {
  submitDesignHelpLead,
  trackDesignHelpEvent,
} from '../lib/designHelpOps'
import type { DesignHelpOffer } from '../lib/designHelpTypes'

type OfferCard = {
  id: DesignHelpOffer
  eyebrow: string
  price: string
  priceNote?: string
  title: string
  body: string
  goodFor: string[]
}

const primaryOffers: OfferCard[] = [
  {
    id: 'consult',
    eyebrow: '90-Minute Design Consult',
    price: '$300',
    title: 'Get unstuck.',
    body: "Bring a product, UX, design, or strategy problem you're wrestling with. We'll spend 90 focused minutes working through it together and leave with a clearer direction.",
    goodFor: [
      'Product critique and UX problems',
      'Flows, onboarding, and early concepts',
      'Design-system questions',
      'Prioritization and product/design strategy',
      'Using AI effectively in your design process',
      'Getting an experienced outside perspective',
    ],
  },
  {
    id: 'design_day',
    eyebrow: 'Design Day',
    price: '$900',
    title: "Let's solve it and make something.",
    body: "Give me one focused product-design problem for the day. We'll align on what needs solving, then I'll get into the work—flows, screens, concepts, prototypes, or whatever the problem calls for.",
    goodFor: [
      'Getting an experience unstuck',
      'Exploring or designing a new feature',
      'Redesigning a problematic flow',
      'Rapidly developing a concept',
      'Turning an idea into a working prototype you can put in front of users',
      'Adding senior design capacity when something needs to move',
    ],
  },
]

function LeadForm({
  offer,
  onClose,
}: {
  offer: DesignHelpOffer
  onClose?: () => void
}) {
  const [email, setEmail] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    void trackDesignHelpEvent('design_help_form_view', offer)
    const t = window.setTimeout(() => inputRef.current?.focus(), 220)
    return () => window.clearTimeout(t)
  }, [offer])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('submitting')
    setError(null)
    try {
      await submitDesignHelpLead({
        email,
        offer,
        companyWebsite: honeypot,
      })
      setStatus('done')
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  if (status === 'done') {
    return (
      <div className="rounded-xl border border-slate-700/80 bg-slate-950/60 p-5">
        <p className="font-display text-xl text-white">Thanks.</p>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          I&apos;ll be in touch shortly to hear more about what you&apos;re working on and what you need.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl border border-slate-700/80 bg-slate-950/60 p-5"
      noValidate
    >
      <p className="font-display text-xl text-white">Let&apos;s talk.</p>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">
        I&apos;d love to hear what you&apos;re working on and where you could use some help. Where should I
        reach you?
      </p>

      {/* Honeypot */}
      <label className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        Company website
        <input
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </label>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          ref={inputRef}
          type="email"
          required
          name="email"
          autoComplete="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-amber-500/70"
        />
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="shrink-0 rounded-lg bg-amber-500 px-5 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-amber-400 disabled:opacity-60"
        >
          {status === 'submitting' ? 'Sending…' : 'Send →'}
        </button>
      </div>
      {error ? <p className="mt-3 text-sm text-red-400">{error}</p> : null}
      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          className="mt-3 text-xs text-slate-500 transition-colors hover:text-slate-300"
        >
          Cancel
        </button>
      ) : null}
    </form>
  )
}

function OfferPanel({
  offer,
  featured = false,
}: {
  offer: OfferCard
  featured?: boolean
}) {
  const [open, setOpen] = useState(false)

  async function openForm() {
    void trackDesignHelpEvent('design_help_cta_click', offer.id)
    setOpen(true)
  }

  return (
    <div
      className={`flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-8 ${
        featured ? 'md:p-10' : ''
      }`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-500">
        {offer.eyebrow}
      </p>
      <p className="mt-4 font-display text-4xl text-white md:text-5xl">{offer.price}</p>
      {offer.priceNote ? <p className="mt-1 text-sm text-slate-500">{offer.priceNote}</p> : null}
      <h2 className="mt-6 font-display text-2xl leading-snug text-white md:text-3xl">{offer.title}</h2>
      <p className="mt-4 text-sm leading-relaxed text-slate-400 md:text-base">{offer.body}</p>

      <div className="mt-6">
        <p className="text-sm font-medium text-slate-300">Good for:</p>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-400">
          {offer.goodFor.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="mt-8 grow" />

      {!open ? (
        <button
          type="button"
          onClick={openForm}
          className="self-start text-sm font-medium text-amber-500 transition-colors hover:text-amber-400"
        >
          Let&apos;s Talk →
        </button>
      ) : null}

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          open ? 'mt-6 grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          {open ? <LeadForm offer={offer.id} onClose={() => setOpen(false)} /> : null}
        </div>
      </div>
    </div>
  )
}

export default function DesignHelpPage() {
  const [weeklyOpen, setWeeklyOpen] = useState(false)

  useEffect(() => {
    void trackDesignHelpEvent('design_help_page_view')
  }, [])

  async function openWeekly() {
    void trackDesignHelpEvent('design_help_cta_click', 'weekly')
    setWeeklyOpen(true)
  }

  return (
    <PublicSiteChrome>
      <header className="border-b border-slate-800/70 bg-slate-950">
        <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
          <p className="text-sm font-medium uppercase tracking-widest text-amber-500/90">Design help</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl leading-tight text-white md:text-5xl md:leading-[1.1]">
            Senior product design help, without the big engagement.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-400">
            Sometimes you don&apos;t need an agency, a lengthy proposal, or another full-time hire. You
            just need an experienced designer to help you get unstuck or get something designed.
          </p>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-400">
            Book 90 minutes for focused feedback and direction, or bring me in for a day to work through
            the problem and make something.
          </p>
          <p className="mt-4 text-base text-slate-500">Need more? Longer engagements are available too.</p>
        </div>
      </header>

      <main>
        <section className="border-b border-slate-800/70 bg-[#0a1022]">
          <div className="mx-auto max-w-5xl px-6 py-14 md:py-20">
            <div className="grid gap-6 lg:grid-cols-2">
              {primaryOffers.map((offer) => (
                <OfferPanel key={offer.id} offer={offer} />
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-slate-800/70 bg-slate-950">
          <div className="mx-auto max-w-5xl px-6 py-14 md:py-20">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-500">
              Longer engagement
            </p>
            <h2 className="mt-2 font-display text-3xl text-white md:text-4xl">Need more than a day?</h2>

            <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-8 md:p-10">
              <p className="font-display text-4xl text-white md:text-5xl">$4,000 / week</p>
              <p className="mt-2 text-sm text-slate-500">
                Engaged by the week — and can continue beyond one week when the work calls for it.
              </p>
              <p className="mt-6 max-w-3xl text-sm leading-relaxed text-slate-400 md:text-base">
                If you need ongoing senior product design help, I&apos;m also available for focused
                week-long engagements.
              </p>
              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-400 md:text-base">
                I can embed with your team, work independently on a defined problem, or help push an
                experience from concept through prototype.
              </p>
              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-400 md:text-base">
                Start with a consultation or Design Day to see how we work together—or reach out
                directly if you already know you need more.
              </p>

              {!weeklyOpen ? (
                <button
                  type="button"
                  onClick={openWeekly}
                  className="mt-8 text-sm font-medium text-amber-500 transition-colors hover:text-amber-400"
                >
                  Let&apos;s Talk →
                </button>
              ) : null}

              <div
                className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                  weeklyOpen ? 'mt-6 grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
              >
                <div className="overflow-hidden">
                  {weeklyOpen ? (
                    <LeadForm offer="weekly" onClose={() => setWeeklyOpen(false)} />
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-800/70 bg-[#0a1022]">
          <div className="mx-auto max-w-5xl px-6 py-14 md:py-20">
            <h2 className="font-display text-3xl text-white md:text-4xl">
              A senior designer when you need one.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-400 md:text-base">
              These engagements are a simple way to bring my product design experience into a specific
              problem—without turning it into a large consulting engagement or long-term commitment.
            </p>
            <Link
              to="/work"
              className="mt-8 inline-block text-sm font-medium text-amber-500 transition-colors hover:text-amber-400"
            >
              See my work →
            </Link>
          </div>
        </section>
      </main>
    </PublicSiteChrome>
  )
}
