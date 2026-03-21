import { Link } from 'react-router-dom'
import Card from '../components/ui/Card'

export default function PortfolioHome() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <span className="font-display text-2xl tracking-tight text-white">Jeff Bartenbach</span>
          <nav className="flex gap-8 text-sm font-medium text-slate-400">
            <a href="#work" className="hover:text-white transition-colors">
              Work
            </a>
            <a href="#about" className="hover:text-white transition-colors">
              About
            </a>
            <a href="#contact" className="hover:text-white transition-colors">
              Contact
            </a>
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

        <section className="border-y border-slate-800/70">
          <div className="mx-auto grid max-w-6xl gap-px bg-slate-800/70 md:grid-cols-4">
            {[
              { n: '20+', l: 'Years of craft across hardware, software, health, and consumer tech' },
              { n: '0→1M', l: 'Founded design teams and scaled products to over a million users' },
              { n: '3×', l: 'Average order value lift while improving conversion and retention' },
              { n: '85%', l: 'Reduction in customer service calls through design-led product improvement' },
            ].map((s) => (
              <div key={s.n} className="bg-slate-950 p-8 hover:bg-slate-900/70 transition-colors">
                <div className="font-display text-5xl leading-none text-white">
                  {s.n.replace('+', '')}
                  {s.n.includes('+') ? <em className="text-amber-500 not-italic">+</em> : null}
                  {s.n.includes('×') ? <em className="text-amber-500 not-italic">×</em> : null}
                </div>
                <p className="mt-3 text-sm text-slate-400">{s.l}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="about" className="border-b border-slate-800/70 py-20">
          <div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-[260px_1fr]">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500">What I do</p>
              <h2 className="mt-4 font-display text-3xl leading-tight text-white">
                Design leadership at <em className="text-slate-400 not-italic">every layer</em> of the stack.
              </h2>
            </div>
            <div className="grid gap-px bg-slate-800/70 md:grid-cols-3">
              {[
                ['01', 'Design leadership', 'Built teams from 0 to 7. Established hiring, critique culture, and cross-functional practice that outlasts any single project.'],
                ['02', '0-to-1 product', 'Founded and shipped first versions of Wink, Maximus Health platform, and others — from concept through engineering handoff.'],
                ['03', 'Systems at scale', 'Designed architecture for 40+ brand partners and 1M+ users. Built design systems that teams actually use.'],
                ['04', 'Research & strategy', 'Organized research teams, ran prototyping cycles, distilled user insight into product direction that moves the business.'],
                ['05', 'Cross-functional craft', 'Fluent across hardware, software, mobile, and web. Comfortable presenting design strategy to C-suite and 15-brand audiences.'],
                ['06', 'AI-native prototyping', 'Figma AI workflows and full React prototypes built with AI agents in Cursor IDE — compressing design intent and engineering reality.'],
              ].map(([num, title, desc]) => (
                <Card key={num} className="rounded-none border-0 bg-slate-950 p-7 shadow-none">
                  <p className="font-display text-sm text-slate-500">{num}</p>
                  <h3 className="mt-3 text-base font-semibold text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-slate-800/70 bg-slate-900/60 py-16">
          <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-2">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-amber-500">Now · AI-native practice</p>
              <h2 className="mt-4 font-display text-4xl leading-tight text-white">
                Design practice,<br />
                <em className="text-slate-400 not-italic">AI-augmented.</em>
              </h2>
            </div>
            <div>
              <p className="text-sm leading-relaxed text-slate-400">
                I don&apos;t use AI to replace judgment — I use it to compress time. Figma AI tooling
                for accelerated ideation, full React-driven prototypes built with AI agents in Cursor IDE.
                The result: higher-fidelity proof-of-concepts, faster design-to-handoff cycles, and a
                practice that stays ahead of where the industry is going.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {['Figma AI', 'Cursor IDE', 'React prototypes', 'AI agents', 'Design systems'].map((pill) => (
                  <span key={pill} className="rounded-full border border-slate-600 px-3 py-1 text-xs text-slate-300">
                    {pill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="work" className="border-b border-slate-800/70 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-10 flex items-baseline justify-between">
              <h2 className="font-display text-4xl text-white">Selected work</h2>
              <Link
                to="/work"
                className="text-xs uppercase tracking-wider text-slate-500 hover:text-amber-500 transition-colors"
              >
                All case studies →
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  tag: 'Smart Home · Platform · Hardware',
                  title: 'Wink',
                  desc: 'Founding designer to VP. Built the team, designed the platform, shipped 60+ products across 40+ brand partners. Hub 2 reduced setup from 30 to 7 minutes.',
                  meta: '2013–2018 · Founding Designer → VP',
                  href: '/work/wink',
                  placeholder: false,
                },
                {
                  tag: 'Placeholder · Case study',
                  title: 'Lorem ipsum dolor',
                  desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus posuere velit aliquet.',
                  meta: 'TBD',
                  href: '/work',
                  placeholder: true,
                },
                {
                  tag: 'Placeholder · Case study',
                  title: 'Sit amet consectetur',
                  desc: 'Sed posuere consectetur est at lobortis. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.',
                  meta: 'TBD',
                  href: '/work',
                  placeholder: true,
                },
              ].map((w) => (
                <Link key={w.title} to={w.href} className="group">
                  <Card
                    className={`h-full border-slate-800 bg-slate-900/70 p-8 transition-colors group-hover:border-slate-700 group-hover:bg-slate-900 ${
                      w.placeholder ? 'opacity-80' : ''
                    }`}
                  >
                    <p className="text-[10px] uppercase tracking-[0.1em] text-amber-500">{w.tag}</p>
                    <h3 className="mt-3 font-display text-2xl leading-tight text-white">{w.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-400">{w.desc}</p>
                    <p className="mt-8 text-xs text-slate-500">{w.meta}</p>
                    {w.placeholder ? (
                      <p className="mt-4 text-xs font-medium uppercase tracking-wider text-slate-600">Coming soon</p>
                    ) : null}
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer id="contact" className="border-t border-slate-800 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-center md:flex-row md:text-left">
          <span className="font-display text-2xl text-white">Jeff Bartenbach</span>
          <p className="text-sm text-slate-400">
            <a href="tel:2067347275" className="text-amber-500 hover:opacity-80">206.734.7275</a>
            {' '}·{' '}
            <a href="mailto:jbartenbach@gmail.com" className="text-amber-500 hover:opacity-80">jbartenbach@gmail.com</a>
          </p>
        </div>
      </footer>
    </div>
  )
}
