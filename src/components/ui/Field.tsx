import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}

const base = 'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm'

export function TextField(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cx(base, props.className)} />
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cx(base, props.className)} />
}

export function SelectField(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cx(base, props.className)} />
}

