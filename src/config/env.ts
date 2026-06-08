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
} as const

export type Env = typeof env
