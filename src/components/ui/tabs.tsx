import { createContext, useContext, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface TabsContextValue {
  value: string
  onChange: (v: string) => void
}

const TabsContext = createContext<TabsContextValue | null>(null)

interface TabsProps {
  defaultValue: string
  value?: string
  onValueChange?: (v: string) => void
  children: ReactNode
  className?: string
}

export function Tabs({ defaultValue, value, onValueChange, children, className }: TabsProps) {
  const [internal, setInternal] = useState(defaultValue)
  const current = value ?? internal
  const onChange = (v: string) => {
    setInternal(v)
    onValueChange?.(v)
  }

  return (
    <TabsContext.Provider value={{ value: current, onChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  )
}

export function TabsList({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground',
        className,
      )}
      role="tablist"
    >
      {children}
    </div>
  )
}

export function TabsTrigger({ value, children, className }: { value: string; children: ReactNode; className?: string }) {
  const ctx = useContext(TabsContext)!
  const active = ctx.value === value
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={() => ctx.onChange(value)}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all',
        active ? 'bg-card text-foreground shadow-sm' : 'hover:text-foreground',
        className,
      )}
    >
      {children}
    </button>
  )
}

export function TabsContent({ value, children, className }: { value: string; children: ReactNode; className?: string }) {
  const ctx = useContext(TabsContext)
  if (!ctx || ctx.value !== value) return null
  return <div role="tabpanel" className={cn('mt-4', className)}>{children}</div>
}
