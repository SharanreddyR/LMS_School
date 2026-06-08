import { useEffect, type ReactNode } from 'react'
import { useUIStore } from '@/stores/ui.store'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useUIStore((s) => s.theme)

  useEffect(() => {
    const root = document.documentElement
    const apply = (dark: boolean) => root.classList.toggle('dark', dark)

    if (theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      apply(mq.matches)
      const handler = (e: MediaQueryListEvent) => apply(e.matches)
      mq.addEventListener('change', handler)
      return () => mq.removeEventListener('change', handler)
    }
    apply(theme === 'dark')
  }, [theme])

  return children
}
