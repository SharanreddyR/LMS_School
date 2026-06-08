import { Outlet } from 'react-router-dom'
import { env } from '@/config/env'

export function AuthLayout() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      {/* Animated gradient mesh */}
      <div className="login-mesh pointer-events-none absolute inset-0" aria-hidden />

      {/* Floating orbs */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-brand-500/20 blur-3xl login-orb-1" aria-hidden />
      <div className="pointer-events-none absolute -bottom-40 -right-20 h-[28rem] w-[28rem] rounded-full bg-indigo-400/15 blur-3xl login-orb-2" aria-hidden />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-brand-300/10 blur-3xl login-orb-3" aria-hidden />

      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
        style={{
          backgroundImage: `linear-gradient(var(--color-foreground) 1px, transparent 1px), linear-gradient(90deg, var(--color-foreground) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
        aria-hidden
      />

      <div className="relative z-10 w-full px-4 py-10 sm:px-6">
        <Outlet />
      </div>

      <p className="absolute bottom-4 left-0 right-0 z-10 text-center text-xs text-muted-foreground/60">
        © {new Date().getFullYear()} {env.appName}
      </p>
    </div>
  )
}
