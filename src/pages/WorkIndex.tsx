import { Link } from 'react-router-dom'
import Card from '../components/ui/Card'
import PublicSiteChrome from '../components/case-study/PublicSiteChrome'
import PageHeader from '../components/site/PageHeader'
import { caseStudyList } from '../content/caseStudies'

function CaseStudyImage({ title, imageSrc, imageAlt }: { title: string; imageSrc?: string; imageAlt?: string }) {
  if (imageSrc) {
    return (
      <img
        src={imageSrc}
        alt={imageAlt ?? `${title} case study`}
        className="h-full w-full object-cover"
      />
    )
  }

  return (
    <div className="flex h-full min-h-[200px] w-full items-center justify-center bg-slate-800/80 text-sm text-slate-500 md:min-h-[240px]">
      Image placeholder
    </div>
  )
}

export default function WorkIndex() {
  return (
    <PublicSiteChrome>
      <PageHeader eyebrow="Work" title="Case studies" bordered={false} compact />
      <main className="border-b border-slate-800/70 pb-20 pt-2">
        <div className="mx-auto max-w-5xl px-6">
          <div className="flex flex-col gap-6">
            {caseStudyList.map((item) => {
              const card = (
                <Card
                  className={`overflow-hidden rounded-2xl border-[1pt] border-solid !border-[#4B505A] !bg-[#0F172A] p-0 shadow-none transition-colors ${
                    item.published
                      ? 'group-hover:border-2 group-hover:!border-white group-hover:!bg-[#1E2835]'
                      : 'opacity-80'
                  }`}
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-[42%] md:shrink-0 md:border-r md:border-slate-800/80">
                      <CaseStudyImage title={item.title} imageSrc={item.imageSrc} imageAlt={item.imageAlt} />
                    </div>
                    <div className="flex flex-1 flex-col p-8 md:p-10">
                      <p className="text-[10px] uppercase tracking-[0.1em] text-amber-500">{item.tag}</p>
                      <h2 className="mt-3 font-display text-2xl leading-tight text-white md:text-3xl">{item.title}</h2>
                      <p className="mt-3 text-sm leading-relaxed text-slate-400 md:text-base">{item.blurb}</p>
                      <p className="mt-6 text-xs text-slate-500">{item.meta}</p>
                      {item.published ? (
                        <span className="mt-8 self-end text-sm font-medium text-amber-500 transition-colors group-hover:text-amber-400">
                          View case study →
                        </span>
                      ) : (
                        <p className="mt-8 text-xs font-medium uppercase tracking-wider text-slate-600">Coming soon</p>
                      )}
                    </div>
                  </div>
                </Card>
              )

              return item.published ? (
                <Link key={item.slug} to={`/work/${item.slug}`} className="group block">
                  {card}
                </Link>
              ) : (
                <div key={item.slug} className="group block cursor-not-allowed">
                  {card}
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </PublicSiteChrome>
  )
}
