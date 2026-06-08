import { delay } from './delay'
import { getStudentAvatar } from '@/lib/avatars'
import {
  MOCK_STUDENTS,
  MOCK_TEACHERS,
  MOCK_PARENTS,
  MOCK_COURSES,
  MOCK_ASSIGNMENTS,
  MOCK_ATTENDANCE,
  MOCK_EXAMS,
  MOCK_EXAM_RESULTS,
  MOCK_FEE_STRUCTURES,
  MOCK_FEE_PAYMENTS,
  MOCK_REPORTS,
  MOCK_NOTIFICATIONS,
  MOCK_DASHBOARD_STATS,
} from './data'
import { MOCK_LEADS } from '@/features/admissions/data/mock-data'
import type { SearchResult } from './types'

export * from './types'
export * from './data'

export async function fetchDashboardStats() {
  await delay()
  return MOCK_DASHBOARD_STATS
}

export async function fetchStudents() {
  await delay()
  return [...MOCK_STUDENTS]
}

export async function fetchStudent(id: string) {
  await delay(200)
  const s = MOCK_STUDENTS.find((x) => x.id === id)
  if (!s) throw new Error('Student not found')
  return s
}

export async function fetchStudentProfile(studentId: string) {
  await delay(400)
  const student = MOCK_STUDENTS.find((x) => x.id === studentId)
  if (!student) throw new Error('Student not found')

  const { buildStudentProfile } = await import('./student-profile')
  return buildStudentProfile(
    student,
    MOCK_COURSES,
    MOCK_ASSIGNMENTS,
    MOCK_EXAM_RESULTS,
    MOCK_FEE_PAYMENTS,
    MOCK_EXAMS,
    MOCK_PARENTS,
  )
}

export async function fetchParentProfile(parentId: string) {
  await delay(400)
  const parent = MOCK_PARENTS.find((p) => p.id === parentId)
  if (!parent) throw new Error('Parent not found')

  const childrenDetails = parent.children.map((child) => {
    const student = MOCK_STUDENTS.find((s) => s.id === child.id)
    return {
      ...child,
      avatarUrl: child.avatarUrl ?? student?.avatarUrl ?? getStudentAvatar(child.id),
      attendance: student?.attendance ?? 0,
      gpa: student?.gpa ?? 0,
      rollNo: student?.rollNo ?? '—',
      section: student?.section ?? '—',
    }
  })

  return { parent, children: childrenDetails }
}

export async function fetchTeachers() {
  await delay()
  return [...MOCK_TEACHERS]
}

export async function fetchParents() {
  await delay()
  return [...MOCK_PARENTS]
}

export async function fetchCourses() {
  await delay()
  return [...MOCK_COURSES]
}

export async function fetchAssignments() {
  await delay()
  return [...MOCK_ASSIGNMENTS]
}

export async function fetchAttendance() {
  await delay()
  return [...MOCK_ATTENDANCE]
}

export async function fetchExams() {
  await delay()
  return [...MOCK_EXAMS]
}

export async function fetchExamResults() {
  await delay()
  return [...MOCK_EXAM_RESULTS]
}

export async function fetchFeeStructures() {
  await delay()
  return [...MOCK_FEE_STRUCTURES]
}

export async function fetchFeePayments() {
  await delay()
  return [...MOCK_FEE_PAYMENTS]
}

export async function fetchReports() {
  await delay()
  return [...MOCK_REPORTS]
}

export async function fetchNotifications() {
  await delay(300)
  return [...MOCK_NOTIFICATIONS]
}

export async function globalSearch(query: string): Promise<SearchResult[]> {
  await delay(200)
  const q = query.toLowerCase().trim()
  if (!q) return []

  const results: SearchResult[] = []

  MOCK_STUDENTS.filter((s) => s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q)).forEach((s) =>
    results.push({ id: s.id, type: 'student', title: s.name, subtitle: `${s.grade} · ${s.section}`, href: '/students' }),
  )
  MOCK_TEACHERS.filter((t) => t.name.toLowerCase().includes(q) || t.department.toLowerCase().includes(q)).forEach((t) =>
    results.push({ id: t.id, type: 'teacher', title: t.name, subtitle: t.department, href: '/teachers' }),
  )
  MOCK_PARENTS.filter((p) => p.name.toLowerCase().includes(q)).forEach((p) =>
    results.push({ id: p.id, type: 'parent', title: p.name, subtitle: `${p.children.length} child(ren)`, href: '/parents' }),
  )
  MOCK_COURSES.filter((c) => c.title.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)).forEach((c) =>
    results.push({ id: c.id, type: 'course', title: c.title, subtitle: c.code, href: '/lms/courses' }),
  )
  MOCK_EXAMS.filter((e) => e.name.toLowerCase().includes(q)).forEach((e) =>
    results.push({ id: e.id, type: 'exam', title: e.name, subtitle: e.grade, href: '/examinations/schedule' }),
  )
  MOCK_LEADS.filter((l) => l.studentName.toLowerCase().includes(q)).forEach((l) =>
    results.push({ id: l.id, type: 'lead', title: l.studentName, subtitle: 'Admission lead', href: '/admissions/enquiries' }),
  )

  return results.slice(0, 12)
}
