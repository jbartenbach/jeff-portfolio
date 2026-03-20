import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'accent' | 'danger'
type Size = 'sm' | 'md'

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}

export default function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: Variant
  size?: Size
}) {
  const base =
    'inline-flex items-center justify-center rounded-lg font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50'
  const variants: Record<Variant, string> = {
    primary: 'bg-slate-900 text-white hover:bg-slate-800',
    secondary: 'border border-slate-200 bg-white text-slate-900 hover:bg-slate-50',
    ghost: 'text-slate-700 hover:bg-slate-100',
    accent: 'bg-amber-600 text-white hover:bg-amber-500',
    danger: 'bg-red-900 text-white hover:bg-red-800',
  }
  const sizes: Record<Size, string> = {
    sm: 'px-3 py-2 text-xs',
    md: 'px-4 py-2 text-sm',
  }

  return (
    <button
      {...props}
      className={cx(base, variants[variant], sizes[size], className)}
    >
      {children}
    </button>
  )
}

