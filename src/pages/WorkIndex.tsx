import { Link } from 'react-router-dom'
import Card from '../components/ui/Card'
import PublicSiteChrome from '../components/case-study/PublicSiteChrome'
import { caseStudyList } from '../content/caseStudies'

export default function WorkIndex() {
  return (
    <PublicSiteChrome>
      <main className="border-b border-slate-800/70 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-amber-500">Case studies</p>
          <h1 className="mt-4 font-display text-4xl text-white md:text-5xl">Selected work</h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-400">
            Deep dives into product strategy, craft, and outcomes. More studies are added as they’re published.
          </p>

          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {caseStudyList.map((item) => {
              const to = item.published ? `/work/${item.slug}` : '#'
              const inner = (
                <Card
                  className={`h-full border-slate-800 bg-slate-900/70 p-8 transition-colors ${
                    item.published
                      ? 'group-hover:border-slate-700 group-hover:bg-slate-900'
                      : 'opacity-80'
                  }`}
                >
                  <p className="text-[10px] uppercase tracking-[0.1em] text-amber-500">{item.tag}</p>
                  <h2 className="mt-3 font-display text-2xl leading-tight text-white">{item.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">{item.blurb}</p>
                  <p className="mt-8 text-xs text-slate-500">{item.meta}</p>
                  {!item.published && (
                    <p className="mt-4 text-xs font-medium uppercase tracking-wider text-slate-600">Coming soon</p>
                  )}
                </Card>
              )

              return item.published ? (
                <Link key={item.slug} to={to} className="group block">
                  {inner}
                </Link>
              ) : (
                <div key={item.slug} className="group block cursor-not-allowed">
                  {inner}
                </div>
              )
            })}
          </div>

          <p className="mt-12 text-center text-sm text-slate-500">
            <Link to="/" className="text-amber-500 hover:underline">
              ← Back to homepage
            </Link>
          </p>
        </div>
      </main>
    </PublicSiteChrome>
  )
}
