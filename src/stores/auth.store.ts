import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, UserRole } from '@/types/auth'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (user: User) => void
  logout: () => void
  switchRole: (role: UserRole) => void
}

const DEMO_USERS: Record<UserRole, User> = {
  super_admin: {
    id: '1',
    email: 'admin@edunexus.io',
    name: 'Alex Morgan',
    role: 'super_admin',
    avatarUrl: undefined,
  },
  school_admin: {
    id: '2',
    email: 'principal@greenwood.edu',
    name: 'Dr. Sarah Chen',
    role: 'school_admin',
    schoolId: 'sch-001',
    schoolName: 'Greenwood International',
  },
  admission_team: {
    id: '3',
    email: 'admissions@greenwood.edu',
    name: 'James Wilson',
    role: 'admission_team',
    schoolId: 'sch-001',
    schoolName: 'Greenwood International',
  },
  teacher: {
    id: '4',
    email: 'teacher@greenwood.edu',
    name: 'Emily Rodriguez',
    role: 'teacher',
    schoolId: 'sch-001',
    schoolName: 'Greenwood International',
  },
  student: {
    id: '5',
    email: 'student@greenwood.edu',
    name: 'Michael Johnson',
    role: 'student',
    schoolId: 'sch-001',
    schoolName: 'Greenwood International',
    studentId: 'STU-001',
  },
  parent: {
    id: '6',
    email: 'parent@email.com',
    name: 'Robert Johnson',
    role: 'parent',
    schoolId: 'sch-001',
    schoolName: 'Greenwood International',
    parentId: 'PAR-001',
  },
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      switchRole: (role) => set({ user: DEMO_USERS[role], isAuthenticated: true }),
    }),
    { name: 'edunexus-auth' },
  ),
)

export { DEMO_USERS }
