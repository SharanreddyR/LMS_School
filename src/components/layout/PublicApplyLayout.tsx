import { Outlet } from 'react-router-dom'
import { env } from '@/config/env'

/** Minimal public layout for QR-scanned application forms (no sidebar/login). */
export function PublicApplyLayout() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-brand-50/40 via-background to-background">
      <div className="login-mesh pointer-events-none absolute inset-0 opacity-40" aria-hidden />
      <div className="relative z-10 mx-auto min-h-screen w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
        <Outlet />
      </div>
      <p className="relative z-10 pb-6 text-center text-xs text-muted-foreground/70">
        © {new Date().getFullYear()} {env.appName} · Secure admission portal
      </p>
    </div>
  )
}
