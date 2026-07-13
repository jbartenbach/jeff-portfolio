import { Link, Navigate, useParams } from 'react-router-dom'
import PublicSiteChrome from '../components/case-study/PublicSiteChrome'
import WinkPrototype from '../components/case-study/WinkPrototype'
import { getCaseStudy } from '../content/caseStudies'

function sectionEyebrow(section: { eyebrow?: string; id: string }) {
  return section.eyebrow ?? section.id.replace(/-/g, ' ')
}

/** Highlight +, →, ↓, and > in amber to match homepage / Figma stats treatment. */
function StatValue({ value }: { value: string }) {
  const parts = value.split(/([+→↓>])/)
  return (
    <>
      {parts.map((part, i) =>
        part === '+' || part === '→' || part === '↓' || part === '>' ? (
          <span key={`${part}-${i}`} className="text-amber-500">
            {part}
          </span>
        ) : (
          <span key={`${part}-${i}`}>{part}</span>
        ),
      )}
    </>
  )
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

  const heroImageSrc = study.heroImageSrc ?? study.heroVisualSuggestions?.[0]
  const heroImageAlt = study.heroImageAlt ?? `${study.title} case study`

  return (
    <PublicSiteChrome>
      <article className="border-b border-slate-800/70">
        <header className="border-b border-slate-800/60 bg-slate-950">
          <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
            <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-12">
              <div>
                <p className="text-sm font-medium uppercase tracking-widest text-amber-500/90">Case study</p>
                <h1 className="mt-2 font-display text-5xl leading-tight text-white md:text-6xl md:leading-[1.08]">
                  {study.title}
                </h1>
                <p className="mt-4 font-display text-2xl leading-snug text-slate-300 md:text-3xl">{study.subtitle}</p>

                {heroImageSrc && heroImageSrc.startsWith('/') ? (
                  <div className="mt-6 overflow-hidden rounded-xl bg-[#dbe8f0] lg:hidden">
                    <img
                      src={heroImageSrc}
                      alt={heroImageAlt}
                      className="aspect-[3/2] w-full object-cover object-center"
                    />
                  </div>
                ) : null}

                <p className="mt-6 max-w-2xl text-sm leading-relaxed text-slate-400 md:text-base">
                  {study.dek}
                </p>

                <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-slate-800 pt-8">
                  {study.meta.map((row) => (
                    <div key={row.label}>
                      <dt className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-500">{row.label}</dt>
                      <dd className="mt-1 text-sm text-slate-200">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {heroImageSrc && heroImageSrc.startsWith('/') ? (
                <div className="hidden overflow-hidden rounded-xl bg-[#dbe8f0] lg:block">
                  <img
                    src={heroImageSrc}
                    alt={heroImageAlt}
                    className="aspect-[3/2] w-full object-cover object-center"
                  />
                </div>
              ) : null}
            </div>
          </div>
        </header>

        {study.summary.length > 0 && (
          <div className="border-b border-slate-800/70 bg-slate-900">
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-6 py-10 sm:grid-cols-2 lg:grid-cols-4">
              {study.summary.map((s, index) => (
                <div key={s.label ?? `summary-${index}`} className="space-y-2">
                  {s.label ? (
                    <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-500">{s.label}</p>
                  ) : null}
                  <p className="text-4xl font-light tracking-[0.02em] text-white">
                    <StatValue value={s.value} />
                  </p>
                  {s.supporting ? <p className="text-sm leading-relaxed text-slate-400">{s.supporting}</p> : null}
                </div>
              ))}
            </div>
          </div>
        )}

        {study.sections.map((section, index) => {
          const mediaFirst = index % 2 === 0
          const images = section.images ?? []
          const visuals = section.visualSuggestions ?? []
          const hasPrototype = Boolean(section.prototype)
          const hasVisuals = hasPrototype || images.length > 0 || visuals.length > 0

          return (
            <section
              key={section.id}
              id={section.id}
              className={`border-b border-slate-800/70 ${index % 2 === 0 ? 'bg-[#0a1022]' : 'bg-slate-950'} scroll-mt-24`}
            >
              <div className="mx-auto max-w-5xl px-6 py-14 md:py-20">
                <div
                  className={
                    hasVisuals
                      ? 'grid items-start gap-8 lg:grid-cols-2 lg:gap-12'
                      : 'max-w-3xl'
                  }
                >
                  <div className={mediaFirst && hasVisuals ? 'lg:order-2' : ''}>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-500">
                      {sectionEyebrow(section)}
                    </p>
                    <h2 className="mt-2 font-display text-[30px] leading-[1.25] text-white md:text-[32px]">
                      {section.title}
                    </h2>

                    {section.paragraphs.length > 0 && (
                      <div className="mt-6 space-y-4">
                        {section.paragraphs.map((p, i) => (
                          <p key={`${section.id}-p-${i}`} className="text-sm leading-[1.65] text-slate-400 md:text-base">
                            {p}
                          </p>
                        ))}
                      </div>
                    )}

                    {section.bullets && section.bullets.length > 0 && (
                      <ul className="mt-5 list-disc space-y-2 pl-5 text-sm leading-[1.65] text-slate-400 md:text-base">
                        {section.bullets.map((b, i) => (
                          <li key={`${section.id}-b-${i}`}>{b}</li>
                        ))}
                      </ul>
                    )}

                    {section.bulletGroups?.map((group, groupIndex) => (
                      <div key={`${section.id}-group-${groupIndex}`} className="mt-5">
                        {group.label ? (
                          <p className="text-sm leading-[1.65] text-slate-400 md:text-base">{group.label}</p>
                        ) : null}
                        <ul className={`list-disc space-y-2 pl-5 text-sm leading-[1.65] text-slate-400 md:text-base ${group.label ? 'mt-2' : ''}`}>
                          {group.items.map((item, itemIndex) => (
                            <li key={`${section.id}-group-${groupIndex}-item-${itemIndex}`}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}

                    {section.closingParagraphs && section.closingParagraphs.length > 0 && (
                      <div className="mt-6 space-y-4">
                        {section.closingParagraphs.map((p, i) => (
                          <p key={`${section.id}-closing-${i}`} className="text-sm leading-[1.65] text-slate-400 md:text-base">
                            {p}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>

                  {hasVisuals ? (
                    <div className={mediaFirst ? 'lg:order-1' : ''}>
                      {section.prototype === 'wink' ? (
                        <WinkPrototype />
                      ) : images.length > 0 ? (
                        <div
                          className={
                            images.length === 1
                              ? ''
                              : images.length === 3
                                ? 'grid grid-cols-3 gap-3'
                                : 'grid grid-cols-2 gap-4'
                          }
                        >
                          {images.map((image) => (
                            <div
                              key={image.src}
                              className="overflow-hidden rounded-lg bg-slate-800/90"
                            >
                              <img
                                src={image.src}
                                alt={image.alt}
                                className="h-auto w-full object-contain"
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-4">
                          {visuals.map((label, visualIndex) => (
                            <div
                              key={`${section.id}-visual-${visualIndex}`}
                              className="flex aspect-[9/16] items-end justify-center rounded-lg bg-slate-800/90 p-4 text-center text-xs text-slate-400"
                            >
                              {label}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
            </section>
          )
        })}

        {study.closingColumns && study.closingColumns.length > 0 && (
          <section className="border-b border-slate-800/70 bg-slate-950">
            <div className="mx-auto grid max-w-5xl gap-12 px-6 py-14 md:grid-cols-2 md:py-20">
              {study.closingColumns.map((column) => (
                <div key={column.eyebrow}>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-500">
                    {column.eyebrow}
                  </p>
                  <h2 className="mt-2 font-display text-[30px] leading-[1.25] text-white">{column.title}</h2>
                  <div className="mt-6 space-y-4">
                    {column.paragraphs.map((p, i) => (
                      <p key={`${column.eyebrow}-p-${i}`} className="text-sm leading-[1.65] text-slate-400 md:text-base">
                        {p}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </article>
    </PublicSiteChrome>
  )
}
