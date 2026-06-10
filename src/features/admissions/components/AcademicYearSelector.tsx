import { CalendarDays } from 'lucide-react'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useAdmissionSetup } from '../hooks/useAdmissionSetup'

export function AcademicYearSelector() {
  const { academicYears, currentYear, setSelectedYearId } = useAdmissionSetup()

  if (!academicYears.length) return null

  return (
    <div className="flex items-center gap-2">
      <CalendarDays className="hidden h-4 w-4 text-muted-foreground sm:block" />
      <Select
        value={currentYear?.id ?? ''}
        onChange={(e) => setSelectedYearId(e.target.value)}
        className="h-9 w-[140px] text-xs sm:w-[160px]"
        aria-label="Select academic year"
      >
        {academicYears.map((year) => (
          <option key={year.id} value={year.id}>
            {year.label}
            {year.isCurrent ? ' (Current)' : ''}
          </option>
        ))}
      </Select>
      {currentYear && (
        <Badge variant={currentYear.status === 'active' ? 'success' : 'secondary'}>
          {currentYear.status === 'active' ? 'Active' : 'Inactive'}
        </Badge>
      )}
    </div>
  )
}
