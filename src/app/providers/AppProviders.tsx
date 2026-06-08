import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@/components/shared/ThemeProvider'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { env } from '@/config/env'
import type { ReactNode } from 'react'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: (failureCount, error) => {
        const status = (error as { status?: number })?.status
        if (status === 401 || status === 403 || status === 404) return false
        return failureCount < 2
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
})

function Devtools() {
  if (!env.enableDevtools) return null
  return null
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ThemeProvider>
            {children}
            <Devtools />
          </ThemeProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
