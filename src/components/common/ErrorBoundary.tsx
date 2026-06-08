import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error('[ErrorBoundary]', error, info.componentStack)
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center px-6 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20">
            <AlertTriangle className="h-7 w-7 text-red-600" />
          </div>
          <h2 className="text-lg font-semibold">Something went wrong</h2>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            An unexpected error occurred. Please refresh the page or try again later.
          </p>
          {import.meta.env.DEV && this.state.error && (
            <pre className="mt-4 max-w-lg overflow-auto rounded-lg bg-muted p-3 text-left text-xs text-muted-foreground">
              {this.state.error.message}
            </pre>
          )}
          <Button className="mt-6 gap-2" onClick={this.handleReset}>
            <RefreshCw className="h-4 w-4" />
            Refresh Page
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
