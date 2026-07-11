import { Link } from 'react-router-dom'
import Card from '../components/ui/Card'
import PublicSiteChrome from '../components/case-study/PublicSiteChrome'
import { AIPracticeSection, WhatIDoSection } from '../components/site/AboutSections'
import { sectionLabelClass } from '../content/siteContent'

export default function PortfolioHome() {
  const stats = [
    {
      figure: (
        <>
          <span className="text-white">20</span>
          <span className="text-amber-500">+</span>
        </>
      ),
      label: 'Years of craft across hardware, software, health, and consumer tech',
    },
    {
      figure: (
        <>
          <span className="text-white">0</span>
          <span className="text-amber-500">→</span>
          <span className="text-white">1M</span>
        </>
      ),
      label: 'Founded design teams and scaled products to over a million users',
    },
    {
      figure: (
        <>
          <span className="text-white">3</span>
          <span className="text-amber-500">x</span>
        </>
      ),
      label: 'Average order value lift while improving conversion and retention',
    },
    {
      figure: (
        <>
          <span className="text-white">85</span>
          <span className="text-amber-500">%</span>
        </>
      ),
      label: 'Reduction in customer service calls through design-led product improvement',
    },
  ] as const

  return (
    <PublicSiteChrome>
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
              <source src="/hero-ui-loop.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-slate-950/70" />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/80 to-slate-950" />
          </div>

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
            <p className={`mb-4 ${sectionLabelClass}`}>Product &amp; UX Design Leader</p>
            <h1 className="font-display text-4xl leading-tight text-white md:text-6xl md:leading-[1.08]">
              I shape products people trust—
              <span className="text-slate-500">strategy, craft, and teams.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-slate-400">
              I partner with founders and product orgs to clarify vision, align stakeholders, and ship
              experiences that feel inevitable—fast. I&apos;m most at home where strategy meets craft:
              exploring new interaction patterns, prototyping relentlessly, and using AI to accelerate
              discovery, iteration, and decision-making.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/work"
                className="rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-amber-400 transition-colors"
              >
                View selected work
              </Link>
              <Link
                to="/contact"
                className="rounded-full border border-slate-600 px-6 py-3 text-sm font-semibold text-slate-200 hover:border-slate-400 transition-colors"
              >
                Get in touch
              </Link>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-800/70 bg-slate-900">
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-6 py-10 md:grid-cols-4 md:gap-6">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="font-sans text-4xl font-light leading-none tracking-tight">
                  {s.figure}
                </div>
                <p className="mt-3 text-sm text-slate-400">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        <WhatIDoSection />

        <AIPracticeSection />

        <section className="border-b border-slate-800/70 py-20">
          <div className="mx-auto max-w-5xl px-6">
            <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className={sectionLabelClass}>Case studies</p>
                <h2 className="mt-2 font-display text-3xl leading-tight text-white">Selected Work</h2>
              </div>
              <Link
                to="/work"
                className="shrink-0 text-xs font-medium uppercase tracking-wider text-slate-500 hover:text-amber-500 transition-colors"
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
                  tag: 'E-commerce subscription',
                  title: 'Daily Harvest',
                  desc: 'Subscription UX and account flows for a scaled consumer health brand, focused on reducing churn and improving retention moments.',
                  meta: 'Highlight',
                  href: '/work',
                  placeholder: true,
                },
                {
                  tag: 'Personalized medicine',
                  title: 'Maximus',
                  desc: 'Product architecture and core flows for a fast-growing health platform, spanning onboarding, care plans, and lifecycle touchpoints.',
                  meta: 'Highlight',
                  href: '/work',
                  placeholder: true,
                },
              ].map((w) => (
                <Link key={w.title} to={w.href} className="group">
                  <Card
                    className={`h-full rounded-2xl border-[1pt] border-solid !border-[#4B505A] !bg-[#0F172A] p-8 shadow-none transition-colors group-hover:border-2 group-hover:!border-white group-hover:!bg-[#1E2835] ${
                      w.placeholder ? 'opacity-80' : ''
                    }`}
                  >
                    <p className="text-[10px] uppercase tracking-[0.1em] text-amber-500">{w.tag}</p>
                    <h3 className="mt-3 text-2xl font-semibold leading-tight text-white">{w.title}</h3>
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
    </PublicSiteChrome>
  )
}
