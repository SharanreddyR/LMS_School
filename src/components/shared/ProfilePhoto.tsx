import { cn } from '@/lib/utils'

interface ProfilePhotoProps {
  name: string
  src?: string
  size?: 'md' | 'lg' | 'xl' | '2xl'
  className?: string
  ring?: boolean
}

const SIZE_CLASSES = {
  md: 'h-16 w-16 text-lg',
  lg: 'h-24 w-24 text-2xl',
  xl: 'h-32 w-32 text-3xl',
  '2xl': 'h-40 w-40 text-4xl',
}

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
}

export function ProfilePhoto({ name, src, size = 'lg', className, ring = true }: ProfilePhotoProps) {
  return (
    <div
      className={cn(
        'relative shrink-0 overflow-hidden rounded-2xl bg-muted shadow-lg',
        SIZE_CLASSES[size],
        ring && 'ring-4 ring-card',
        className,
      )}
    >
      {src ? (
        <img src={src} alt={name} className="h-full w-full object-cover" loading="lazy" />
      ) : (
        <div className={cn('flex h-full w-full items-center justify-center bg-brand-100 font-bold text-brand-700', SIZE_CLASSES[size])}>
          {getInitials(name)}
        </div>
      )}
    </div>
  )
}

interface PersonCardProps {
  name: string
  src?: string
  role: string
  subtitle?: string
  details?: { label: string; value: string }[]
}

export function PersonCard({ name, src, role, subtitle, details }: PersonCardProps) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center shadow-[var(--shadow-card)] sm:flex-row sm:items-start sm:text-left">
      <ProfilePhoto name={name} src={src} size="xl" className="sm:mr-6" />
      <div className="mt-4 flex-1 sm:mt-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">{role}</p>
        <h3 className="mt-1 text-xl font-bold">{name}</h3>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        {details && details.length > 0 && (
          <div className="mt-4 space-y-2 border-t border-border pt-4">
            {details.map((d) => (
              <div key={d.label} className="flex justify-between gap-4 text-sm sm:justify-start sm:gap-8">
                <span className="text-muted-foreground">{d.label}</span>
                <span className="font-medium">{d.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
