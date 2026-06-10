/**
 * Centralized, typed environment configuration.
 * All env access goes through this module — never use import.meta.env directly elsewhere.
 */
function parseBool(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined || value === '') return fallback
  return value === 'true' || value === '1'
}

export const env = {
  /** Application display name */
  appName: import.meta.env.VITE_APP_NAME || 'EduNexus',

  /** REST API base URL */
  apiUrl: import.meta.env.VITE_API_URL || '/api/v1',

  /** When true, all services use mock-api instead of HTTP */
  useMockApi: parseBool(import.meta.env.VITE_USE_MOCK_API, true),

  /** Show React Query Devtools in development */
  enableDevtools: parseBool(import.meta.env.VITE_ENABLE_DEVTOOLS, import.meta.env.DEV),

  /** True during Vite dev server */
  isDev: import.meta.env.DEV,

  /** True in production build */
  isProd: import.meta.env.PROD,

  /**
   * Public URL for QR codes / mobile access (e.g. http://192.168.1.5:5173).
   * Set when localhost is not reachable from phones on the same network.
   */
  publicAppUrl: (import.meta.env.VITE_PUBLIC_APP_URL as string | undefined)?.replace(/\/$/, '') || '',
} as const

export type Env = typeof env
