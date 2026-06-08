import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { useUIStore } from '@/stores/ui.store'
import { cn } from '@/lib/utils'

export function DashboardLayout() {
  const { mobileSidebarOpen, setMobileSidebarOpen } = useUIStore()

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileSidebarOpen(false)}
            aria-hidden
          />
          <div className={cn('absolute inset-y-0 left-0 z-50 shadow-xl')}>
            <Sidebar mobile onClose={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
