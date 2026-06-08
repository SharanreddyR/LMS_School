import { getStudentAvatar, getParentAvatar } from '@/lib/avatars'
import type {
  Student,
  Teacher,
  Parent,
  Course,
  Assignment,
  AttendanceRecord,
  Exam,
  ExamResult,
  FeeStructure,
  FeePayment,
  Report,
  Notification,
  DashboardStats,
} from './types'

const d = (days: number) => new Date(Date.now() - days * 86400000).toISOString()
const f = (days: number) => new Date(Date.now() + days * 86400000).toISOString()

const RAW_STUDENTS: Student[] = [
  { id: 'STU-001', name: 'Michael Johnson', email: 'm.johnson@school.edu', grade: 'Grade 10', section: 'A', rollNo: '10A-01', parentName: 'Robert Johnson', phone: '+1 555 010 3344', status: 'active', attendance: 96, gpa: 3.8, enrolledAt: d(365) },
  { id: 'STU-002', name: 'Emma Wilson', email: 'e.wilson@school.edu', grade: 'Grade 10', section: 'A', rollNo: '10A-02', parentName: 'Lisa Wilson', phone: '+1 555 010 4455', status: 'active', attendance: 94, gpa: 3.9, enrolledAt: d(300) },
  { id: 'STU-003', name: 'Aarav Sharma', email: 'a.sharma@school.edu', grade: 'Grade 9', section: 'B', rollNo: '9B-15', parentName: 'Rajesh Sharma', phone: '+91 98765 43210', status: 'active', attendance: 91, gpa: 3.6, enrolledAt: d(200) },
  { id: 'STU-004', name: 'Sofia Martinez', email: 's.martinez@school.edu', grade: 'Grade 8', section: 'A', rollNo: '8A-08', parentName: 'Carlos Martinez', phone: '+1 555 010 8899', status: 'active', attendance: 98, gpa: 4.0, enrolledAt: d(400) },
  { id: 'STU-005', name: 'Noah Chen', email: 'n.chen@school.edu', grade: 'Grade 11', section: 'A', rollNo: '11A-03', parentName: 'Lisa Chen', phone: '+1 555 010 5566', status: 'active', attendance: 89, gpa: 3.5, enrolledAt: d(500) },
  { id: 'STU-006', name: 'Priya Nair', email: 'p.nair@school.edu', grade: 'Grade 7', section: 'B', rollNo: '7B-12', parentName: 'Lakshmi Nair', phone: '+91 91234 56789', status: 'active', attendance: 97, gpa: 3.7, enrolledAt: d(250) },
  { id: 'STU-007', name: 'Ethan Williams', email: 'e.williams@school.edu', grade: 'Grade 12', section: 'A', rollNo: '12A-01', parentName: 'Sarah Williams', phone: '+1 555 010 2234', status: 'active', attendance: 92, gpa: 3.4, enrolledAt: d(600) },
  { id: 'STU-008', name: 'Ananya Reddy', email: 'a.reddy@school.edu', grade: 'Grade 6', section: 'A', rollNo: '6A-20', parentName: 'Vikram Reddy', phone: '+91 98765 11122', status: 'active', attendance: 95, gpa: 3.9, enrolledAt: d(180) },
  { id: 'STU-009', name: 'Liam O\'Brien', email: 'l.obrien@school.edu', grade: 'Grade 5', section: 'B', rollNo: '5B-07', parentName: 'Kate O\'Brien', phone: '+1 555 010 4455', status: 'active', attendance: 93, gpa: 3.6, enrolledAt: d(150) },
  { id: 'STU-010', name: 'Zara Khan', email: 'z.khan@school.edu', grade: 'Grade 10', section: 'B', rollNo: '10B-11', parentName: 'Ahmed Khan', phone: '+91 98700 11223', status: 'inactive', attendance: 78, gpa: 2.9, enrolledAt: d(400) },
]

export const MOCK_STUDENTS: Student[] = RAW_STUDENTS.map((s) => ({
  ...s,
  avatarUrl: getStudentAvatar(s.id),
}))

export const MOCK_TEACHERS: Teacher[] = [
  { id: 'TCH-001', name: 'Emily Rodriguez', email: 'e.rodriguez@school.edu', phone: '+1 555 020 1001', department: 'Mathematics', subjects: ['Algebra', 'Calculus'], classes: ['Grade 10-A', 'Grade 11-A'], status: 'active', experience: 8 },
  { id: 'TCH-002', name: 'David Thompson', email: 'd.thompson@school.edu', phone: '+1 555 020 1002', department: 'Science', subjects: ['Physics', 'Chemistry'], classes: ['Grade 9-B', 'Grade 10-A'], status: 'active', experience: 12 },
  { id: 'TCH-003', name: 'Maria Garcia', email: 'm.garcia@school.edu', phone: '+1 555 020 1003', department: 'English', subjects: ['Literature', 'Writing'], classes: ['Grade 8-A', 'Grade 12-A'], status: 'active', experience: 6 },
  { id: 'TCH-004', name: 'James Wilson', email: 'j.wilson@school.edu', phone: '+1 555 020 1004', department: 'Social Studies', subjects: ['History', 'Geography'], classes: ['Grade 7-B', 'Grade 9-B'], status: 'active', experience: 10 },
  { id: 'TCH-005', name: 'Lisa Chen', email: 'l.chen@school.edu', phone: '+1 555 020 1005', department: 'Computer Science', subjects: ['Programming', 'Web Dev'], classes: ['Grade 11-A', 'Grade 12-A'], status: 'active', experience: 5 },
  { id: 'TCH-006', name: 'Robert Kim', email: 'r.kim@school.edu', phone: '+1 555 020 1006', department: 'Physical Education', subjects: ['PE', 'Sports'], classes: ['Grade 5-B', 'Grade 6-A'], status: 'on_leave', experience: 15 },
]

const RAW_PARENTS: Omit<Parent, 'avatarUrl'>[] = [
  { id: 'PAR-001', name: 'Robert Johnson', email: 'robert.j@email.com', phone: '+1 555 010 3344', children: [{ id: 'STU-001', name: 'Michael Johnson', grade: 'Grade 10' }], status: 'active' },
  { id: 'PAR-002', name: 'Lisa Wilson', email: 'lisa.w@email.com', phone: '+1 555 010 4455', children: [{ id: 'STU-002', name: 'Emma Wilson', grade: 'Grade 10' }], status: 'active' },
  { id: 'PAR-003', name: 'Rajesh Sharma', email: 'rajesh.sharma@email.com', phone: '+91 98765 43210', children: [{ id: 'STU-003', name: 'Aarav Sharma', grade: 'Grade 9' }], status: 'active' },
  { id: 'PAR-004', name: 'Carlos Martinez', email: 'carlos.m@email.com', phone: '+1 555 010 8899', children: [{ id: 'STU-004', name: 'Sofia Martinez', grade: 'Grade 8' }], status: 'active' },
  { id: 'PAR-005', name: 'Lisa Chen', email: 'lisa.chen@email.com', phone: '+1 555 010 5566', children: [{ id: 'STU-005', name: 'Noah Chen', grade: 'Grade 11' }], status: 'active' },
  { id: 'PAR-006', name: 'Lakshmi Nair', email: 'lakshmi.nair@email.com', phone: '+91 91234 56789', children: [{ id: 'STU-006', name: 'Priya Nair', grade: 'Grade 7' }], status: 'active' },
]

export const MOCK_PARENTS: Parent[] = RAW_PARENTS.map((p) => ({
  ...p,
  avatarUrl: getParentAvatar(p.id),
  children: p.children.map((c) => ({
    ...c,
    avatarUrl: getStudentAvatar(c.id),
  })),
}))

export const MOCK_COURSES: Course[] = [
  { id: 'CRS-001', title: 'Advanced Mathematics', code: 'MATH-301', teacher: 'Emily Rodriguez', grade: 'Grade 10', students: 32, progress: 68, status: 'active' },
  { id: 'CRS-002', title: 'Physics Fundamentals', code: 'SCI-201', teacher: 'David Thompson', grade: 'Grade 9', students: 28, progress: 55, status: 'active' },
  { id: 'CRS-003', title: 'English Literature', code: 'ENG-101', teacher: 'Maria Garcia', grade: 'Grade 8', students: 30, progress: 72, status: 'active' },
  { id: 'CRS-004', title: 'World History', code: 'HIS-201', teacher: 'James Wilson', grade: 'Grade 9', students: 25, progress: 45, status: 'active' },
  { id: 'CRS-005', title: 'Introduction to Programming', code: 'CS-101', teacher: 'Lisa Chen', grade: 'Grade 11', students: 22, progress: 80, status: 'active' },
  { id: 'CRS-006', title: 'Creative Writing', code: 'ENG-301', teacher: 'Maria Garcia', grade: 'Grade 12', students: 18, progress: 30, status: 'draft' },
]

export const MOCK_ASSIGNMENTS: Assignment[] = [
  { id: 'ASG-001', title: 'Quadratic Equations Worksheet', course: 'Advanced Mathematics', dueDate: f(3), submissions: 28, total: 32, status: 'open' },
  { id: 'ASG-002', title: 'Lab Report: Motion', course: 'Physics Fundamentals', dueDate: f(5), submissions: 20, total: 28, status: 'open' },
  { id: 'ASG-003', title: 'Essay: Shakespeare', course: 'English Literature', dueDate: f(-2), submissions: 30, total: 30, status: 'grading' },
  { id: 'ASG-004', title: 'History Timeline Project', course: 'World History', dueDate: f(7), submissions: 15, total: 25, status: 'open' },
  { id: 'ASG-005', title: 'Python Basics Quiz', course: 'Introduction to Programming', dueDate: f(1), submissions: 22, total: 22, status: 'closed' },
]

export const MOCK_ATTENDANCE: AttendanceRecord[] = [
  { id: 'ATT-001', date: d(0), grade: 'Grade 10', section: 'A', present: 30, absent: 2, late: 1, total: 33, markedBy: 'Emily Rodriguez' },
  { id: 'ATT-002', date: d(0), grade: 'Grade 9', section: 'B', present: 26, absent: 3, late: 0, total: 29, markedBy: 'David Thompson' },
  { id: 'ATT-003', date: d(1), grade: 'Grade 10', section: 'A', present: 31, absent: 1, late: 2, total: 34, markedBy: 'Emily Rodriguez' },
  { id: 'ATT-004', date: d(1), grade: 'Grade 8', section: 'A', present: 28, absent: 2, late: 1, total: 31, markedBy: 'Maria Garcia' },
  { id: 'ATT-005', date: d(2), grade: 'Grade 11', section: 'A', present: 20, absent: 2, late: 0, total: 22, markedBy: 'Lisa Chen' },
]

export const MOCK_EXAMS: Exam[] = [
  { id: 'EXM-001', name: 'Mid-Term Mathematics', subject: 'Mathematics', grade: 'Grade 10', date: f(7), startTime: '09:00', duration: '2h', room: 'Hall A', status: 'scheduled' },
  { id: 'EXM-002', name: 'Physics Unit Test', subject: 'Physics', grade: 'Grade 9', date: f(3), startTime: '10:30', duration: '1h 30m', room: 'Lab 2', status: 'scheduled' },
  { id: 'EXM-003', name: 'English Literature Exam', subject: 'English', grade: 'Grade 8', date: f(14), startTime: '09:00', duration: '2h', room: 'Room 204', status: 'scheduled' },
  { id: 'EXM-004', name: 'Final Programming Exam', subject: 'Computer Science', grade: 'Grade 11', date: d(5), startTime: '14:00', duration: '3h', room: 'Lab 1', status: 'completed' },
]

export const MOCK_EXAM_RESULTS: ExamResult[] = [
  { id: 'RES-001', studentId: 'STU-001', studentName: 'Michael Johnson', examName: 'Mathematics Quiz', subject: 'Mathematics', score: 88, maxScore: 100, grade: 'A', rank: 3 },
  { id: 'RES-002', studentId: 'STU-002', studentName: 'Emma Wilson', examName: 'Mathematics Quiz', subject: 'Mathematics', score: 95, maxScore: 100, grade: 'A+', rank: 1 },
  { id: 'RES-003', studentId: 'STU-005', studentName: 'Noah Chen', examName: 'Final Programming Exam', subject: 'Computer Science', score: 78, maxScore: 100, grade: 'B+', rank: 5 },
  { id: 'RES-004', studentId: 'STU-004', studentName: 'Sofia Martinez', examName: 'English Mid-Term', subject: 'English', score: 92, maxScore: 100, grade: 'A', rank: 2 },
]

export const MOCK_FEE_STRUCTURES: FeeStructure[] = [
  { id: 'FEE-S01', name: 'Tuition Fee', grade: 'All Grades', amount: 12000, frequency: 'annual', dueDate: f(30) },
  { id: 'FEE-S02', name: 'Transport Fee', grade: 'All Grades', amount: 2400, frequency: 'annual', dueDate: f(30) },
  { id: 'FEE-S03', name: 'Lab Fee', grade: 'Grade 9-12', amount: 800, frequency: 'term', dueDate: f(15) },
  { id: 'FEE-S04', name: 'Activity Fee', grade: 'Grade 1-8', amount: 500, frequency: 'term', dueDate: f(15) },
]

export const MOCK_FEE_PAYMENTS: FeePayment[] = [
  { id: 'PAY-001', studentId: 'STU-001', studentName: 'Michael Johnson', grade: 'Grade 10', amount: 12000, dueAmount: 0, status: 'paid', dueDate: f(-10), paidDate: d(5) },
  { id: 'PAY-002', studentId: 'STU-002', studentName: 'Emma Wilson', grade: 'Grade 10', amount: 12000, dueAmount: 6000, status: 'partial', dueDate: f(5) },
  { id: 'PAY-003', studentId: 'STU-003', studentName: 'Aarav Sharma', grade: 'Grade 9', amount: 12000, dueAmount: 12000, status: 'overdue', dueDate: d(10) },
  { id: 'PAY-004', studentId: 'STU-004', studentName: 'Sofia Martinez', grade: 'Grade 8', amount: 12000, dueAmount: 0, status: 'paid', dueDate: f(-5), paidDate: d(2) },
  { id: 'PAY-005', studentId: 'STU-005', studentName: 'Noah Chen', grade: 'Grade 11', amount: 12000, dueAmount: 12000, status: 'pending', dueDate: f(20) },
]

export const MOCK_REPORTS: Report[] = [
  { id: 'RPT-001', title: 'Student Enrollment Summary', category: 'admissions', description: 'Total enrollments by grade and section', lastGenerated: d(2), format: 'pdf' },
  { id: 'RPT-002', title: 'Monthly Attendance Report', category: 'attendance', description: 'Attendance rates across all grades', lastGenerated: d(1), format: 'excel' },
  { id: 'RPT-003', title: 'Fee Collection Statement', category: 'financial', description: 'Payments received and outstanding balances', lastGenerated: d(0), format: 'pdf' },
  { id: 'RPT-004', title: 'Academic Performance', category: 'academic', description: 'GPA and exam results by class', lastGenerated: d(5), format: 'excel' },
  { id: 'RPT-005', title: 'Teacher Workload', category: 'academic', description: 'Classes and subjects per teacher', lastGenerated: d(7), format: 'csv' },
]

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'NTF-001', title: 'New admission enquiry', message: 'Aarav Sharma — Grade 5 inquiry received', type: 'info', read: false, createdAt: d(0), link: '/admissions/enquiries' },
  { id: 'NTF-002', title: 'Fee payment received', message: 'Sofia Martinez paid tuition fee ($12,000)', type: 'success', read: false, createdAt: d(0), link: '/fees/payments' },
  { id: 'NTF-003', title: 'Overdue fee alert', message: 'Aarav Sharma has overdue fees', type: 'warning', read: false, createdAt: d(1), link: '/fees/payments' },
  { id: 'NTF-004', title: 'Exam scheduled', message: 'Mid-Term Mathematics on ' + new Date(f(7)).toLocaleDateString(), type: 'info', read: true, createdAt: d(2), link: '/examinations/schedule' },
  { id: 'NTF-005', title: 'Assignment submitted', message: '28/32 students submitted Quadratic Equations', type: 'success', read: true, createdAt: d(1), link: '/lms/assignments' },
  { id: 'NTF-006', title: 'Low attendance', message: 'Grade 10-B attendance dropped below 90%', type: 'error', read: true, createdAt: d(3), link: '/attendance' },
]

export const MOCK_DASHBOARD_STATS: DashboardStats = {
  students: 1240,
  teachers: 86,
  attendanceRate: 94.2,
  feeCollection: 87,
  activeCourses: 48,
  pendingAdmissions: 28,
  upcomingExams: 3,
  overdueFees: 12,
}
