import { queryKeys } from '@/lib/api'
import { useApiQuery } from '@/hooks/useApiQuery'
import { studentsService } from '@/services'
import { useAuthStore } from '@/stores/auth.store'

export function useStudentProfile(overrideStudentId?: string) {
  const user = useAuthStore((s) => s.user)
  const studentId = overrideStudentId ?? user?.studentId

  return useApiQuery(
    queryKeys.students.profile(studentId ?? ''),
    () => studentsService.getProfile(studentId!),
    { enabled: !!studentId },
  )
}
