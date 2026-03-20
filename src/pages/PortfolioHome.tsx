import { Link } from 'react-router-dom'
import Card from '../components/ui/Card'

export default function PortfolioHome() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <span className="font-display text-2xl tracking-tight text-white">Jeff</span>
          <nav className="flex gap-8 text-sm font-medium text-slate-400">
            <a href="#work" className="hover:text-white transition-colors">
              Work
            </a>
            <a href="#leadership" className="hover:text-white transition-colors">
              Leadership
            </a>
            <a href="#contact" className="hover:text-white transition-colors">
              Contact
            </a>
            <Link to="/admin" className="text-amber-400/90 hover:text-amber-300 transition-colors">
              Admin
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-slate-800/60">
          <div className="absolute inset-0">
            <video
              className="h-full w-full object-cover opacity-30"
              autoPlay
              muted
              loop
              playsInline
              poster="/hero-ui-loop-poster.svg"
            >
              {/* Placeholder path — replace with your real reel later */}
              <source src="/hero-ui-loop.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-slate-950/70" />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/80 to-slate-950" />
          </div>

          {/* Fallback animated shimmer (shows even if video 404s) */}
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background:
                'radial-gradient(1200px 600px at 30% 40%, rgba(245,158,11,0.20), transparent 60%), radial-gradient(900px 500px at 70% 60%, rgba(56,189,248,0.14), transparent 60%)',
              animation: 'heroGlow 10s ease-in-out infinite',
            }}
          />
          <style>{`
            @keyframes heroGlow {
              0%, 100% { filter: saturate(1) blur(0px); transform: translateY(0px); }
              50% { filter: saturate(1.15) blur(0.4px); transform: translateY(8px); }
            }
          `}</style>

          <div className="relative mx-auto max-w-5xl px-6 py-20 md:py-28">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-amber-500/90">
            Product &amp; UX Design Leader
          </p>
          <h1 className="font-display text-4xl leading-tight text-white md:text-6xl md:leading-[1.08]">
            I shape products people trust—
            <span className="text-slate-500">strategy, craft, and teams.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-slate-400">
            I partner with founders and product orgs to clarify vision, align stakeholders, and ship
            experiences that feel inevitable—fast. I’m most at home where strategy meets craft:
            exploring new interaction patterns, prototyping relentlessly, and using AI to accelerate
            discovery, iteration, and decision-making.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#work"
              className="rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-amber-400 transition-colors"
            >
              View selected work
            </a>
            <a
              href="#contact"
              className="rounded-full border border-slate-600 px-6 py-3 text-sm font-semibold text-slate-200 hover:border-slate-400 transition-colors"
            >
              Get in touch
            </a>
          </div>
          </div>
        </section>

        <section id="work" className="border-t border-slate-800/80 bg-slate-900/40 py-20">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="font-display text-3xl text-white md:text-4xl">Selected work</h2>
            <p className="mt-3 max-w-xl text-slate-400">
              Case studies and narratives—replace these cards with your real projects.
            </p>
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {[
                {
                  t: 'Platform redesign',
                  d: 'Unifying a fragmented B2B workflow into a single, learnable surface.',
                },
                {
                  t: 'Design org at scale',
                  d: 'Rituals, crits, and hiring—how we raised the bar without slowing delivery.',
                },
                {
                  t: '0→1 product',
                  d: 'Discovery through launch: narrative, IA, and a design system in eight weeks.',
                },
                {
                  t: 'Accessibility push',
                  d: 'Partnering with eng to ship WCAG-aligned patterns across the stack.',
                },
              ].map((c) => (
                <Card
                  key={c.t}
                  className="group border-slate-800 bg-slate-900/60 p-8 transition-colors hover:border-slate-700"
                >
                  <h3 className="text-lg font-semibold text-white group-hover:text-amber-400/90 transition-colors">
                    {c.t}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">{c.d}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="leadership" className="py-20">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="font-display text-3xl text-white md:text-4xl">How I lead</h2>
            <ul className="mt-10 grid gap-6 md:grid-cols-3">
              {[
                {
                  h: 'Clarity first',
                  b: 'Frame problems so teams disagree on the right things—not the basics.',
                },
                { h: 'Systems thinking', b: 'Design scales when patterns, not pages, carry the load.' },
                { h: 'People over process', b: 'Hire and coach so great work is the default, not heroics.' },
              ].map((x) => (
                <li key={x.h} className="rounded-2xl border border-slate-800 p-6">
                  <h3 className="font-semibold text-amber-500/90">{x.h}</h3>
                  <p className="mt-2 text-sm text-slate-400 leading-relaxed">{x.b}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="contact" className="border-t border-slate-800/80 py-20">
          <div className="mx-auto max-w-5xl px-6 text-center">
            <h2 className="font-display text-3xl text-white md:text-4xl">Let&apos;s talk</h2>
            <p className="mx-auto mt-4 max-w-md text-slate-400">
              Add your email or Calendly link here when you&apos;re ready.
            </p>
            <a
              href="mailto:hello@example.com"
              className="mt-8 inline-block rounded-full bg-white px-8 py-3 text-sm font-semibold text-slate-950 hover:bg-slate-200 transition-colors"
            >
              hello@example.com
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800 py-8 text-center text-xs text-slate-600">
        © {new Date().getFullYear()} — Portfolio
      </footer>
    </div>
  )
}
