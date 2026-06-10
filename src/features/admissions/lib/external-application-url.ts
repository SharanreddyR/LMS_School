import { ROUTES } from '@/config/routes'
import { getPublicAppOrigin } from '@/lib/mobile-app-url'

export interface ExternalApplicationLinkOptions {
  ref?: string
  year?: string
}

/** Builds the public URL encoded in external-application QR codes. */
export function getExternalApplicationUrl(options: ExternalApplicationLinkOptions = {}): string {
  const origin = getPublicAppOrigin()

  const params = new URLSearchParams()
  if (options.year) params.set('year', options.year)
  if (options.ref) params.set('ref', options.ref)

  const query = params.toString()
  return `${origin}${ROUTES.APPLY.EXTERNAL}${query ? `?${query}` : ''}`
}

export { getPublicAppOrigin, isUsingLocalhostForQr } from '@/lib/mobile-app-url'
