import { apiGet, createServiceMethod } from '@/lib/api'
import { fetchParents, fetchParentProfile } from '@/lib/mock-api'

export const parentsService = {
  getAll: createServiceMethod({
    mock: fetchParents,
    api: () => apiGet<Awaited<ReturnType<typeof fetchParents>>>('/parents'),
  }),

  getProfile: createServiceMethod({
    mock: fetchParentProfile,
    api: (parentId: string) => apiGet<Awaited<ReturnType<typeof fetchParentProfile>>>(`/parents/${parentId}/profile`),
  }),
}
