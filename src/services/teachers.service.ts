import { apiGet, createServiceMethod } from '@/lib/api'
import { fetchTeachers } from '@/lib/mock-api'
import type { Teacher } from '@/lib/mock-api/types'

export const teachersService = {
  getAll: createServiceMethod({
    mock: fetchTeachers,
    api: () => apiGet<Teacher[]>('/teachers'),
  }),
}
