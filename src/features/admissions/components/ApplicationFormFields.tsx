import type { ApplicationFormData } from '../types/application'
import { ApplicationFormWizard } from './ApplicationFormWizard'

interface ApplicationFormFieldsProps {
  form: ApplicationFormData
  onChange: <K extends keyof ApplicationFormData>(key: K, value: ApplicationFormData[K]) => void
  hideApplicationType?: boolean
  variant?: 'default' | 'public'
}

export function ApplicationFormFields({ variant = 'default', ...props }: ApplicationFormFieldsProps) {
  return <ApplicationFormWizard {...props} variant={variant} />
}
