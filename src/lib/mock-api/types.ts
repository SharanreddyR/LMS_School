export interface Student {
  id: string
  name: string
  email: string
  grade: string
  section: string
  rollNo: string
  parentName: string
  phone: string
  status: 'active' | 'inactive' | 'graduated'
  attendance: number
  gpa: number
  avatarUrl?: string
  enrolledAt: string
}

export interface Teacher {
  id: string
  name: string
  email: string
  phone: string
  department: string
  subjects: string[]
  classes: string[]
  status: 'active' | 'on_leave'
  experience: number
  avatarUrl?: string
}

export interface ParentChild {
  id: string
  name: string
  grade: string
  avatarUrl?: string
}

export interface Parent {
  id: string
  name: string
  email: string
  phone: string
  avatarUrl?: string
  children: ParentChild[]
  status: 'active' | 'inactive'
}

export interface Course {
  id: string
  title: string
  code: string
  teacher: string
  grade: string
  students: number
  progress: number
  status: 'active' | 'draft' | 'archived'
}

export interface Assignment {
  id: string
  title: string
  course: string
  dueDate: string
  submissions: number
  total: number
  status: 'open' | 'closed' | 'grading'
}

export interface AttendanceRecord {
  id: string
  date: string
  grade: string
  section: string
  present: number
  absent: number
  late: number
  total: number
  markedBy: string
}

export interface Exam {
  id: string
  name: string
  subject: string
  grade: string
  date: string
  startTime: string
  duration: string
  room: string
  status: 'scheduled' | 'ongoing' | 'completed'
}

export interface ExamResult {
  id: string
  studentId: string
  studentName: string
  examName: string
  subject: string
  score: number
  maxScore: number
  grade: string
  rank?: number
}

export interface FeeStructure {
  id: string
  name: string
  grade: string
  amount: number
  frequency: 'annual' | 'term' | 'monthly'
  dueDate: string
}

export interface FeePayment {
  id: string
  studentId: string
  studentName: string
  grade: string
  amount: number
  dueAmount: number
  status: 'paid' | 'partial' | 'overdue' | 'pending'
  dueDate: string
  paidDate?: string
}

export interface Report {
  id: string
  title: string
  category: 'academic' | 'attendance' | 'financial' | 'admissions'
  description: string
  lastGenerated: string
  format: 'pdf' | 'excel' | 'csv'
}

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  createdAt: string
  link?: string
}

export interface DashboardStats {
  students: number
  teachers: number
  attendanceRate: number
  feeCollection: number
  activeCourses: number
  pendingAdmissions: number
  upcomingExams: number
  overdueFees: number
}

export interface SearchResult {
  id: string
  type: 'student' | 'teacher' | 'parent' | 'course' | 'lead' | 'exam'
  title: string
  subtitle: string
  href: string
}
