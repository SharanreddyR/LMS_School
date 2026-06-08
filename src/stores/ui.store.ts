import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIState {
  sidebarCollapsed: boolean
  mobileSidebarOpen: boolean
  theme: 'light' | 'dark' | 'system'
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setMobileSidebarOpen: (open: boolean) => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      mobileSidebarOpen: false,
      theme: 'light',
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'edunexus-ui',
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        mobileSidebarOpen: state.mobileSidebarOpen,
        theme: state.theme,
      }),
    },
  ),
)
