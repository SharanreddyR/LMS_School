import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdmissionSetup } from '../hooks/useAdmissionSetup'
import { AdmissionFeatureInactive } from './AdmissionFeatureInactive'
import { ROUTES } from '@/config/routes'
import type { AdmissionFeatureKey } from '../types/setup'

interface AdmissionFeatureGuardProps {
  feature: AdmissionFeatureKey
  children: ReactNode
}

export function AdmissionFeatureGuard({ feature, children }: AdmissionFeatureGuardProps) {
  const navigate = useNavigate()
  const { currentYear, isYearActive, isFeatureEnabled } = useAdmissionSetup()

  if (!currentYear) {
    return (
      <AdmissionFeatureInactive
        feature={feature}
        reason="year-inactive"
        onGoToSetup={() => navigate(ROUTES.ADMISSIONS.SETUP)}
      />
    )
  }

  if (!isYearActive) {
    return (
      <AdmissionFeatureInactive
        feature={feature}
        yearLabel={currentYear.label}
        reason="year-inactive"
        onGoToSetup={() => navigate(ROUTES.ADMISSIONS.SETUP)}
      />
    )
  }

  if (!isFeatureEnabled(feature)) {
    return (
      <AdmissionFeatureInactive
        feature={feature}
        yearLabel={currentYear.label}
        reason="feature-disabled"
        onGoToSetup={() => navigate(ROUTES.ADMISSIONS.SETUP)}
      />
    )
  }

  return <>{children}</>
}
