import { Mail, Phone, Briefcase, Shield } from 'lucide-react'
import { ProfilePhoto } from '@/components/shared/ProfilePhoto'
import { Badge } from '@/components/ui/badge'
import type { GuardianInfo } from '@/lib/mock-api/student-profile'

const ROLE_LABELS: Record<GuardianInfo['role'], string> = {
  father: 'Father',
  mother: 'Mother',
  guardian: 'Guardian',
}

const ROLE_COLORS: Record<GuardianInfo['role'], string> = {
  father: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  mother: 'bg-pink-50 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  guardian: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
}

export function GuardianCard({ guardian }: { guardian: GuardianInfo }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-border bg-card p-5 text-center shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-elevated)]">
      <ProfilePhoto name={guardian.name} src={guardian.avatarUrl} size="lg" className="mx-auto" />
      <span className={`mt-4 inline-flex rounded-full px-3 py-0.5 text-xs font-semibold uppercase tracking-wide ${ROLE_COLORS[guardian.role]}`}>
        {ROLE_LABELS[guardian.role]}
      </span>
      <h3 className="mt-2 text-lg font-bold">{guardian.name}</h3>
      {guardian.occupation && (
        <p className="mt-0.5 flex items-center justify-center gap-1 text-sm text-muted-foreground">
          <Briefcase className="h-3.5 w-3.5" />
          {guardian.occupation}
        </p>
      )}
      <div className="mt-4 w-full space-y-2 border-t border-border pt-4 text-left text-sm">
        {guardian.email && (
          <p className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{guardian.email}</span>
          </p>
        )}
        <p className="flex items-center gap-2 text-muted-foreground">
          <Phone className="h-3.5 w-3.5 shrink-0" />
          {guardian.phone}
        </p>
      </div>
      {guardian.isEmergencyContact && (
        <Badge variant="warning" className="mt-3 gap-1">
          <Shield className="h-3 w-3" />
          Emergency Contact
        </Badge>
      )}
    </div>
  )
}
