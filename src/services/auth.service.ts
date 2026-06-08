import { apiPost, createAppError } from '@/lib/api'
import { env } from '@/config/env'
import { DEMO_USERS } from '@/stores/auth.store'
import type { User } from '@/types/auth'

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  user: User
  token: string
}

/** Demo password for all mock accounts — replace with real API auth in production */
const DEMO_PASSWORD = 'demo123'

async function mockAuthenticate({ email, password }: LoginCredentials): Promise<LoginResponse> {
  await new Promise((r) => setTimeout(r, 500))

  const normalized = email.trim().toLowerCase()
  const user = Object.values(DEMO_USERS).find((u) => u.email.toLowerCase() === normalized)

  if (!user || password !== DEMO_PASSWORD) {
    throw createAppError({
      message: 'Invalid email or password',
      status: 401,
      isUnauthorized: true,
    })
  }

  return { user, token: `demo-token-${user.id}` }
}

async function apiAuthenticate(credentials: LoginCredentials): Promise<LoginResponse> {
  return apiPost<LoginResponse>('/auth/login', credentials)
}

export async function authenticate(credentials: LoginCredentials): Promise<LoginResponse> {
  if (env.useMockApi) {
    return mockAuthenticate(credentials)
  }
  return apiAuthenticate(credentials)
}
