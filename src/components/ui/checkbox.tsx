import { forwardRef, type InputHTMLAttributes } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  description?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, id, disabled, checked, onChange, ...props }, ref) => {
    const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

    return (
      <label
        htmlFor={inputId}
        className={cn(
          'flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 transition-colors',
          checked ? 'border-brand-300 bg-brand-50/50' : 'hover:bg-muted/40',
          disabled && 'cursor-not-allowed opacity-60',
          className,
        )}
      >
        <span className="relative mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center">
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            disabled={disabled}
            checked={checked}
            onChange={onChange}
            className="sr-only"
            {...props}
          />
          <span
            className={cn(
              'flex h-4 w-4 items-center justify-center rounded border border-input bg-card transition-colors',
              checked && 'border-brand-600 bg-brand-600',
            )}
          >
            {checked && <Check className="h-3 w-3 text-white" />}
          </span>
        </span>
        {(label || description) && (
          <span className="min-w-0 flex-1">
            {label && <span className="block text-sm font-medium">{label}</span>}
            {description && (
              <span className="mt-0.5 block text-xs text-muted-foreground">{description}</span>
            )}
          </span>
        )}
      </label>
    )
  },
)
Checkbox.displayName = 'Checkbox'
