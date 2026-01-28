import { useQuery } from '@tanstack/react-query'
import { experiencesAPI } from '../api/experiences'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Building2, Search, CheckCircle2, Briefcase, Users, Code, GraduationCap, UserCog, BarChart3 } from 'lucide-react'
import Chatbot from '../components/Chatbot'
import CompanyCard from '../components/CompanyCard'
import { useAuthStore } from '../store/authStore'
import { motion } from 'framer-motion'

export default function Dashboard() {
  console.log('Dashboard component rendering...')
  
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRole, setFilterRole] = useState('')
  const { user } = useAuthStore()
  const [showWelcome, setShowWelcome] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  
  console.log('Dashboard state:', { user, searchQuery, filterRole })

  // Show welcome message on first visit after signup
  useEffect(() => {
    const hasSeenWelcome = sessionStorage.getItem('hasSeenWelcome')
    if (!hasSeenWelcome && user?.full_name) {
      setShowWelcome(true)
      sessionStorage.setItem('hasSeenWelcome', 'true')
      // Hide welcome after 5 seconds
      setTimeout(() => setShowWelcome(false), 5000)
    }
  }, [user])

  const { data: experiences, isLoading, error } = useQuery({
    queryKey: ['experiences', searchQuery, filterRole],
    queryFn: async () => {
      try {
        return await experiencesAPI.getAll(searchQuery || undefined, filterRole || undefined)
      } catch (err: any) {
        console.error('Failed to load experiences:', err)
        setHasError(true)
        // Safely extract error message - handle both Error objects and API error responses
        let message = 'Failed to load experiences'
        if (err instanceof Error) {
          message = typeof err.message === 'string' ? err.message : String(err.message)
        } else if (err?.message) {
          message = typeof err.message === 'string' ? err.message : String(err.message)
        } else if (err?.response?.data?._extractedMessage) {
          message = err.response.data._extractedMessage
        } else if (err?.response?.data?.detail) {
          if (typeof err.response.data.detail === 'string') {
            message = err.response.data.detail
          } else if (Array.isArray(err.response.data.detail)) {
            message = err.response.data.detail.map((e: any) => 
              typeof e === 'string' ? e : e.msg || JSON.stringify(e)
            ).join('. ')
          }
        }
        
        // Check if backend is actually running for network errors
        if (message.includes('Network') || message.includes('Failed to fetch') || !err?.response) {
          try {
            const healthCheck = await fetch('http://localhost:8000/health', { cache: 'no-cache' })
            if (healthCheck.ok) {
              message = 'Connection issue. Please refresh the page (Ctrl + Shift + R)'
            } else {
              message = 'Unable to connect to server. Please check if the backend is running.'
            }
          } catch {
            message = 'Unable to connect to server. Please check if the backend is running.'
          }
        }
        
        setErrorMessage(message)
        throw err
      }
    },
    retry: 2,
    retryDelay: 1000,
    onError: (err: any) => {
      console.error('Failed to load experiences:', err)
      setHasError(true)
      // Safely extract error message
      let message = 'Failed to load experiences'
      if (err instanceof Error) {
        message = typeof err.message === 'string' ? err.message : String(err.message)
      } else if (err?.message) {
        message = typeof err.message === 'string' ? err.message : String(err.message)
      } else if (err?.response?.data?._extractedMessage) {
        message = err.response.data._extractedMessage
      } else if (err?.response?.data?.detail) {
        if (typeof err.response.data.detail === 'string') {
          message = err.response.data.detail
        } else if (Array.isArray(err.response.data.detail)) {
          message = err.response.data.detail.map((e: any) => 
            typeof e === 'string' ? e : e.msg || JSON.stringify(e)
          ).join('. ')
        }
      }
      
      // Check if backend is actually running for network errors
      if (message.includes('Network') || message.includes('Failed to fetch') || !err?.response) {
        fetch('http://localhost:8000/health', { cache: 'no-cache' })
          .then(res => {
            if (res.ok) {
              setErrorMessage('Connection issue. Please refresh the page (Ctrl + Shift + R)')
            } else {
              setErrorMessage('Unable to connect to server. Please check if the backend is running.')
            }
          })
          .catch(() => {
            setErrorMessage('Unable to connect to server. Please check if the backend is running.')
          })
      } else {
        setErrorMessage(message)
      }
    },
  })

  // Major tech companies to prioritize
  const majorCompanies = ['Amazon', 'Google', 'Microsoft', 'IBM', 'Oracle', 'Accenture', 'Apple']
  
  // Get unique companies - with error handling
  let allCompanies: any[] = []
  try {
    allCompanies = (experiences && Array.isArray(experiences) ? Array.from(
      new Set(experiences.map((exp) => exp.company_name))
    ) : []).map((companyName) => {
    const companyExperiences = (experiences || []).filter(
      (exp) => exp.company_name === companyName && exp.is_published
    )
    return {
      name: companyName,
      experienceCount: companyExperiences.length,
      selectionRate: companyExperiences.length > 0
        ? (companyExperiences.filter((e) => e.final_result === 'Selected').length /
            companyExperiences.length) *
          100
        : 0,
      avgPackage: (() => {
        const experiencesWithPackage = companyExperiences.filter((e) => e.package_offered)
        if (experiencesWithPackage.length === 0) return 0
        return experiencesWithPackage.reduce((acc, e) => acc + (e.package_offered || 0), 0) / experiencesWithPackage.length
      })(),
      isMajor: majorCompanies.some(mc => companyName.toLowerCase().includes(mc.toLowerCase())),
    }
    })
  } catch (err) {
    console.error('Error processing companies:', err)
    allCompanies = []
  }

  // Sort: major companies first, then by experience count
  let companies: any[] = []
  try {
    companies = allCompanies.sort((a, b) => {
      if (a.isMajor && !b.isMajor) return -1
      if (!a.isMajor && b.isMajor) return 1
      return b.experienceCount - a.experienceCount
    })
  } catch (err) {
    console.error('Error sorting companies:', err)
    companies = allCompanies
  }

  // Show error if there's a critical error
  if (hasError && errorMessage) {
    return (
      <div className="space-y-6">
        <div className="card bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">
            Error Loading Dashboard
          </h2>
          <p className="text-red-500 dark:text-red-500 mb-4">{errorMessage}</p>
          <button
            onClick={() => {
              setHasError(false)
              setErrorMessage(null)
              window.location.reload()
            }}
            className="btn-primary"
          >
            Reload Page
          </button>
        </div>
      </div>
    )
  }

  console.log('Dashboard render state:', { experiences, isLoading, error, companies: companies.length })
  
  // Safety check
  if (!experiences && !isLoading && !error) {
    console.log('Showing loading state...')
    return (
      <div className="space-y-6">
        <div className="card">
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  console.log('Rendering main dashboard content...')
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      {showWelcome && user?.full_name && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="card bg-gradient-to-r from-primary-500 to-primary-600 text-white"
        >
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-bold">
                Welcome, {user.full_name}! 👋
              </h2>
              <p className="text-primary-100 text-sm mt-1">
                Your account has been created successfully. Start exploring interview experiences!
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="hidden sm:block"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
          </motion.div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {user?.full_name ? `Welcome back, ${user.full_name}!` : 'Company Experiences'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {filterRole 
                ? `Explore ${filterRole} interview experiences shared by students`
                : 'Explore interview experiences shared by students'}
            </p>
          </div>
        </div>
        <Link
          to="/experience/new"
          className="btn-primary inline-flex items-center"
        >
          <span className="mr-2">+</span> Share Experience
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <div className="relative sm:w-56">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="input-field pl-10 appearance-none"
          >
            <option value="">All Roles</option>
            <option value="SDE">Software Development Engineer (SDE)</option>
            <option value="Analyst">Data Analyst</option>
            <option value="Intern">Intern</option>
            <option value="Manager">Manager</option>
            <option value="HR">HR / Human Resources</option>
            <option value="Product Manager">Product Manager</option>
            <option value="QA">QA / Quality Assurance</option>
            <option value="DevOps">DevOps Engineer</option>
            <option value="Designer">UI/UX Designer</option>
            <option value="Marketing">Marketing</option>
          </select>
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            {filterRole === 'SDE' && <Code className="w-5 h-5 text-gray-400" />}
            {filterRole === 'Analyst' && <BarChart3 className="w-5 h-5 text-gray-400" />}
            {filterRole === 'Manager' && <UserCog className="w-5 h-5 text-gray-400" />}
            {filterRole === 'HR' && <Users className="w-5 h-5 text-gray-400" />}
            {filterRole === 'Intern' && <GraduationCap className="w-5 h-5 text-gray-400" />}
            {!filterRole && <Briefcase className="w-5 h-5 text-gray-400" />}
          </div>
        </div>
      </div>

      {error ? (
        <div className="card text-center py-12 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <p className="text-red-600 dark:text-red-400 font-medium mb-2">
            Failed to load experiences
          </p>
          <p className="text-sm text-red-500 dark:text-red-500">
            {(() => {
              // Safely extract error message
              if (error instanceof Error) {
                return typeof error.message === 'string' ? error.message : String(error.message)
              }
              if ((error as any)?.message) {
                const msg = (error as any).message
                return typeof msg === 'string' ? msg : String(msg)
              }
              if ((error as any)?.response?.data?._extractedMessage) {
                return (error as any).response.data._extractedMessage
              }
              return 'Please check your connection and try again.'
            })()}
          </p>
        </div>
      ) : isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : companies.length === 0 ? (
        <div className="card text-center py-12">
          <Building2 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            No companies found. Be the first to share an experience!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company, idx) => (
            <CompanyCard key={company.name} company={company} index={idx} />
          ))}
        </div>
      )}

      <Chatbot selectedRole={filterRole || undefined} />
    </div>
  )
}
