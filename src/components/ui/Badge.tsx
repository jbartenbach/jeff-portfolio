import type { HTMLAttributes, ReactNode } from 'react'

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}

type Variant = 'neutral' | 'success' | 'warning' | 'info' | 'danger' | 'accent'
type Size = 'sm' | 'md'

export default function Badge({
  children,
  className,
  variant = 'neutral',
  size = 'sm',
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode
  variant?: Variant
  size?: Size
}) {
  const variants: Record<Variant, string> = {
    neutral: 'bg-slate-100 text-slate-700',
    success: 'bg-emerald-100 text-emerald-800',
    warning: 'bg-amber-100 text-amber-900',
    info: 'bg-blue-100 text-blue-900',
    danger: 'bg-red-100 text-red-900',
    accent: 'bg-amber-100 text-amber-900',
  }
  const sizes: Record<Size, string> = {
    sm: 'px-2 py-0.5 text-xs font-medium',
    md: 'px-3 py-1 text-sm font-medium',
  }

  return (
    <span
      {...props}
      className={cx('inline-flex items-center rounded-full', variants[variant], sizes[size], className)}
    >
      {children}
    </span>
  )
}

