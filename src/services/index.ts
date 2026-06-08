/**
 * Service layer — the boundary between UI/hooks and data sources.
 * Each service method auto-routes to mock or real API via createServiceMethod.
 */
export { authenticate, type LoginCredentials, type LoginResponse } from './auth.service'
export { studentsService } from './students.service'
export { teachersService } from './teachers.service'
export { parentsService } from './parents.service'
export { dashboardService } from './dashboard.service'
