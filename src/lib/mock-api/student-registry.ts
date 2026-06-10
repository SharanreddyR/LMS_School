import type { Student } from './types'
import { MOCK_STUDENTS } from './data'
import { getStudentAvatar } from '@/lib/avatars'

const enrolledStudents: Student[] = []

export function getAllStudents(): Student[] {
  return [...MOCK_STUDENTS, ...enrolledStudents]
}

export function addStudentFromAdmission(input: {
  id: string
  name: string
  email: string
  grade: string
  parentName: string
  phone: string
}): Student {
  const section = 'A'
  const rollNo = `${input.grade.replace('Grade ', '')}${section}-${String(enrolledStudents.length + 1).padStart(2, '0')}`

  const student: Student = {
    id: input.id,
    name: input.name,
    email: input.email,
    grade: input.grade,
    section,
    rollNo,
    parentName: input.parentName,
    phone: input.phone,
    status: 'active',
    attendance: 100,
    gpa: 0,
    enrolledAt: new Date().toISOString(),
    avatarUrl: getStudentAvatar(input.id),
  }

  enrolledStudents.push(student)
  return student
}
