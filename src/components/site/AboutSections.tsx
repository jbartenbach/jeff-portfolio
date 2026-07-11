import Card from '../ui/Card'
import { aiPracticeContent, sectionLabelClass, whatIDoItems } from '../../content/siteContent'

export function WhatIDoSection() {
  return (
    <section className="border-b border-slate-800/70 py-20">
      <div className="mx-auto grid max-w-5xl gap-10 px-6 lg:grid-cols-[260px_1fr]">
        <div>
          <p className={sectionLabelClass}>What I do</p>
          <h2 className="mt-4 font-display text-3xl leading-tight text-white">
            Design leadership at <em className="text-slate-400 not-italic">every layer</em> of the stack.
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {whatIDoItems.map(([num, title, desc]) => (
            <Card
              key={num}
              className="rounded-[4px] border-0 bg-slate-900 p-7 shadow-none"
              style={{ backgroundColor: '#161B28' }}
            >
              <p className="font-sans text-lg font-semibold tabular-nums leading-none text-slate-500">{num}</p>
              <h3 className="mt-2 text-base font-semibold leading-snug text-white">{title}</h3>
              <p className="mt-1.5 text-sm leading-snug text-slate-400">{desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export function AIPracticeSection() {
  return (
    <section className="border-b border-slate-800/70 bg-slate-900/60 py-16">
      <div className="mx-auto grid max-w-5xl gap-12 px-6 lg:grid-cols-2">
        <div>
          <p className={sectionLabelClass}>{aiPracticeContent.eyebrow}</p>
          <h2 className="mt-4 font-display text-3xl leading-tight text-white">
            {aiPracticeContent.title}
            <br />
            <em className="text-slate-400 not-italic">{aiPracticeContent.titleEmphasis}</em>
          </h2>
        </div>
        <div>
          <p className="text-sm leading-relaxed text-slate-400">{aiPracticeContent.body}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {aiPracticeContent.pills.map((pill) => (
              <span key={pill} className="rounded-full border border-slate-600 px-3 py-1 text-xs text-slate-300">
                {pill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
