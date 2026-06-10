export const queryKeys = {
  dashboard: { stats: ['dashboard', 'stats'] as const },
  students: {
    all: ['students'] as const,
    detail: (id: string) => ['students', id] as const,
    profile: (id: string) => ['students', 'profile', id] as const,
  },
  teachers: { all: ['teachers'] as const },
  parents: {
    all: ['parents'] as const,
    profile: (id: string) => ['parents', 'profile', id] as const,
  },
  lms: {
    courses: ['lms', 'courses'] as const,
    assignments: ['lms', 'assignments'] as const,
  },
  attendance: { all: ['attendance'] as const },
  exams: {
    schedule: ['exams', 'schedule'] as const,
    results: ['exams', 'results'] as const,
  },
  fees: {
    structure: ['fees', 'structure'] as const,
    payments: ['fees', 'payments'] as const,
  },
  reports: { all: ['reports'] as const },
  announcements: { all: ['announcements'] as const },
  timetable: { all: ['timetable'] as const },
  transport: { all: ['transport'] as const },
  library: { all: ['library'] as const },
  homework: { all: ['homework'] as const },
  notifications: { all: ['notifications'] as const },
  search: (q: string) => ['search', q] as const,
  admissions: {
    all: ['admissions'] as const,
    list: (filters?: Record<string, unknown>) => ['admissions', 'list', filters] as const,
    detail: (id: string) => ['admissions', 'detail', id] as const,
  },
} as const
