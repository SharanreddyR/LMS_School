import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './button'

interface SheetProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  title?: string
  description?: string
  className?: string
}

export function Sheet({ open, onClose, children, title, description, className }: SheetProps) {
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div
        className={cn(
          'absolute inset-y-0 right-0 flex w-full max-w-lg flex-col border-l border-border bg-card shadow-2xl animate-in slide-in-from-right',
          className,
        )}
        role="dialog"
        aria-modal
        aria-labelledby={title ? 'sheet-title' : undefined}
      >
        <div className="flex items-start justify-between border-b border-border px-6 py-4">
          <div>
            {title && <h2 id="sheet-title" className="text-lg font-semibold">{title}</h2>}
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}
