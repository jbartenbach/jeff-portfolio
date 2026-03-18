import { Link } from 'react-router-dom'

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
        <section className="mx-auto max-w-5xl px-6 py-20 md:py-28">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-amber-500/90">
            Product &amp; UX Design Leader
          </p>
          <h1 className="font-display text-4xl leading-tight text-white md:text-6xl md:leading-[1.08]">
            I shape products people trust—
            <span className="text-slate-500">strategy, craft, and teams.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-slate-400">
            I partner with founders and product orgs to clarify vision, align stakeholders, and ship
            experiences that feel inevitable. Former hands-on designer; today I lead direction,
            systems, and the humans who build them.
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
                <article
                  key={c.t}
                  className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-8 transition-colors hover:border-slate-700"
                >
                  <h3 className="text-lg font-semibold text-white group-hover:text-amber-400/90 transition-colors">
                    {c.t}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">{c.d}</p>
                </article>
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
