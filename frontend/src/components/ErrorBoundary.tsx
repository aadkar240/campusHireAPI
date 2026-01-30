import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: any): State {
    // Ensure we always store a proper Error object
    let errorToStore: Error
    
    if (error instanceof Error) {
      // If it's already an Error, ensure message is a string
      if (typeof error.message !== 'string') {
        const newError = new Error(String(error.message || 'An unexpected error occurred'))
        newError.stack = error.stack
        errorToStore = newError
      } else {
        errorToStore = error
      }
    } else {
      // If it's not an Error, create one with a safe message
      const message = typeof error === 'string' 
        ? error 
        : error?.message 
          ? (typeof error.message === 'string' ? error.message : JSON.stringify(error.message))
          : JSON.stringify(error)
      errorToStore = new Error(message)
    }
    
    return { hasError: true, error: errorToStore }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      // Safely extract error message - ensure it's always a string
      let errorMessage = 'An unexpected error occurred'
      if (this.state.error) {
        if (typeof this.state.error.message === 'string') {
          errorMessage = this.state.error.message
        } else if (this.state.error.message) {
          // If message is an object, stringify it safely
          try {
            errorMessage = JSON.stringify(this.state.error.message)
          } catch {
            errorMessage = String(this.state.error.message)
          }
        }
      }

      // Safely extract stack trace
      let stackTrace = ''
      if (this.state.error?.stack) {
        stackTrace = typeof this.state.error.stack === 'string' 
          ? this.state.error.stack 
          : JSON.stringify(this.state.error.stack, null, 2)
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
          <div className="max-w-md w-full card">
            <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
              Something went wrong
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {errorMessage}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null })
                window.location.reload()
              }}
              className="btn-primary"
            >
              Reload Page
            </button>
            {stackTrace && (
              <details className="mt-4">
                <summary className="cursor-pointer text-sm text-gray-500">Error Details</summary>
                <pre className="mt-2 text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto">
                  {stackTrace}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
