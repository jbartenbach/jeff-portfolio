type PageHeaderProps = {
  eyebrow: string
  title: React.ReactNode
  description?: string
  bordered?: boolean
  compact?: boolean
}

export default function PageHeader({
  eyebrow,
  title,
  description,
  bordered = true,
  compact = false,
}: PageHeaderProps) {
  return (
    <header className={bordered ? 'border-b border-slate-800/70 bg-slate-950' : 'bg-slate-950'}>
      <div
        className={
          compact
            ? 'mx-auto max-w-5xl px-6 pb-6 pt-12 md:pb-8 md:pt-14'
            : 'mx-auto max-w-5xl px-6 py-16 md:py-20'
        }
      >
        <p className="text-sm font-medium uppercase tracking-widest text-amber-500/90">{eyebrow}</p>
        <h1 className="mt-4 font-display text-4xl leading-tight text-white md:text-5xl">{title}</h1>
        {description ? (
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-400">{description}</p>
        ) : null}
      </div>
    </header>
  )
}
