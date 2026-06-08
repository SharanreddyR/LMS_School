import { cn } from '@/lib/utils'

interface AvatarProps {
  name: string
  src?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = { sm: 'h-8 w-8 text-xs', md: 'h-10 w-10 text-sm', lg: 'h-12 w-12 text-base' }

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn('rounded-full object-cover ring-2 ring-white', sizeMap[size], className)}
      />
    )
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-brand-100 font-semibold text-brand-700 ring-2 ring-white',
        sizeMap[size],
        className,
      )}
      aria-label={name}
    >
      {getInitials(name)}
    </div>
  )
}
