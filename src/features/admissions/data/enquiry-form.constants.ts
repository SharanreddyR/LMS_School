import { INDIAN_STATES } from './application-form.constants'

export { INDIAN_STATES }

export const GENDERS = ['male', 'female', 'other'] as const

export const GENDER_LABELS: Record<(typeof GENDERS)[number], string> = {
  male: 'Male',
  female: 'Female',
  other: 'Other',
}
