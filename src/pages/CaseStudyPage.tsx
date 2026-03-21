import { Link, Navigate, useParams } from 'react-router-dom'
import PublicSiteChrome from '../components/case-study/PublicSiteChrome'
import { getCaseStudy } from '../content/caseStudies'

export default function CaseStudyPage() {
  const { slug } = useParams()
  const study = slug ? getCaseStudy(slug) : undefined

  if (!study) {
    return <Navigate to="/work" replace />
  }

  return (
    <PublicSiteChrome>
      <article className="border-b border-slate-800/70">
        <header className="border-b border-slate-800/60 bg-slate-900/40">
          <div className="mx-auto max-w-3xl px-6 py-12 md:py-16">
            <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-amber-500">Case study</p>
            <h1 className="mt-4 font-display text-4xl leading-tight text-white md:text-5xl">{study.title}</h1>
            <p className="mt-2 text-lg text-slate-400">{study.subtitle}</p>
            <p className="mt-6 text-sm leading-relaxed text-slate-300">{study.dek}</p>

            <dl className="mt-10 grid gap-4 border-t border-slate-800/80 pt-10 sm:grid-cols-2">
              {study.meta.map((row) => (
                <div key={row.label}>
                  <dt className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{row.label}</dt>
                  <dd className="mt-1 text-sm text-slate-200">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </header>

        {study.summary.length > 0 && (
          <div className="border-b border-slate-800/70 bg-slate-950">
            <div className="mx-auto grid max-w-6xl gap-px bg-slate-800/70 sm:grid-cols-2 lg:grid-cols-4">
              {study.summary.map((s) => (
                <div key={s.label} className="bg-slate-950 p-8">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{s.label}</p>
                  <p className="mt-2 font-display text-3xl text-white">{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {study.heroVisualSuggestions && study.heroVisualSuggestions.length > 0 && (
          <div className="border-b border-slate-800/70 bg-slate-900/30">
            <div className="mx-auto max-w-3xl px-6 py-8">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Visual suggestions</p>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-500">
                {study.heroVisualSuggestions.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="mx-auto max-w-3xl px-6 py-14 md:py-20">
          <div className="max-w-none">
            {study.sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className={`scroll-mt-24 last:mb-0 ${
                  section.title ? 'mb-14' : 'mb-10 mt-6'
                }`}
              >
                {section.title ? (
                  <h2 className="mb-6 font-display text-2xl tracking-tight text-white">{section.title}</h2>
                ) : null}
                {section.paragraphs.map((p, i) => (
                  <p key={`${section.id}-p-${i}`} className="mb-4 text-sm leading-relaxed text-slate-400 last:mb-0">
                    {p}
                  </p>
                ))}
                {section.bullets && section.bullets.length > 0 && (
                  <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-400">
                    {section.bullets.map((b, i) => (
                      <li key={`${section.id}-b-${i}`}>{b}</li>
                    ))}
                  </ul>
                )}
                {section.visualSuggestions && section.visualSuggestions.length > 0 && (
                  <div className="mt-8 rounded-lg border border-slate-800/80 bg-slate-900/40 p-5">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Visual suggestions</p>
                    <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-500">
                      {section.visualSuggestions.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            ))}
          </div>

          <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800 pt-10">
            <Link
              to="/work"
              className="text-sm font-medium text-amber-500 hover:text-amber-400 transition-colors"
            >
              ← All case studies
            </Link>
            <Link to="/#contact" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
              Get in touch
            </Link>
          </div>
        </div>
      </article>
    </PublicSiteChrome>
  )
}
