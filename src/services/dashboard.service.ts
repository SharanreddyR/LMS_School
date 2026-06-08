import { apiGet, createServiceMethod } from '@/lib/api'
import { fetchDashboardStats } from '@/lib/mock-api'
import type { DashboardStats } from '@/lib/mock-api/types'

export const dashboardService = {
  getStats: createServiceMethod({
    mock: fetchDashboardStats,
    api: () => apiGet<DashboardStats>('/dashboard/stats'),
  }),
}
