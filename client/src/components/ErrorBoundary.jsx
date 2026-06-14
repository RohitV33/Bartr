import { Component } from 'react'
import { WarningCircle, ArrowCounterClockwise } from '@phosphor-icons/react'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-bartr-bg flex flex-col items-center justify-center p-6 text-center font-jakarta">
          <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-3xl flex items-center justify-center mb-6">
            <WarningCircle className="w-10 h-10" weight="duotone" />
          </div>
          <h1 className="text-3xl font-bold font-syne text-bartr-text mb-3">Something went wrong</h1>
          <p className="text-bartr-muted text-sm max-w-md mb-8">
            An unexpected error occurred in the application. Our team has been notified.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 bg-bartr-text text-bartr-bg px-6 py-3 rounded-xl font-bold hover:bg-bartr-text/90 transition-all shadow-[4px_4px_0px_var(--border)] active:translate-y-[2px] active:shadow-none"
          >
            <ArrowCounterClockwise className="w-5 h-5" weight="bold" />
            Reload Page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
