import { apiPost, createAppError } from '@/lib/api'
import { env } from '@/config/env'
import { DEMO_USERS } from '@/stores/auth.store'
import type { User } from '@/types/auth'

export interface LoginCredentials {
  username: string
  password: string
}

export interface LoginResponse {
  user: User
  token: string
}

const ROLE_KEYWORDS: Array<{ match: RegExp; role: User['role'] }> = [
  { match: /super|superadmin/, role: 'super_admin' },
  { match: /principal|schooladmin|school_admin/, role: 'school_admin' },
  { match: /admission/, role: 'admission_team' },
  { match: /teacher/, role: 'teacher' },
  { match: /student/, role: 'student' },
  { match: /parent/, role: 'parent' },
]

function inferRoleFromUsername(username: string): User['role'] {
  const normalized = username.trim().toLowerCase()
  return ROLE_KEYWORDS.find(({ match }) => match.test(normalized))?.role ?? 'super_admin'
}

function resolveMockUser(username: string): User {
  const trimmed = username.trim()
  const normalized = trimmed.toLowerCase()

  const demoUser = Object.values(DEMO_USERS).find(
    (u) =>
      u.email.toLowerCase() === normalized ||
      u.name.toLowerCase() === normalized ||
      u.role.replace('_', '') === normalized.replace(/[\s_-]/g, ''),
  )
  if (demoUser) return { ...demoUser }

  const role = inferRoleFromUsername(trimmed)
  const baseUser = DEMO_USERS[role]

  return {
    ...baseUser,
    id: `mock-${normalized.replace(/[^a-z0-9]+/g, '-')}`,
    email: trimmed.includes('@') ? trimmed : `${normalized.replace(/\s+/g, '.')}@demo.local`,
    name: trimmed,
  }
}

async function mockAuthenticate({ username, password }: LoginCredentials): Promise<LoginResponse> {
  await new Promise((r) => setTimeout(r, 500))

  if (!username.trim() || !password) {
    throw createAppError({
      message: 'Please enter a username and password',
      status: 400,
    })
  }

  const user = resolveMockUser(username)
  return { user, token: `demo-token-${user.id}` }
}

async function apiAuthenticate({ username, password }: LoginCredentials): Promise<LoginResponse> {
  return apiPost<LoginResponse>('/auth/login', { email: username, password })
}

export async function authenticate(credentials: LoginCredentials): Promise<LoginResponse> {
  if (env.useMockApi) {
    return mockAuthenticate(credentials)
  }
  return apiAuthenticate(credentials)
}
