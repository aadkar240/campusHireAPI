import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import App from './App'
import ErrorBoundary from './components/ErrorBoundary'
import './index.css'

// Helper to safely extract error messages
function safeErrorToString(error: any): string {
  if (typeof error === 'string') return error
  if (error instanceof Error) {
    if (typeof error.message === 'string') return error.message
    if (error.message) return String(error.message)
  }
  if (error?.message) {
    const msg = error.message
    if (typeof msg === 'string') return msg
    if (typeof msg === 'object') {
      // Handle FastAPI validation errors
      if (Array.isArray(msg)) {
        return msg.map((e: any) => 
          typeof e === 'string' ? e : e.msg || JSON.stringify(e)
        ).join('. ')
      }
      return JSON.stringify(msg)
    }
    return String(msg)
  }
  if (error?.response?.data?._extractedMessage) {
    return error.response.data._extractedMessage
  }
  if (error?.response?.data?.detail) {
    const detail = error.response.data.detail
    if (typeof detail === 'string') return detail
    if (Array.isArray(detail)) {
      return detail.map((e: any) => 
        typeof e === 'string' ? e : e.msg || JSON.stringify(e)
      ).join('. ')
    }
  }
  return 'An unexpected error occurred'
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      // Ensure all query errors are properly handled
      onError: (error) => {
        console.error('Query error:', error)
        // Convert error to string to prevent rendering issues
        const errorMessage = safeErrorToString(error)
        if (errorMessage !== 'An unexpected error occurred') {
          console.error('Error message:', errorMessage)
        }
      },
    },
    mutations: {
      // Ensure all mutation errors are properly handled
      onError: (error) => {
        console.error('Mutation error:', error)
        const errorMessage = safeErrorToString(error)
        if (errorMessage !== 'An unexpected error occurred') {
          console.error('Error message:', errorMessage)
        }
      },
    },
  },
})

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element not found')
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster position="top-right" />
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
