import { useState } from 'react'
import { Menu, LogOut, Moon, Sun, Monitor, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { GlobalSearch, SearchTrigger, useGlobalSearchShortcut } from '@/components/shared/GlobalSearch'
import { NotificationCenter } from '@/components/shared/NotificationCenter'
import { useAuthStore } from '@/stores/auth.store'
import { useUIStore } from '@/stores/ui.store'

export function Topbar() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const { theme, setTheme, setMobileSidebarOpen } = useUIStore()
  const [searchOpen, setSearchOpen] = useState(false)

  useGlobalSearchShortcut(() => setSearchOpen(true))

  if (!user) return null

  const cycleTheme = () => {
    const next = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'
    setTheme(next)
  }

  const ThemeIcon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-card/80 px-4 backdrop-blur-md lg:px-6">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileSidebarOpen(true)} aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </Button>

        <div className="hidden flex-1 md:block">
          <SearchTrigger onClick={() => setSearchOpen(true)} />
        </div>
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSearchOpen(true)} aria-label="Search">
          <Search className="h-5 w-5" />
        </Button>

        <div className="ml-auto flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={cycleTheme} aria-label={`Theme: ${theme}`} title={`Theme: ${theme}`}>
            <ThemeIcon className="h-5 w-5" />
          </Button>
          <NotificationCenter />
          <div className="hidden items-center gap-3 sm:flex ml-1">
            <Avatar name={user.name} src={user.avatarUrl} size="sm" />
            <div className="hidden md:block">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={logout} aria-label="Logout">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>
      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
