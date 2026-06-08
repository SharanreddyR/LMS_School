export type UserRole =
  | 'super_admin'
  | 'school_admin'
  | 'admission_team'
  | 'teacher'
  | 'student'
  | 'parent'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatarUrl?: string
  schoolId?: string
  schoolName?: string
  /** Links auth user to student record (STU-xxx) */
  studentId?: string
  /** Links auth user to parent record (PAR-xxx) */
  parentId?: string
}

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  school_admin: 'School Admin',
  admission_team: 'Admission Team',
  teacher: 'Teacher',
  student: 'Student',
  parent: 'Parent',
}
