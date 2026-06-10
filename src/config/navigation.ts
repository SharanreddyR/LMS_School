import {
  LayoutDashboard,
  User,
  UserPlus,
  GraduationCap,
  Users,
  HeartHandshake,
  BookOpen,
  CalendarCheck,
  FileText,
  Wallet,
  BarChart3,
  GitBranch,
  CalendarClock,
  FileInput,
  Globe,
  UserCheck,
  Settings2,
  ClipboardList,
} from 'lucide-react'
import type { NavItem } from '@/types/navigation'

export const NAVIGATION: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['super_admin', 'school_admin', 'admission_team', 'teacher', 'student', 'parent'],
  },
  {
    id: 'my-profile',
    label: 'My Profile',
    href: '/profile',
    icon: User,
    roles: ['student', 'parent'],
  },
  {
    id: 'admissions',
    label: 'Admissions',
    href: '/admissions',
    icon: UserPlus,
    badge: '12',
    roles: ['super_admin', 'school_admin', 'admission_team'],
    children: [
      { id: 'adm-overview', label: 'Overview', href: '/admissions', icon: LayoutDashboard, roles: ['super_admin', 'school_admin', 'admission_team'] },
      { id: 'adm-setup', label: 'Setup', href: '/admissions/setup', icon: Settings2, roles: ['super_admin', 'school_admin'] },
      { id: 'adm-enquiries', label: 'Enquiries', href: '/admissions/enquiries', icon: UserPlus, roles: ['super_admin', 'school_admin', 'admission_team'] },
      { id: 'adm-pipeline', label: 'Pipeline', href: '/admissions/pipeline', icon: GitBranch, roles: ['super_admin', 'school_admin', 'admission_team'] },
      { id: 'adm-followups', label: 'Follow-ups', href: '/admissions/follow-ups', icon: CalendarClock, roles: ['super_admin', 'school_admin', 'admission_team'] },
      { id: 'adm-internal', label: 'Internal Apps', href: '/admissions/applications/internal', icon: FileInput, roles: ['super_admin', 'school_admin', 'admission_team'] },
      { id: 'adm-external', label: 'External Apps', href: '/admissions/applications/external', icon: Globe, roles: ['super_admin', 'school_admin', 'admission_team'] },
      { id: 'adm-conversion', label: 'Conversion', href: '/admissions/conversion', icon: UserCheck, roles: ['super_admin', 'school_admin', 'admission_team'] },
    ],
  },
  {
    id: 'students',
    label: 'Students',
    href: '/students',
    icon: GraduationCap,
    roles: ['super_admin', 'school_admin', 'admission_team', 'teacher'],
  },
  {
    id: 'teachers',
    label: 'Teachers',
    href: '/teachers',
    icon: Users,
    roles: ['super_admin', 'school_admin'],
  },
  {
    id: 'parents',
    label: 'Parents',
    href: '/parents',
    icon: HeartHandshake,
    roles: ['super_admin', 'school_admin', 'parent'],
  },
  {
    id: 'lms',
    label: 'LMS',
    href: '/lms',
    icon: BookOpen,
    roles: ['super_admin', 'school_admin', 'teacher', 'student', 'parent'],
    children: [
      { id: 'lms-courses', label: 'Courses', href: '/lms/courses', icon: BookOpen, roles: ['super_admin', 'school_admin', 'teacher', 'student', 'parent'] },
      { id: 'lms-assignments', label: 'Assignments', href: '/lms/assignments', icon: ClipboardList, roles: ['super_admin', 'school_admin', 'teacher', 'student', 'parent'] },
    ],
  },
  {
    id: 'attendance',
    label: 'Attendance',
    href: '/attendance',
    icon: CalendarCheck,
    roles: ['super_admin', 'school_admin', 'teacher', 'student', 'parent'],
  },
  {
    id: 'examinations',
    label: 'Exams',
    href: '/examinations',
    icon: FileText,
    roles: ['super_admin', 'school_admin', 'teacher', 'student', 'parent'],
  },
  {
    id: 'fees',
    label: 'Fees',
    href: '/fees',
    icon: Wallet,
    roles: ['super_admin', 'school_admin', 'parent'],
  },
  {
    id: 'reports',
    label: 'Reports',
    href: '/reports',
    icon: BarChart3,
    roles: ['super_admin', 'school_admin', 'teacher'],
  },
]

function filterNavItem(item: NavItem, role: string): NavItem | null {
  const roleKey = role as NavItem['roles'][number]
  if (!item.roles.includes(roleKey)) return null

  if (item.children) {
    const children = item.children
      .filter((child) => child.roles.includes(roleKey))
      .map((child) => ({ ...child }))
    return { ...item, children: children.length > 0 ? children : undefined }
  }

  return { ...item }
}

/** Returns navigation items (and children) visible to the given role */
export function getNavigationForRole(role: string): NavItem[] {
  return NAVIGATION
    .map((item) => filterNavItem(item, role))
    .filter((item): item is NavItem => item !== null)
}
