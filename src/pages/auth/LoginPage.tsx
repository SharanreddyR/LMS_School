import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { GraduationCap, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { authenticate } from '@/services'
import { useAuthStore } from '@/stores/auth.store'
import { DEFAULT_ROUTE_BY_ROLE } from '@/config/permissions'
import { env } from '@/config/env'
import { getErrorMessage } from '@/lib/api'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    const trimmedEmail = email.trim()
    if (!trimmedEmail || !password) {
      setError('Please enter your email and password.')
      return
    }

    setIsLoading(true)
    try {
      const { user } = await authenticate({ email: trimmedEmail, password })
      login(user)
      navigate(DEFAULT_ROUTE_BY_ROLE[user.role], { replace: true })
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-[400px]">
      {/* Logo */}
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-600/30">
          <GraduationCap className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">{env.appName}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Sign in to your school portal</p>
      </div>

      {/* Form card */}
      <div className="rounded-2xl border border-border/60 bg-card/80 p-6 shadow-[var(--shadow-elevated)] backdrop-blur-xl sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {error && (
            <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-400">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@school.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 pl-10"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 pl-10 pr-10"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" className="h-11 w-full text-sm font-semibold" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </Button>
        </form>
      </div>

      {env.useMockApi && (
        <p className="mt-6 text-center text-xs text-muted-foreground/70">
          Demo: use any account email with password <span className="font-mono text-muted-foreground">demo123</span>
        </p>
      )}
    </div>
  )
}
