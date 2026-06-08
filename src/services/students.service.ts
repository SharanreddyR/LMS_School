import { apiGet, createServiceMethod } from '@/lib/api'
import { fetchStudents, fetchStudent, fetchStudentProfile } from '@/lib/mock-api'
import type { Student } from '@/lib/mock-api/types'
import type { StudentProfileResponse } from '@/lib/mock-api/student-profile'

export const studentsService = {
  getAll: createServiceMethod({
    mock: fetchStudents,
    api: () => apiGet<Student[]>('/students'),
  }),

  getById: createServiceMethod({
    mock: fetchStudent,
    api: (id: string) => apiGet<Student>(`/students/${id}`),
  }),

  getProfile: createServiceMethod({
    mock: fetchStudentProfile,
    api: (studentId: string) => apiGet<StudentProfileResponse>(`/students/${studentId}/profile`),
  }),
}
