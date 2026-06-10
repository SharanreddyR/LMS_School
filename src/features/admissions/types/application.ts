import type { AdmissionLead, ApplicationType } from './index'

export type ApplicationStatus = 'not_started' | 'draft' | 'submitted' | 'approved' | 'rejected'

export type FeeStatus = 'pending' | 'partial' | 'paid'

export type FeePaymentMode = 'full' | 'installment'

/** Step 2 — complete admission application (all sections) */
export interface ApplicationFormData {
  // §1 Student — basic
  studentName: string
  firstName: string
  middleName: string
  lastName: string
  admissionNumber: string
  studentPhotoUploaded: boolean
  dateOfBirth: string
  gender: string
  bloodGroup: string
  nationality: string
  religion: string
  category: string
  caste: string
  studentAadhaar: string
  penNumber: string
  motherTongue: string
  placeOfBirth: string
  stateOfBirth: string
  countryOfBirth: string

  // §2 Father
  fatherName: string
  fatherPhone: string
  fatherEmail: string
  fatherOccupation: string
  fatherCompany: string
  fatherDesignation: string
  fatherQualification: string
  fatherAnnualIncome: string
  fatherAadhaar: string

  // §2 Mother
  motherName: string
  motherPhone: string
  motherEmail: string
  motherOccupation: string
  motherCompany: string
  motherDesignation: string
  motherQualification: string
  motherAnnualIncome: string
  motherAadhaar: string

  // §3 Guardian (optional)
  guardianName: string
  guardianRelationship: string
  guardianPhone: string
  guardianEmail: string
  guardianOccupation: string
  guardianAddress: string

  // Primary contact (legacy / enquiry sync)
  parentName: string
  email: string
  phone: string

  // §4 Communication address
  commAddressLine1: string
  commAddressLine2: string
  commArea: string
  commLandmark: string
  commCity: string
  commDistrict: string
  commState: string
  commCountry: string
  commPincode: string

  // Permanent address
  permanentSameAsComm: boolean
  permanentAddressLine1: string
  permanentAddressLine2: string
  permanentArea: string
  permanentCity: string
  permanentDistrict: string
  permanentState: string
  permanentCountry: string
  permanentPincode: string

  // Legacy address aliases (synced on finalize)
  residentialAddress: string
  residentialCity: string
  residentialState: string
  residentialPincode: string
  correspondenceSameAsResidential: boolean
  correspondenceAddress: string
  correspondenceCity: string
  correspondenceState: string
  correspondencePincode: string

  // §5 Academic
  gradeApplying: string
  academicYear: string
  stream: string
  mediumOfInstruction: string
  previousSchool: string
  previousBoard: string
  previousSchoolAddress: string
  previousClass: string
  previousPercentage: string
  tcNumber: string
  dateOfLeaving: string

  // §6 Medical
  height: string
  weight: string
  allergies: string
  medicalConditions: string
  disabilityDetails: string
  specialLearningNeeds: string
  vaccinationStatus: string
  doctorName: string
  doctorContact: string

  // §7 Emergency
  emergency1Name: string
  emergency1Relationship: string
  emergency1Phone: string
  emergency2Name: string
  emergency2Relationship: string
  emergency2Phone: string

  // §8 Transport
  transportRequired: boolean
  pickupAddress: string
  dropAddress: string
  busStop: string
  transportRoute: string

  // §9 Hostel
  hostelRequired: boolean
  hostelRoomType: string
  foodPreference: string
  localGuardianName: string
  localGuardianContact: string

  // §10 Sibling
  siblingInSchool: boolean
  siblingName: string
  siblingAdmissionNo: string
  siblingClass: string
  siblingSection: string

  // §11 Documents
  docStudentPhoto: boolean
  docBirthCertificate: boolean
  docAadhaar: boolean
  docAddressProof: boolean
  docReportCard: boolean
  docTransferCertificate: boolean
  docCasteCertificate: boolean
  docIncomeCertificate: boolean
  docPassport: boolean
  docMedicalCertificate: boolean
  docDisabilityCertificate: boolean
  documentsSubmitted: boolean

  // §12 Declarations
  declInfoTrue: boolean
  declSchoolPolicies: boolean
  declPhotoConsent: boolean
  declMedicalConsent: boolean
  fatherSignature: string
  motherSignature: string
  guardianSignature: string
  declarationDate: string

  applicationType: ApplicationType
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

export const MANDATORY_DOC_KEYS = [
  'docStudentPhoto',
  'docBirthCertificate',
  'docAadhaar',
  'docAddressProof',
  'docReportCard',
  'docTransferCertificate',
] as const

function emptyFormDefaults(): Omit<ApplicationFormData, 'submittedAt'> {
  return {
    studentName: '',
    firstName: '',
    middleName: '',
    lastName: '',
    admissionNumber: '',
    studentPhotoUploaded: false,
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    nationality: 'Indian',
    religion: '',
    category: '',
    caste: '',
    studentAadhaar: '',
    penNumber: '',
    motherTongue: '',
    placeOfBirth: '',
    stateOfBirth: '',
    countryOfBirth: 'India',
    fatherName: '',
    fatherPhone: '',
    fatherEmail: '',
    fatherOccupation: '',
    fatherCompany: '',
    fatherDesignation: '',
    fatherQualification: '',
    fatherAnnualIncome: '',
    fatherAadhaar: '',
    motherName: '',
    motherPhone: '',
    motherEmail: '',
    motherOccupation: '',
    motherCompany: '',
    motherDesignation: '',
    motherQualification: '',
    motherAnnualIncome: '',
    motherAadhaar: '',
    guardianName: '',
    guardianRelationship: '',
    guardianPhone: '',
    guardianEmail: '',
    guardianOccupation: '',
    guardianAddress: '',
    parentName: '',
    email: '',
    phone: '',
    commAddressLine1: '',
    commAddressLine2: '',
    commArea: '',
    commLandmark: '',
    commCity: '',
    commDistrict: '',
    commState: '',
    commCountry: 'India',
    commPincode: '',
    permanentSameAsComm: true,
    permanentAddressLine1: '',
    permanentAddressLine2: '',
    permanentArea: '',
    permanentCity: '',
    permanentDistrict: '',
    permanentState: '',
    permanentCountry: 'India',
    permanentPincode: '',
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
    stream: '',
    mediumOfInstruction: 'English',
    previousSchool: '',
    previousBoard: '',
    previousSchoolAddress: '',
    previousClass: '',
    previousPercentage: '',
    tcNumber: '',
    dateOfLeaving: '',
    height: '',
    weight: '',
    allergies: '',
    medicalConditions: '',
    disabilityDetails: '',
    specialLearningNeeds: '',
    vaccinationStatus: '',
    doctorName: '',
    doctorContact: '',
    emergency1Name: '',
    emergency1Relationship: '',
    emergency1Phone: '',
    emergency2Name: '',
    emergency2Relationship: '',
    emergency2Phone: '',
    transportRequired: false,
    pickupAddress: '',
    dropAddress: '',
    busStop: '',
    transportRoute: '',
    hostelRequired: false,
    hostelRoomType: '',
    foodPreference: '',
    localGuardianName: '',
    localGuardianContact: '',
    siblingInSchool: false,
    siblingName: '',
    siblingAdmissionNo: '',
    siblingClass: '',
    siblingSection: '',
    docStudentPhoto: false,
    docBirthCertificate: false,
    docAadhaar: false,
    docAddressProof: false,
    docReportCard: false,
    docTransferCertificate: false,
    docCasteCertificate: false,
    docIncomeCertificate: false,
    docPassport: false,
    docMedicalCertificate: false,
    docDisabilityCertificate: false,
    documentsSubmitted: false,
    declInfoTrue: false,
    declSchoolPolicies: false,
    declPhotoConsent: false,
    declMedicalConsent: false,
    fatherSignature: '',
    motherSignature: '',
    guardianSignature: '',
    declarationDate: '',
    applicationType: 'internal',
    additionalNotes: '',
  }
}

export function buildStudentFullName(form: Pick<ApplicationFormData, 'firstName' | 'middleName' | 'lastName' | 'studentName'>) {
  const fromParts = [form.firstName, form.middleName, form.lastName].filter(Boolean).join(' ').trim()
  return fromParts || form.studentName
}

export function areMandatoryDocumentsComplete(form: ApplicationFormData): boolean {
  return MANDATORY_DOC_KEYS.every((key) => form[key])
}

export function areDeclarationsComplete(form: ApplicationFormData): boolean {
  return form.declInfoTrue && form.declSchoolPolicies && form.declMedicalConsent
}

export function createApplicationFormFromLead(lead: AdmissionLead): ApplicationFormData {
  const existing = lead.applicationForm
  const base = { ...emptyFormDefaults(), ...existing }

  const studentName = existing?.studentName ?? lead.studentName
  const nameParts = studentName.trim().split(/\s+/)
  const firstName = existing?.firstName || nameParts[0] || ''
  const lastName = existing?.lastName || (nameParts.length > 1 ? nameParts[nameParts.length - 1] : '')
  const middleName = existing?.middleName || (nameParts.length > 2 ? nameParts.slice(1, -1).join(' ') : '')

  return finalizeApplicationForm({
    ...base,
    studentName,
    firstName,
    middleName,
    lastName,
    dateOfBirth: existing?.dateOfBirth ?? lead.dateOfBirth ?? '',
    gender: existing?.gender ?? lead.gender ?? '',
    gradeApplying: existing?.gradeApplying ?? lead.gradeApplying,
    academicYear: existing?.academicYear ?? lead.academicYear,
    parentName: existing?.parentName ?? lead.parentName,
    fatherName: existing?.fatherName ?? lead.parentName,
    email: existing?.email ?? lead.email,
    phone: existing?.phone ?? lead.phone,
    fatherPhone: existing?.fatherPhone ?? lead.phone,
    commCity: existing?.commCity ?? lead.city ?? '',
    commState: existing?.commState ?? lead.state ?? '',
    previousSchool: existing?.previousSchool ?? lead.currentSchool ?? '',
    applicationType: existing?.applicationType ?? 'internal',
    admissionNumber: existing?.admissionNumber ?? lead.enquiryNumber ?? lead.id,
  })
}

export function createEmptyExternalApplicationForm(academicYear: string): ApplicationFormData {
  return finalizeApplicationForm({
    ...emptyFormDefaults(),
    academicYear,
    gradeApplying: 'Grade 1',
    applicationType: 'external',
  })
}

export function finalizeApplicationForm(form: ApplicationFormData): ApplicationFormData {
  const studentName = buildStudentFullName(form)
  const commAddressLine1 = form.commAddressLine1 || form.residentialAddress
  const commCity = form.commCity || form.residentialCity
  const commState = form.commState || form.residentialState
  const commPincode = form.commPincode || form.residentialPincode

  const permanent = form.permanentSameAsComm
    ? {
        permanentAddressLine1: commAddressLine1,
        permanentAddressLine2: form.commAddressLine2,
        permanentArea: form.commArea,
        permanentCity: commCity,
        permanentDistrict: form.commDistrict,
        permanentState: commState,
        permanentCountry: form.commCountry,
        permanentPincode: commPincode,
      }
    : {}

  const corrSame = form.permanentSameAsComm ?? form.correspondenceSameAsResidential

  return {
    ...form,
    studentName,
    commAddressLine1,
    commCity,
    commState,
    commPincode,
    ...permanent,
    residentialAddress: commAddressLine1,
    residentialCity: commCity,
    residentialState: commState,
    residentialPincode: commPincode,
    correspondenceSameAsResidential: corrSame,
    correspondenceAddress: corrSame ? commAddressLine1 : form.permanentAddressLine1 || form.correspondenceAddress,
    correspondenceCity: corrSame ? commCity : form.permanentCity || form.correspondenceCity,
    correspondenceState: corrSame ? commState : form.permanentState || form.correspondenceState,
    correspondencePincode: corrSame ? commPincode : form.permanentPincode || form.correspondencePincode,
    documentsSubmitted: form.documentsSubmitted || areMandatoryDocumentsComplete(form),
    studentPhotoUploaded: form.studentPhotoUploaded || form.docStudentPhoto,
  }
}

export function getDefaultFeeForGrade(_grade: string): number {
  return DEFAULT_ADMISSION_FEE
}

export function canFillApplication(lead: {
  stage: string
  enquiryStatus?: string
  applicationStatus?: ApplicationStatus
}): boolean {
  const status = lead.applicationStatus ?? 'not_started'
  if (status === 'submitted' || status === 'approved') return false
  if (lead.enquiryStatus === 'closed') return false
  return true
}

export function canRecordFee(lead: {
  applicationStatus?: ApplicationStatus
  fee?: FeeRecord
  applicationForm?: ApplicationFormData
}): boolean {
  const status = lead.applicationStatus ?? 'not_started'
  if (status !== 'submitted' && status !== 'approved') return false
  if (!lead.applicationForm || !areMandatoryDocumentsComplete(lead.applicationForm)) return false
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
  approved: 'Under Review',
  rejected: 'Rejected',
}

export const FEE_STATUS_LABELS: Record<FeeStatus, string> = {
  pending: 'Pending',
  partial: 'Installment Paid',
  paid: 'Fully Paid',
}

export const APPLICATION_WIZARD_STEPS = [
  { id: 'student', title: 'Student Details' },
  { id: 'parents', title: 'Parent Details' },
  { id: 'guardian', title: 'Guardian' },
  { id: 'address', title: 'Address' },
  { id: 'academic', title: 'Academic' },
  { id: 'medical', title: 'Medical' },
  { id: 'emergency', title: 'Emergency' },
  { id: 'transport', title: 'Transport & Hostel' },
  { id: 'sibling', title: 'Sibling' },
  { id: 'documents', title: 'Documents' },
  { id: 'declaration', title: 'Declaration' },
] as const

export const APPLICATION_FIELD_GROUPS: Array<{
  title: string
  fields: Array<{ key: keyof ApplicationFormData; label: string }>
}> = [
  {
    title: 'Student Details',
    fields: [
      { key: 'firstName', label: 'First Name' },
      { key: 'middleName', label: 'Middle Name' },
      { key: 'lastName', label: 'Last Name' },
      { key: 'admissionNumber', label: 'Admission Number' },
      { key: 'dateOfBirth', label: 'Date of Birth' },
      { key: 'gender', label: 'Gender' },
      { key: 'bloodGroup', label: 'Blood Group' },
      { key: 'nationality', label: 'Nationality' },
      { key: 'category', label: 'Category' },
      { key: 'studentAadhaar', label: 'Aadhaar' },
      { key: 'motherTongue', label: 'Mother Tongue' },
      { key: 'placeOfBirth', label: 'Place of Birth' },
    ],
  },
  {
    title: 'Father Details',
    fields: [
      { key: 'fatherName', label: 'Name' },
      { key: 'fatherPhone', label: 'Mobile' },
      { key: 'fatherOccupation', label: 'Occupation' },
      { key: 'fatherCompany', label: 'Company' },
      { key: 'fatherAnnualIncome', label: 'Annual Income' },
    ],
  },
  {
    title: 'Mother Details',
    fields: [
      { key: 'motherName', label: 'Name' },
      { key: 'motherPhone', label: 'Mobile' },
      { key: 'motherOccupation', label: 'Occupation' },
      { key: 'motherCompany', label: 'Company' },
    ],
  },
  {
    title: 'Communication Address',
    fields: [
      { key: 'commAddressLine1', label: 'Address Line 1' },
      { key: 'commArea', label: 'Area' },
      { key: 'commCity', label: 'City' },
      { key: 'commDistrict', label: 'District' },
      { key: 'commState', label: 'State' },
      { key: 'commPincode', label: 'Pincode' },
    ],
  },
  {
    title: 'Academic History',
    fields: [
      { key: 'gradeApplying', label: 'Grade Applying' },
      { key: 'academicYear', label: 'Academic Year' },
      { key: 'previousSchool', label: 'Previous School' },
      { key: 'previousClass', label: 'Last Class' },
      { key: 'previousPercentage', label: 'Percentage / Grade' },
      { key: 'tcNumber', label: 'TC Number' },
    ],
  },
  {
    title: 'Medical & Emergency',
    fields: [
      { key: 'allergies', label: 'Allergies' },
      { key: 'medicalConditions', label: 'Medical Conditions' },
      { key: 'emergency1Name', label: 'Emergency Contact 1' },
      { key: 'emergency1Phone', label: 'Emergency Phone 1' },
    ],
  },
]
