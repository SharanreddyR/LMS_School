import type {
  Student,
  Parent,
  Course,
  Assignment,
  ExamResult,
  FeePayment,
  Exam,
} from './types'
import { getStudentAvatar, getParentAvatar, getPersonAvatar } from '@/lib/avatars'

export interface StudentSubject {
  name: string
  teacher: string
  room: string
  schedule: string
}

export interface AttendanceDay {
  date: string
  status: 'present' | 'absent' | 'late'
  remark?: string
}

export interface GuardianInfo {
  id: string
  role: 'father' | 'mother' | 'guardian'
  name: string
  email?: string
  phone: string
  occupation?: string
  avatarUrl?: string
  isEmergencyContact?: boolean
}

export interface StudentProfileDetails extends Student {
  dateOfBirth: string
  gender: string
  bloodGroup: string
  nationality: string
  address: string
  city: string
  postalCode: string
  parentId?: string
  parentAvatarUrl?: string
  parentEmail: string
  parentPhone: string
  emergencyContact: string
  emergencyPhone: string
  academicYear: string
  admissionDate: string
  house: string
  transportRoute?: string
  medicalNotes?: string
  guardians: GuardianInfo[]
  subjects: StudentSubject[]
  attendanceHistory: { month: string; rate: number }[]
  recentAttendance: AttendanceDay[]
}

export interface StudentProfileResponse {
  profile: StudentProfileDetails
  courses: Course[]
  assignments: Assignment[]
  examResults: ExamResult[]
  feePayments: FeePayment[]
  upcomingExams: Exam[]
}

const PROFILE_EXTENSIONS: Record<string, Omit<StudentProfileDetails, keyof Student>> = {
  'STU-001': {
    dateOfBirth: '2009-03-15',
    gender: 'Male',
    bloodGroup: 'O+',
    nationality: 'American',
    address: '142 Oak Street',
    city: 'Springfield',
    postalCode: '62701',
    parentEmail: 'robert.j@email.com',
    parentPhone: '+1 555 010 3344',
    emergencyContact: 'Robert Johnson',
    emergencyPhone: '+1 555 010 3344',
    academicYear: '2025-26',
    admissionDate: '2022-08-15',
    house: 'Blue House',
    transportRoute: 'Route 12 - North Campus',
    medicalNotes: 'No known allergies',
    guardians: [
      {
        id: 'G-FATHER-001',
        role: 'father',
        name: 'Robert Johnson',
        email: 'robert.j@email.com',
        phone: '+1 555 010 3344',
        occupation: 'Software Engineer',
        avatarUrl: getPersonAvatar('Robert Johnson', 'father-STU-001'),
        isEmergencyContact: true,
      },
      {
        id: 'G-MOTHER-001',
        role: 'mother',
        name: 'Jennifer Johnson',
        email: 'jennifer.j@email.com',
        phone: '+1 555 010 3355',
        occupation: 'Healthcare Administrator',
        avatarUrl: getPersonAvatar('Jennifer Johnson', 'mother-STU-001'),
      },
      {
        id: 'G-GUARDIAN-001',
        role: 'guardian',
        name: 'Martha Johnson',
        email: 'martha.j@email.com',
        phone: '+1 555 010 3366',
        occupation: 'Retired Teacher',
        avatarUrl: getPersonAvatar('Martha Johnson', 'guardian-STU-001'),
      },
    ],
    subjects: [
      { name: 'Mathematics', teacher: 'Emily Rodriguez', room: 'Room 204', schedule: 'Mon, Wed, Fri 08:00' },
      { name: 'Physics', teacher: 'David Thompson', room: 'Lab 2', schedule: 'Tue, Thu 09:30' },
      { name: 'English Literature', teacher: 'Maria Garcia', room: 'Room 108', schedule: 'Mon, Wed 11:00' },
      { name: 'World History', teacher: 'James Wilson', room: 'Room 301', schedule: 'Tue, Thu 14:00' },
      { name: 'Physical Education', teacher: 'Robert Kim', room: 'Sports Ground', schedule: 'Fri 14:00' },
    ],
    attendanceHistory: [
      { month: 'Jan', rate: 94 },
      { month: 'Feb', rate: 96 },
      { month: 'Mar', rate: 95 },
      { month: 'Apr', rate: 97 },
      { month: 'May', rate: 96 },
      { month: 'Jun', rate: 96 },
    ],
    recentAttendance: [
      { date: new Date(Date.now() - 0 * 86400000).toISOString(), status: 'present' },
      { date: new Date(Date.now() - 1 * 86400000).toISOString(), status: 'present' },
      { date: new Date(Date.now() - 2 * 86400000).toISOString(), status: 'late', remark: 'Bus delay' },
      { date: new Date(Date.now() - 3 * 86400000).toISOString(), status: 'present' },
      { date: new Date(Date.now() - 4 * 86400000).toISOString(), status: 'present' },
      { date: new Date(Date.now() - 5 * 86400000).toISOString(), status: 'absent', remark: 'Medical leave' },
      { date: new Date(Date.now() - 6 * 86400000).toISOString(), status: 'present' },
    ],
  },
  'STU-002': {
    dateOfBirth: '2009-07-22',
    gender: 'Female',
    bloodGroup: 'A+',
    nationality: 'American',
    address: '88 Maple Avenue',
    city: 'Springfield',
    postalCode: '62702',
    parentEmail: 'lisa.w@email.com',
    parentPhone: '+1 555 010 4455',
    emergencyContact: 'Lisa Wilson',
    emergencyPhone: '+1 555 010 4455',
    academicYear: '2025-26',
    admissionDate: '2021-08-15',
    house: 'Red House',
    guardians: [],
    subjects: [
      { name: 'Mathematics', teacher: 'Emily Rodriguez', room: 'Room 204', schedule: 'Mon, Wed, Fri 08:00' },
      { name: 'Chemistry', teacher: 'David Thompson', room: 'Lab 1', schedule: 'Tue, Thu 10:30' },
    ],
    attendanceHistory: [
      { month: 'Jan', rate: 92 }, { month: 'Feb', rate: 94 }, { month: 'Mar', rate: 95 },
      { month: 'Apr', rate: 94 }, { month: 'May', rate: 96 }, { month: 'Jun', rate: 94 },
    ],
    recentAttendance: [
      { date: new Date(Date.now() - 0 * 86400000).toISOString(), status: 'present' },
      { date: new Date(Date.now() - 1 * 86400000).toISOString(), status: 'present' },
      { date: new Date(Date.now() - 2 * 86400000).toISOString(), status: 'present' },
    ],
  },
}

const DEFAULT_EXTENSION: Omit<StudentProfileDetails, keyof Student> = {
  dateOfBirth: '2010-01-01',
  gender: 'Not specified',
  bloodGroup: 'N/A',
  nationality: 'N/A',
  address: 'N/A',
  city: 'N/A',
  postalCode: 'N/A',
  parentEmail: 'N/A',
  parentPhone: 'N/A',
  emergencyContact: 'N/A',
  emergencyPhone: 'N/A',
  academicYear: '2025-26',
  admissionDate: new Date().toISOString(),
  house: 'N/A',
  guardians: [],
  subjects: [],
  attendanceHistory: [],
  recentAttendance: [],
}

export function buildStudentProfile(
  student: Student,
  courses: Course[],
  assignments: Assignment[],
  examResults: ExamResult[],
  feePayments: FeePayment[],
  exams: Exam[],
  parents: Parent[] = [],
): StudentProfileResponse {
  const parent = parents.find((p) => p.children.some((c) => c.id === student.id))

  const ext = PROFILE_EXTENSIONS[student.id] ?? {
    ...DEFAULT_EXTENSION,
    parentEmail: parent?.email ?? 'N/A',
    parentPhone: parent?.phone ?? 'N/A',
    emergencyContact: student.parentName,
    emergencyPhone: student.phone,
  }

  const gradeKey = student.grade
  const studentCourses = courses.filter((c) => c.grade === gradeKey && c.status === 'active')
  const studentExams = exams.filter((e) => e.grade === gradeKey)
  const studentResults = examResults.filter((r) => r.studentId === student.id)
  const studentFees = feePayments.filter((p) => p.studentId === student.id)
  const gradeAssignments = assignments.filter((a) =>
    studentCourses.some((c) => c.title === a.course),
  )

  const guardians =
    (ext.guardians?.length ?? 0) > 0
      ? ext.guardians!
      : parent
        ? [
            {
              id: `G-${parent.id}`,
              role: 'father' as const,
              name: parent.name,
              email: parent.email,
              phone: parent.phone,
              avatarUrl: parent.avatarUrl ?? getParentAvatar(parent.id),
              isEmergencyContact: true,
            },
          ]
        : []

  return {
    profile: {
      ...student,
      ...ext,
      avatarUrl: student.avatarUrl ?? getStudentAvatar(student.id),
      parentId: parent?.id,
      parentAvatarUrl: guardians.find((g) => g.role === 'father')?.avatarUrl,
      parentEmail: guardians.find((g) => g.role === 'father')?.email ?? ext.parentEmail,
      parentPhone: guardians.find((g) => g.role === 'father')?.phone ?? ext.parentPhone,
      guardians,
    },
    courses: studentCourses,
    assignments: gradeAssignments,
    examResults: studentResults,
    feePayments: studentFees,
    upcomingExams: studentExams.filter((e) => e.status === 'scheduled'),
  }
}
