import type { AdmissionLead, ApplicationType } from './index'

export type ApplicationStatus = 'not_started' | 'draft' | 'submitted' | 'approved' | 'rejected'

export type FeeStatus = 'pending' | 'partial' | 'paid'

export type FeePaymentMode = 'full' | 'installment'

/** Complete admission application — collected once at enquiry → application step */
export interface ApplicationFormData {
  // Student identity
  studentName: string
  dateOfBirth: string
  gender: string
  bloodGroup: string
  category: string
  caste: string
  religion: string
  nationality: string
  studentAadhaar: string
  penNumber: string

  // Father
  fatherName: string
  fatherOccupation: string
  fatherPhone: string
  fatherEmail: string
  fatherAadhaar: string
  fatherAnnualIncome: string

  // Mother
  motherName: string
  motherOccupation: string
  motherPhone: string
  motherEmail: string
  motherAadhaar: string
  motherAnnualIncome: string

  // Primary contact (from enquiry)
  parentName: string
  email: string
  phone: string

  // Residential address
  residentialAddress: string
  residentialCity: string
  residentialState: string
  residentialPincode: string

  // Correspondence address
  correspondenceSameAsResidential: boolean
  correspondenceAddress: string
  correspondenceCity: string
  correspondenceState: string
  correspondencePincode: string

  // Academic history
  gradeApplying: string
  academicYear: string
  previousClass: string
  previousSchool: string
  previousBoard: string

  // Admission options
  transportRequired: boolean
  applicationType: ApplicationType
  documentsSubmitted: boolean
  additionalNotes: string
  submittedAt?: string
}

export interface FeeRecord {
  totalAmount: number
  paidAmount: number
  status: FeeStatus
  paymentMode?: FeePaymentMode
  lastPaymentAt?: string
}

export const DEFAULT_ADMISSION_FEE = 25000

export const INSTALLMENT_MINIMUM = 10000

const EMPTY_FORM: Omit<ApplicationFormData, 'submittedAt'> = {
  studentName: '',
  dateOfBirth: '',
  gender: '',
  bloodGroup: '',
  category: '',
  caste: '',
  religion: '',
  nationality: 'Indian',
  studentAadhaar: '',
  penNumber: '',
  fatherName: '',
  fatherOccupation: '',
  fatherPhone: '',
  fatherEmail: '',
  fatherAadhaar: '',
  fatherAnnualIncome: '',
  motherName: '',
  motherOccupation: '',
  motherPhone: '',
  motherEmail: '',
  motherAadhaar: '',
  motherAnnualIncome: '',
  parentName: '',
  email: '',
  phone: '',
  residentialAddress: '',
  residentialCity: '',
  residentialState: '',
  residentialPincode: '',
  correspondenceSameAsResidential: true,
  correspondenceAddress: '',
  correspondenceCity: '',
  correspondenceState: '',
  correspondencePincode: '',
  gradeApplying: '',
  academicYear: '',
  previousClass: '',
  previousSchool: '',
  previousBoard: '',
  transportRequired: false,
  applicationType: 'internal',
  documentsSubmitted: false,
  additionalNotes: '',
}

export function createApplicationFormFromLead(lead: AdmissionLead): ApplicationFormData {
  const existing = lead.applicationForm
  return {
    ...EMPTY_FORM,
    ...existing,
    studentName: existing?.studentName ?? lead.studentName,
    gradeApplying: existing?.gradeApplying ?? lead.gradeApplying,
    academicYear: existing?.academicYear ?? lead.academicYear,
    parentName: existing?.parentName ?? lead.parentName,
    fatherName: existing?.fatherName ?? lead.parentName,
    email: existing?.email ?? lead.email,
    phone: existing?.phone ?? lead.phone,
    fatherPhone: existing?.fatherPhone ?? lead.phone,
    previousSchool: existing?.previousSchool ?? '',
    applicationType: existing?.applicationType ?? 'internal',
  }
}

export function finalizeApplicationForm(form: ApplicationFormData): ApplicationFormData {
  if (!form.correspondenceSameAsResidential) return form
  return {
    ...form,
    correspondenceAddress: form.residentialAddress,
    correspondenceCity: form.residentialCity,
    correspondenceState: form.residentialState,
    correspondencePincode: form.residentialPincode,
  }
}

export function getDefaultFeeForGrade(_grade: string): number {
  return DEFAULT_ADMISSION_FEE
}

export function canFillApplication(lead: {
  stage: string
  applicationStatus?: ApplicationStatus
}): boolean {
  const status = lead.applicationStatus ?? 'not_started'
  if (status === 'submitted' || status === 'approved') return false
  return ['enquiry', 'contacted', 'qualified'].includes(lead.stage)
}

export function canRecordFee(lead: {
  applicationStatus?: ApplicationStatus
  fee?: FeeRecord
}): boolean {
  const status = lead.applicationStatus ?? 'not_started'
  if (status !== 'submitted' && status !== 'approved') return false
  return !lead.fee || lead.fee.status !== 'paid'
}

export function canConvertToStudent(lead: {
  applicationStatus?: ApplicationStatus
  stage: string
  fee?: FeeRecord
}): boolean {
  const status = lead.applicationStatus ?? 'not_started'
  if (lead.stage === 'enrolled') return false
  if (status !== 'submitted' && status !== 'approved') return false
  if (!lead.fee) return false
  return lead.fee.status === 'paid' || lead.fee.status === 'partial'
}

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  not_started: 'Not Started',
  draft: 'Draft',
  submitted: 'Submitted',
  approved: 'Approved',
  rejected: 'Rejected',
}

export const FEE_STATUS_LABELS: Record<FeeStatus, string> = {
  pending: 'Pending',
  partial: 'Installment Paid',
  paid: 'Fully Paid',
}

/** Grouped labels for read-only application view */
export const APPLICATION_FIELD_GROUPS: Array<{
  title: string
  fields: Array<{ key: keyof ApplicationFormData; label: string }>
}> = [
  {
    title: 'Student Details',
    fields: [
      { key: 'studentName', label: 'Student Name' },
      { key: 'dateOfBirth', label: 'Date of Birth' },
      { key: 'gender', label: 'Gender' },
      { key: 'bloodGroup', label: 'Blood Group' },
      { key: 'category', label: 'Category' },
      { key: 'caste', label: 'Caste' },
      { key: 'religion', label: 'Religion' },
      { key: 'nationality', label: 'Nationality' },
      { key: 'studentAadhaar', label: 'Student Aadhaar' },
      { key: 'penNumber', label: 'PEN Number' },
    ],
  },
  {
    title: 'Father Details',
    fields: [
      { key: 'fatherName', label: 'Father Name' },
      { key: 'fatherOccupation', label: 'Occupation' },
      { key: 'fatherPhone', label: 'Phone' },
      { key: 'fatherEmail', label: 'Email' },
      { key: 'fatherAadhaar', label: 'Aadhaar' },
      { key: 'fatherAnnualIncome', label: 'Annual Income' },
    ],
  },
  {
    title: 'Mother Details',
    fields: [
      { key: 'motherName', label: 'Mother Name' },
      { key: 'motherOccupation', label: 'Occupation' },
      { key: 'motherPhone', label: 'Phone' },
      { key: 'motherEmail', label: 'Email' },
      { key: 'motherAadhaar', label: 'Aadhaar' },
      { key: 'motherAnnualIncome', label: 'Annual Income' },
    ],
  },
  {
    title: 'Residential Address',
    fields: [
      { key: 'residentialAddress', label: 'Address' },
      { key: 'residentialCity', label: 'City' },
      { key: 'residentialState', label: 'State' },
      { key: 'residentialPincode', label: 'Pincode' },
    ],
  },
  {
    title: 'Correspondence Address',
    fields: [
      { key: 'correspondenceAddress', label: 'Address' },
      { key: 'correspondenceCity', label: 'City' },
      { key: 'correspondenceState', label: 'State' },
      { key: 'correspondencePincode', label: 'Pincode' },
    ],
  },
  {
    title: 'Academic History',
    fields: [
      { key: 'gradeApplying', label: 'Grade Applying' },
      { key: 'academicYear', label: 'Academic Year' },
      { key: 'previousClass', label: 'Previous Class' },
      { key: 'previousSchool', label: 'Previous School' },
      { key: 'previousBoard', label: 'Previous Board' },
    ],
  },
]
