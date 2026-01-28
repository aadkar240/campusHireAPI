import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

// Helper function to extract error message from FastAPI error response
function extractErrorMessage(error: any): string {
  if (!error.response) {
    return error.message || 'An unexpected error occurred'
  }

  const { data } = error.response
  
  // Handle FastAPI validation errors (422) - detail is an array of error objects
  if (error.response.status === 422 && Array.isArray(data?.detail)) {
    const messages = data.detail.map((err: any) => {
      if (typeof err === 'string') return err
      if (err.msg) return err.msg
      if (err.message) return err.message
      return JSON.stringify(err)
    })
    return messages.join('. ') || 'Validation error'
  }
  
  // Handle standard error with detail string
  if (data?.detail) {
    if (typeof data.detail === 'string') {
      return data.detail
    }
    if (Array.isArray(data.detail)) {
      return data.detail.map((err: any) => 
        typeof err === 'string' ? err : err.msg || JSON.stringify(err)
      ).join('. ')
    }
    // If detail is an object, try to extract message
    if (data.detail.msg) return data.detail.msg
    if (data.detail.message) return data.detail.message
  }
  
  // Fallback to status text or generic message
  return error.response.statusText || `Error ${error.response.status}` || 'An unexpected error occurred'
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
})

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors (backend not reachable)
    if (!error.response) {
      console.error('Network error details:', {
        message: error.message,
        code: error.code,
        config: {
          url: error.config?.url,
          baseURL: error.config?.baseURL,
          method: error.config?.method
        }
      })
      
      // Check if backend is actually reachable before showing error
      const checkBackend = async () => {
        try {
          const healthCheck = await fetch('http://localhost:8000/health', {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            signal: AbortSignal.timeout(3000) // 3 second timeout
          })
          if (healthCheck.ok) {
            console.warn('Backend is running, but API request failed. This might be a CORS or network issue. Try refreshing the page (Ctrl + Shift + R).')
            error.message = 'Backend is running but request failed. Please refresh the page (Ctrl + Shift + R) or check browser console for details.'
            return
          }
        } catch (healthError) {
          // Backend health check also failed
          console.error('Backend health check failed:', healthError)
        }
        // If we get here, backend is not reachable
        error.message = 'Cannot connect to server. Please make sure the backend is running at http://localhost:8000. Run START_BACKEND.bat or use: cd backend && python -m uvicorn main:app --reload'
      }
      
      // Only show connection error if backend is actually not reachable
      if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error') || error.message.includes('Failed to fetch') || error.message.includes('ERR_CONNECTION_REFUSED')) {
        checkBackend()
      }
    }
    
    // Extract and set a proper error message for API errors
    if (error.response) {
      const extractedMessage = extractErrorMessage(error)
      // Create a new Error with the extracted message to ensure it's always a string
      const newError = new Error(extractedMessage)
      // Preserve original error properties for debugging
      ;(newError as any).originalError = error
      ;(newError as any).response = error.response
      ;(newError as any).config = error.config
      // Also set it in response.data for easy access
      if (error.response.data) {
        error.response.data._extractedMessage = extractedMessage
      }
      
      if (error.response.status === 401) {
        useAuthStore.getState().logout()
        window.location.href = '/auth'
      }
      
      return Promise.reject(newError)
    }
    
    return Promise.reject(error)
  }
)
