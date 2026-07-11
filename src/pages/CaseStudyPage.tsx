import { Link, Navigate, useParams } from 'react-router-dom'
import PublicSiteChrome from '../components/case-study/PublicSiteChrome'
import { getCaseStudy } from '../content/caseStudies'

type SectionBlock = {
  id: string
  title: string
  paragraphs: string[]
  bullets: string[]
  visualSuggestions: string[]
}

function buildSectionBlocks(study: NonNullable<ReturnType<typeof getCaseStudy>>): SectionBlock[] {
  const blocks: SectionBlock[] = []

  for (let i = 0; i < study.sections.length; i += 1) {
    const section = study.sections[i]
    if (!section.title) continue

    const block: SectionBlock = {
      id: section.id,
      title: section.title,
      paragraphs: [...section.paragraphs],
      bullets: section.bullets ? [...section.bullets] : [],
      visualSuggestions: section.visualSuggestions ? [...section.visualSuggestions] : [],
    }

    const next = study.sections[i + 1]
    if (next && !next.title) {
      block.paragraphs.push(...next.paragraphs)
      if (next.bullets) block.bullets.push(...next.bullets)
      if (next.visualSuggestions) block.visualSuggestions.push(...next.visualSuggestions)
      i += 1
    }

    blocks.push(block)
  }

  return blocks
}

export default function CaseStudyPage() {
  const { slug } = useParams()
  const study = slug ? getCaseStudy(slug) : undefined

  if (!study) {
    return <Navigate to="/work" replace />
  }

  if (study.placeholder) {
    return (
      <PublicSiteChrome>
        <article className="border-b border-slate-800/70">
          <header className="bg-slate-950">
            <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
              <p className="text-sm font-medium uppercase tracking-widest text-amber-500/90">{study.tag}</p>
              <h1 className="mt-4 font-display text-4xl leading-tight text-white md:text-5xl">{study.title}</h1>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-400">{study.dek}</p>
              {study.meta.map((row) => (
                <p key={row.label} className="mt-6 text-sm text-slate-500">
                  {row.value}
                </p>
              ))}
            </div>
          </header>
          <div className="mx-auto max-w-5xl px-6 py-20 text-center">
            <p className="text-sm uppercase tracking-wider text-slate-500">Full case study coming soon</p>
            <p className="mt-8">
              <Link to="/work" className="text-sm font-medium text-amber-500 hover:text-amber-400">
                ← Back to case studies
              </Link>
            </p>
          </div>
        </article>
      </PublicSiteChrome>
    )
  }

  const sectionBlocks = buildSectionBlocks(study)
  const heroArtLabel = study.heroVisualSuggestions?.[0] ?? 'Hero visual'
  const winkSummary = [
    {
      label: 'Users',
      value: '1M+',
      supporting: 'Designed from scratch and scaled to over 1 million users',
    },
    {
      label: 'Partners',
      value: '40+',
      supporting: 'Unified products from 40+ connected-home brand partners',
    },
    {
      label: 'Setup time',
      value: '30→7 mins',
      supporting: 'Reduced onboarding complexity from thirty minutes to seven',
    },
    {
      label: 'Support calls',
      value: '↓ 85%',
      supporting: 'Design-led improvements reduced customer service call volume',
    },
  ]
  const summaryRows = study.slug === 'wink'
    ? winkSummary
    : study.summary.map((s) => ({
      label: s.label,
      value: s.value,
      supporting: '',
    }))

  return (
    <PublicSiteChrome>
      <article className="border-b border-slate-800/70">
        <header className="relative overflow-hidden border-b border-slate-800/60">
          <div className="absolute inset-0 opacity-30">
            <img src="/hero-ui-loop-poster.svg" alt="" className="h-full w-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-slate-950/70" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/80 to-slate-950" />
          <div className="absolute inset-0 opacity-60" style={{
            background:
              'radial-gradient(1200px 600px at 30% 40%, rgba(245,158,11,0.20), transparent 60%), radial-gradient(900px 500px at 70% 60%, rgba(56,189,248,0.14), transparent 60%)',
          }} />

          <div className="relative mx-auto max-w-5xl px-6 py-16 md:py-24">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_400px]">
              <div>
                <p className="text-sm font-medium uppercase tracking-widest text-amber-500/90">Case study</p>
                <h1 className="mt-4 font-display text-5xl leading-tight text-white md:text-6xl md:leading-[1.08]">{study.title}</h1>
                <p className="mt-4 text-xl font-medium text-slate-400">{study.subtitle}</p>
                <p className="mt-6 max-w-2xl text-sm leading-relaxed text-slate-300">{study.dek}</p>

                <dl className="mt-10 grid gap-x-6 gap-y-6 border-t border-slate-700 pt-8 sm:grid-cols-2">
                  {study.meta.map((row) => (
                    <div key={row.label}>
                      <dt className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-500">{row.label}</dt>
                      <dd className="mt-1 text-sm text-slate-200">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="hidden items-center justify-center bg-slate-700/90 text-sm text-slate-200 lg:flex">
                {heroArtLabel}
              </div>
            </div>
          </div>
        </header>

        {study.summary.length > 0 && (
          <div className="border-b border-slate-800/70 bg-slate-900">
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-6 py-10 sm:grid-cols-2 lg:grid-cols-4">
              {summaryRows.map((s) => (
                <div key={s.label} className="space-y-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-500">{s.label}</p>
                  <p className="text-4xl font-light tracking-[0.02em] text-white">{s.value}</p>
                  {s.supporting ? <p className="text-sm leading-relaxed text-slate-400">{s.supporting}</p> : null}
                </div>
              ))}
            </div>
          </div>
        )}

        {sectionBlocks.map((section, index) => {
          const mediaFirst = index % 2 === 1
          return (
            <section
              key={section.id}
              id={section.id}
              className={`border-b border-slate-800/70 ${index % 2 === 0 ? 'bg-slate-950' : 'bg-[#0a1022]'} scroll-mt-24`}
            >
              <div className="mx-auto max-w-5xl px-6 py-14 md:py-20">
                <div className="grid items-start gap-8 lg:grid-cols-[560px_200px_200px] lg:gap-6">
                  <div className={mediaFirst ? 'lg:order-2' : ''}>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-amber-500">
                      {section.id.replace(/-/g, ' ')}
                    </p>
                    <h2 className="mt-2 font-display text-[30px] leading-[1.25] text-white">{section.title}</h2>

                    <div className="mt-6 space-y-4">
                      {section.paragraphs.map((p, i) => (
                        <p key={`${section.id}-p-${i}`} className="text-sm leading-[1.65] text-slate-400">
                          {p}
                        </p>
                      ))}
                    </div>

                    {section.bullets.length > 0 && (
                      <ul className="mt-5 list-disc space-y-2 pl-5 text-sm leading-[1.65] text-slate-400">
                        {section.bullets.map((b, i) => (
                          <li key={`${section.id}-b-${i}`}>{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className={`grid grid-cols-2 gap-4 sm:grid-cols-2 lg:col-span-2 ${mediaFirst ? 'lg:order-1' : ''}`}>
                    <div className="flex h-56 items-center justify-center rounded-lg bg-slate-700 text-sm text-slate-200">
                      {section.visualSuggestions[0] ?? 'Image placeholder'}
                    </div>
                    <div className="flex h-56 items-center justify-center rounded-lg bg-slate-700 text-sm text-slate-200">
                      {section.visualSuggestions[1] ?? 'Image placeholder'}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )
        })}

      </article>
    </PublicSiteChrome>
  )
}
