import type { ReactNode } from 'react'
import { useState } from 'react'

type TabsValue = string

export function Tabs({
  defaultValue,
  value: controlledValue,
  onValueChange,
  children,
}: {
  defaultValue: TabsValue
  value?: TabsValue
  onValueChange?: (v: TabsValue) => void
  children: ReactNode
}) {
  const [uncontrolled] = useState<TabsValue>(defaultValue)
  const value = controlledValue ?? uncontrolled

  return (
    <div data-tabs-value={value} data-tabs-set={onValueChange ? '1' : '0'}>
      {/*
        Placeholder “primitive” for future work.
        For now we keep it minimal and rely on plain components in pages.
      */}
      {children}
    </div>
  )
}

