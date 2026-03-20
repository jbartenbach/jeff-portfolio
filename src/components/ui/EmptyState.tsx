import type { ReactNode } from 'react'
import Card from './Card'
import Button from './Button'

export default function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description?: ReactNode
  action?: { label: string; onClick: () => void }
}) {
  return (
    <Card className="bg-slate-50">
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      {description ? <div className="mt-2 text-sm text-slate-500">{description}</div> : null}
      {action ? (
        <div className="mt-4">
          <Button variant="secondary" onClick={action.onClick}>
            {action.label}
          </Button>
        </div>
      ) : null}
    </Card>
  )
}

