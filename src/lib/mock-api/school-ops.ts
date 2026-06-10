export interface Announcement {
  id: string
  title: string
  body: string
  audience: 'all' | 'students' | 'parents' | 'teachers' | 'staff'
  priority: 'normal' | 'important' | 'urgent'
  author: string
  publishedAt: string
  pinned: boolean
}

export interface TimetableSlot {
  id: string
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri'
  period: number
  startTime: string
  endTime: string
  subject: string
  teacher: string
  grade: string
  section: string
  room: string
}

export interface TransportRoute {
  id: string
  name: string
  driver: string
  phone: string
  vehicleNo: string
  stops: number
  students: number
  status: 'active' | 'inactive'
}

export interface LibraryBook {
  id: string
  title: string
  author: string
  isbn: string
  category: string
  copies: number
  available: number
  status: 'available' | 'low_stock'
}

export interface HomeworkItem {
  id: string
  title: string
  subject: string
  grade: string
  teacher: string
  dueDate: string
  status: 'assigned' | 'submitted' | 'graded'
  submissions: number
  total: number
}

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ANN-001',
    title: 'Annual Day Rehearsals Begin',
    body: 'Grade 6–12 students report to the auditorium at 2 PM from Monday.',
    audience: 'students',
    priority: 'important',
    author: 'Dr. Sarah Chen',
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    pinned: true,
  },
  {
    id: 'ANN-002',
    title: 'Fee Installment Due — Term 2',
    body: 'Second term fee installment is due by the 15th. Pay via the parent portal.',
    audience: 'parents',
    priority: 'urgent',
    author: 'Accounts Office',
    publishedAt: new Date(Date.now() - 172800000).toISOString(),
    pinned: true,
  },
  {
    id: 'ANN-003',
    title: 'Staff Meeting — Curriculum Review',
    body: 'All subject teachers meet in Conference Room B at 3:30 PM Friday.',
    audience: 'teachers',
    priority: 'normal',
    author: 'Principal Office',
    publishedAt: new Date(Date.now() - 259200000).toISOString(),
    pinned: false,
  },
]

export const MOCK_TIMETABLE: TimetableSlot[] = [
  { id: 'TT-1', day: 'Mon', period: 1, startTime: '08:00', endTime: '08:45', subject: 'Mathematics', teacher: 'Emily Rodriguez', grade: 'Grade 10', section: 'A', room: '101' },
  { id: 'TT-2', day: 'Mon', period: 2, startTime: '08:50', endTime: '09:35', subject: 'Physics', teacher: 'David Thompson', grade: 'Grade 10', section: 'A', room: 'Lab-1' },
  { id: 'TT-3', day: 'Mon', period: 3, startTime: '09:50', endTime: '10:35', subject: 'English', teacher: 'Maria Garcia', grade: 'Grade 10', section: 'A', room: '204' },
  { id: 'TT-4', day: 'Tue', period: 1, startTime: '08:00', endTime: '08:45', subject: 'History', teacher: 'James Wilson', grade: 'Grade 9', section: 'B', room: '105' },
  { id: 'TT-5', day: 'Wed', period: 4, startTime: '11:20', endTime: '12:05', subject: 'Computer Science', teacher: 'Lisa Chen', grade: 'Grade 11', section: 'A', room: 'Lab-2' },
  { id: 'TT-6', day: 'Thu', period: 2, startTime: '08:50', endTime: '09:35', subject: 'Mathematics', teacher: 'Emily Rodriguez', grade: 'Grade 10', section: 'A', room: '101' },
  { id: 'TT-7', day: 'Fri', period: 5, startTime: '12:10', endTime: '12:55', subject: 'Physical Education', teacher: 'Robert Kim', grade: 'Grade 8', section: 'A', room: 'Ground' },
]

export const MOCK_TRANSPORT: TransportRoute[] = [
  { id: 'TR-01', name: 'Route A — North Campus', driver: 'Ramesh Kumar', phone: '+91 98765 11111', vehicleNo: 'KA-01-AB-1234', stops: 8, students: 42, status: 'active' },
  { id: 'TR-02', name: 'Route B — City Center', driver: 'Suresh Patel', phone: '+91 98765 22222', vehicleNo: 'KA-01-CD-5678', stops: 12, students: 55, status: 'active' },
  { id: 'TR-03', name: 'Route C — East Side', driver: 'Anil Mehta', phone: '+91 98765 33333', vehicleNo: 'KA-01-EF-9012', stops: 6, students: 28, status: 'active' },
]

export const MOCK_LIBRARY: LibraryBook[] = [
  { id: 'LIB-001', title: 'Concepts of Physics', author: 'H.C. Verma', isbn: '978-8177091878', category: 'Science', copies: 24, available: 18, status: 'available' },
  { id: 'LIB-002', title: 'Mathematics for Class 10', author: 'R.D. Sharma', isbn: '978-8193040501', category: 'Mathematics', copies: 30, available: 12, status: 'available' },
  { id: 'LIB-003', title: 'Wings of Fire', author: 'A.P.J. Abdul Kalam', isbn: '978-8173711461', category: 'Biography', copies: 15, available: 3, status: 'low_stock' },
  { id: 'LIB-004', title: 'Oxford English Dictionary', author: 'Oxford', isbn: '978-0198611868', category: 'Reference', copies: 8, available: 5, status: 'available' },
]

export const MOCK_HOMEWORK: HomeworkItem[] = [
  { id: 'HW-001', title: 'Algebra Practice Set 4', subject: 'Mathematics', grade: 'Grade 10', teacher: 'Emily Rodriguez', dueDate: new Date(Date.now() + 86400000 * 2).toISOString(), status: 'assigned', submissions: 18, total: 32 },
  { id: 'HW-002', title: 'Newton\'s Laws Summary', subject: 'Physics', grade: 'Grade 9', teacher: 'David Thompson', dueDate: new Date(Date.now() + 86400000 * 3).toISOString(), status: 'assigned', submissions: 12, total: 28 },
  { id: 'HW-003', title: 'Essay Draft — Climate Change', subject: 'English', grade: 'Grade 8', teacher: 'Maria Garcia', dueDate: new Date(Date.now() - 86400000).toISOString(), status: 'graded', submissions: 30, total: 30 },
]
