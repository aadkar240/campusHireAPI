import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { CheckCircle2, XCircle, Shield, ArrowLeft, Users, FileText, MessageSquare, TrendingUp, AlertCircle } from 'lucide-react'
import { Experience } from '../api/experiences'
import { adminAPI, UserProfile } from '../api/admin'
import { useAuthStore } from '../store/authStore'
import Chatbot from '../components/Chatbot'
import { motion } from 'framer-motion'

type TabType = 'experiences' | 'users'

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<TabType>('experiences')
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null)
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [experienceToReject, setExperienceToReject] = useState<number | null>(null)
  const [userToReject, setUserToReject] = useState<number | null>(null)
  const [isRejectingUser, setIsRejectingUser] = useState(false)
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { isAdmin } = useAuthStore()

  // Redirect if not admin - use useEffect to avoid render issues
  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login')
    }
  }, [isAdmin, navigate])

  if (!isAdmin) {
    return null
  }

  const { data: pendingExperiences = [], isLoading: experiencesLoading } = useQuery({
    queryKey: ['admin-pending-experiences'],
    queryFn: () => adminAPI.getPendingExperiences(),
  })

  const { data: allUsers = [], isLoading: usersLoading } = useQuery({
    queryKey: ['admin-all-users'],
    queryFn: () => adminAPI.getAllUsers(),
  })

  const approveMutation = useMutation({
    mutationFn: (id: number) => adminAPI.approveExperience(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pending-experiences'] })
      queryClient.invalidateQueries({ queryKey: ['experiences'] })
      toast.success('Experience approved and published!')
      setSelectedExperience(null)
    },
    onError: (error: any) => {
      // Safely extract error message
      let errorMessage = 'Failed to approve experience'
      if (error.message && typeof error.message === 'string') {
        errorMessage = error.message
      } else if (error.response?.data?._extractedMessage) {
        errorMessage = error.response.data._extractedMessage
      } else if (error.response?.data?.detail) {
        if (typeof error.response.data.detail === 'string') {
          errorMessage = error.response.data.detail
        } else if (Array.isArray(error.response.data.detail)) {
          errorMessage = error.response.data.detail.map((e: any) => 
            typeof e === 'string' ? e : e.msg || JSON.stringify(e)
          ).join('. ')
        }
      }
      toast.error(errorMessage)
    },
  })

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) =>
      adminAPI.rejectExperience(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pending-experiences'] })
      toast.success('Experience rejected')
      setShowRejectModal(false)
      setRejectReason('')
      setExperienceToReject(null)
      setSelectedExperience(null)
    },
    onError: (error: any) => {
      // Safely extract error message
      let errorMessage = 'Failed to reject experience'
      if (error.message && typeof error.message === 'string') {
        errorMessage = error.message
      } else if (error.response?.data?._extractedMessage) {
        errorMessage = error.response.data._extractedMessage
      } else if (error.response?.data?.detail) {
        if (typeof error.response.data.detail === 'string') {
          errorMessage = error.response.data.detail
        } else if (Array.isArray(error.response.data.detail)) {
          errorMessage = error.response.data.detail.map((e: any) => 
            typeof e === 'string' ? e : e.msg || JSON.stringify(e)
          ).join('. ')
        }
      }
      toast.error(errorMessage)
    },
  })

  const approveUserMutation = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) =>
      adminAPI.approveUserProfile(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-all-users'] })
      toast.success('User profile approved!')
      setSelectedUser(null)
    },
    onError: (error: any) => {
      // Safely extract error message
      let errorMessage = 'Failed to approve user profile'
      if (error.message && typeof error.message === 'string') {
        errorMessage = error.message
      } else if (error.response?.data?._extractedMessage) {
        errorMessage = error.response.data._extractedMessage
      } else if (error.response?.data?.detail) {
        if (typeof error.response.data.detail === 'string') {
          errorMessage = error.response.data.detail
        } else if (Array.isArray(error.response.data.detail)) {
          errorMessage = error.response.data.detail.map((e: any) => 
            typeof e === 'string' ? e : e.msg || JSON.stringify(e)
          ).join('. ')
        }
      }
      toast.error(errorMessage)
    },
  })

  const rejectUserMutation = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) =>
      adminAPI.rejectUserProfile(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-all-users'] })
      toast.success('User profile rejected')
      setShowRejectModal(false)
      setRejectReason('')
      setUserToReject(null)
      setIsRejectingUser(false)
      setSelectedUser(null)
    },
    onError: (error: any) => {
      // Safely extract error message
      let errorMessage = 'Failed to reject user profile'
      if (error.message && typeof error.message === 'string') {
        errorMessage = error.message
      } else if (error.response?.data?._extractedMessage) {
        errorMessage = error.response.data._extractedMessage
      } else if (error.response?.data?.detail) {
        if (typeof error.response.data.detail === 'string') {
          errorMessage = error.response.data.detail
        } else if (Array.isArray(error.response.data.detail)) {
          errorMessage = error.response.data.detail.map((e: any) => 
            typeof e === 'string' ? e : e.msg || JSON.stringify(e)
          ).join('. ')
        }
      }
      toast.error(errorMessage)
    },
  })

  const handleReject = (id: number) => {
    setExperienceToReject(id)
    setUserToReject(null)
    setIsRejectingUser(false)
    setShowRejectModal(true)
  }

  const handleRejectUser = (id: number) => {
    setUserToReject(id)
    setExperienceToReject(null)
    setIsRejectingUser(true)
    setShowRejectModal(true)
  }

  const confirmReject = () => {
    if (experienceToReject) {
      rejectMutation.mutate({ id: experienceToReject, reason: rejectReason || undefined })
    } else if (userToReject) {
      rejectUserMutation.mutate({ id: userToReject, reason: rejectReason || undefined })
    }
  }

  const getEligibilityColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 dark:text-green-400'
    if (percentage >= 60) return 'text-blue-600 dark:text-blue-400'
    if (percentage >= 40) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getEligibilityBgColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-100 dark:bg-green-900/20'
    if (percentage >= 60) return 'bg-blue-100 dark:bg-blue-900/20'
    if (percentage >= 40) return 'bg-yellow-100 dark:bg-yellow-900/20'
    return 'bg-red-100 dark:bg-red-900/20'
  }

  const isLoading = experiencesLoading || usersLoading

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <Shield className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Review and approve user profiles and experiences
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-secondary inline-flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => {
              setActiveTab('experiences')
              setSelectedExperience(null)
            }}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'experiences'
                ? 'text-primary-600 border-b-2 border-primary-600 dark:text-primary-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Experiences ({pendingExperiences.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('users')
              setSelectedUser(null)
            }}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'users'
                ? 'text-primary-600 border-b-2 border-primary-600 dark:text-primary-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            User Profiles ({allUsers.length})
          </button>
        </div>

        {/* Experiences Tab */}
        {activeTab === 'experiences' && (
          <>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : pendingExperiences.length === 0 ? (
              <div className="card text-center py-12">
                <CheckCircle2 className="w-16 h-16 mx-auto text-green-500 mb-4" />
                <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
                  No pending experiences
                </p>
                <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
                  All experiences have been reviewed
                </p>
              </div>
            ) : (
          <>
            <div className="card bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <p className="text-blue-800 dark:text-blue-200">
                <strong>{pendingExperiences.length}</strong> experience{pendingExperiences.length !== 1 ? 's' : ''} pending review
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {pendingExperiences.map((experience: Experience, idx: number) => (
                  <motion.div 
                    key={experience.id} 
                    className="card relative overflow-hidden group"
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                      delay: idx * 0.1,
                      type: "spring",
                      stiffness: 100
                    }}
                    whileHover={{ scale: 1.02, y: -5 }}
                  >
                    {/* Shimmer effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '200%' }}
                      transition={{ duration: 0.6 }}
                    />
                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div className="flex-1">
                        <motion.h3 
                          className="text-xl font-bold text-gray-900 dark:text-white"
                          whileHover={{ scale: 1.05 }}
                        >
                          {experience.company_name}
                        </motion.h3>
                        <p className="text-gray-600 dark:text-gray-400">{experience.role}</p>
                        {experience.user_name && (
                          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                            Submitted by: {experience.user_name}
                          </p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <motion.button
                          onClick={() => approveMutation.mutate(experience.id)}
                          disabled={approveMutation.isPending}
                          className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors disabled:opacity-50 relative z-10"
                          aria-label="Approve"
                          title="Approve"
                          whileHover={{ scale: 1.2, rotate: 360 }}
                          whileTap={{ scale: 0.9 }}
                          transition={{ duration: 0.3 }}
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          onClick={() => handleReject(experience.id)}
                          disabled={rejectMutation.isPending}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors disabled:opacity-50 relative z-10"
                          aria-label="Reject"
                          title="Reject"
                          whileHover={{ scale: 1.2, rotate: 360 }}
                          whileTap={{ scale: 0.9 }}
                          transition={{ duration: 0.3 }}
                        >
                          <XCircle className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Result: <strong className="text-gray-900 dark:text-white">{experience.final_result}</strong>
                      </p>
                      {experience.package_offered && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Package: <strong className="text-gray-900 dark:text-white">
                            ₹{(experience.package_offered / 100000).toFixed(1)}L
                          </strong>
                        </p>
                      )}
                    </div>
                    <motion.button
                      onClick={() => setSelectedExperience(experience)}
                      className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium relative z-10 inline-flex items-center gap-2"
                      whileHover={{ x: 5 }}
                    >
                      View Full Details
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        →
                      </motion.span>
                    </motion.button>
                  </motion.div>
                ))}
              </div>

              <div className="lg:col-span-1">
                {selectedExperience ? (
                  <div className="card sticky top-6">
                    <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                      Experience Details
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <strong className="text-gray-700 dark:text-gray-300">Company:</strong>
                        <p className="text-gray-900 dark:text-white">{selectedExperience.company_name}</p>
                      </div>
                      <div>
                        <strong className="text-gray-700 dark:text-gray-300">Role:</strong>
                        <p className="text-gray-900 dark:text-white">{selectedExperience.role}</p>
                      </div>
                      {selectedExperience.package_offered && (
                        <div>
                          <strong className="text-gray-700 dark:text-gray-300">Package:</strong>
                          <p className="text-gray-900 dark:text-white">
                            ₹{(selectedExperience.package_offered / 100000).toFixed(1)}L
                          </p>
                        </div>
                      )}
                      <div>
                        <strong className="text-gray-700 dark:text-gray-300">Result:</strong>
                        <span
                          className={`ml-2 px-2 py-1 rounded text-sm font-semibold ${
                            selectedExperience.final_result === 'Selected'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}
                        >
                          {selectedExperience.final_result}
                        </span>
                      </div>
                      {selectedExperience.preparation_strategy && (
                        <div>
                          <strong className="text-gray-700 dark:text-gray-300">Preparation Strategy:</strong>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {selectedExperience.preparation_strategy}
                          </p>
                        </div>
                      )}
                      {selectedExperience.questions_asked && (
                        <div>
                          <strong className="text-gray-700 dark:text-gray-300">Questions Asked:</strong>
                          <div className="mt-2 space-y-2">
                            {Object.entries(selectedExperience.questions_asked).map(([category, questions]) => (
                              <div key={category}>
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase">
                                  {category}:
                                </p>
                                <ul className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                                  {Array.isArray(questions) && questions.slice(0, 3).map((q: string, i: number) => (
                                    <li key={i}>• {q}</li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {selectedExperience.resources_followed && selectedExperience.resources_followed.length > 0 && (
                        <div>
                          <strong className="text-gray-700 dark:text-gray-300">Resources:</strong>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {selectedExperience.resources_followed.map((resource: string, idx: number) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded text-xs"
                              >
                                {resource}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {selectedExperience.interview_rounds && selectedExperience.interview_rounds.length > 0 && (
                        <div>
                          <strong className="text-gray-700 dark:text-gray-300">Interview Rounds:</strong>
                          <div className="mt-2 space-y-2">
                            {selectedExperience.interview_rounds.map((round: any, idx: number) => (
                              <div key={idx} className="p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm">
                                <strong className="text-gray-900 dark:text-white">Round {idx + 1}</strong>
                                {round.round_type && (
                                  <span className="text-gray-600 dark:text-gray-400 ml-2">- {round.round_type}</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => approveMutation.mutate(selectedExperience.id)}
                            disabled={approveMutation.isPending}
                            className="flex-1 btn-primary text-sm"
                          >
                            {approveMutation.isPending ? 'Approving...' : 'Approve'}
                          </button>
                          <button
                            onClick={() => handleReject(selectedExperience.id)}
                            disabled={rejectMutation.isPending}
                            className="flex-1 btn-secondary text-sm bg-red-600 hover:bg-red-700"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="card">
                    <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                      Click on an experience to view details
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
            )}
          </>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <>
            {usersLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : allUsers.length === 0 ? (
              <div className="card text-center py-12">
                <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
                  No users found
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-4">
                    {allUsers.map((userProfile: UserProfile) => (
                      <div key={userProfile.user.id} className="card">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                {userProfile.user.full_name}
                              </h3>
                              {userProfile.user.profile_completed && (
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                              )}
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">{userProfile.user.email}</p>
                            {userProfile.user.college_name && (
                              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                                {userProfile.user.college_name}
                                {userProfile.user.branch && ` - ${userProfile.user.branch}`}
                              </p>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => approveUserMutation.mutate({ id: userProfile.user.id })}
                              disabled={approveUserMutation.isPending}
                              className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors disabled:opacity-50"
                              aria-label="Approve"
                              title="Approve"
                            >
                              <CheckCircle2 className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleRejectUser(userProfile.user.id)}
                              disabled={rejectUserMutation.isPending}
                              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors disabled:opacity-50"
                              aria-label="Reject"
                              title="Reject"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          </div>
                        </div>

                        {/* Eligibility Score */}
                        <div className={`p-4 rounded-lg mb-4 ${getEligibilityBgColor(userProfile.eligibility.eligibility_percentage)}`}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <TrendingUp className="w-5 h-5" />
                              <span className="font-semibold text-gray-900 dark:text-white">
                                Eligibility Score
                              </span>
                            </div>
                            <span className={`text-2xl font-bold ${getEligibilityColor(userProfile.eligibility.eligibility_percentage)}`}>
                              {userProfile.eligibility.eligibility_percentage}%
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mb-3">
                            <span className={`px-2 py-1 rounded text-sm font-semibold ${getEligibilityBgColor(userProfile.eligibility.eligibility_percentage)} ${getEligibilityColor(userProfile.eligibility.eligibility_percentage)}`}>
                              {userProfile.eligibility.status}
                            </span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Recommendation: {userProfile.eligibility.recommendation}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                userProfile.eligibility.eligibility_percentage >= 80
                                  ? 'bg-green-500'
                                  : userProfile.eligibility.eligibility_percentage >= 60
                                  ? 'bg-blue-500'
                                  : userProfile.eligibility.eligibility_percentage >= 40
                                  ? 'bg-yellow-500'
                                  : 'bg-red-500'
                              }`}
                              style={{ width: `${userProfile.eligibility.eligibility_percentage}%` }}
                            />
                          </div>
                        </div>

                        {/* Strengths and Issues */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          {userProfile.eligibility.strengths.length > 0 && (
                            <div>
                              <p className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2">
                                Strengths ({userProfile.eligibility.strengths.length})
                              </p>
                              <ul className="space-y-1">
                                {userProfile.eligibility.strengths.slice(0, 3).map((strength, idx) => (
                                  <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                                    <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                    {strength}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {userProfile.eligibility.issues.length > 0 && (
                            <div>
                              <p className="text-sm font-semibold text-red-700 dark:text-red-400 mb-2">
                                Issues ({userProfile.eligibility.issues.length})
                              </p>
                              <ul className="space-y-1">
                                {userProfile.eligibility.issues.slice(0, 3).map((issue, idx) => (
                                  <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                                    <AlertCircle className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                                    {issue}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <span>Experiences: {userProfile.experience_count}</span>
                          <span>Approved: {userProfile.eligibility.approved_experience_count}</span>
                          <span>Profile: {userProfile.user.profile_completion_percentage}%</span>
                        </div>

                        <button
                          onClick={() => setSelectedUser(userProfile)}
                          className="mt-4 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium"
                        >
                          View Full Profile →
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="lg:col-span-1">
                    {selectedUser ? (
                      <div className="card sticky top-6">
                        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                          User Profile Details
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <strong className="text-gray-700 dark:text-gray-300">Name:</strong>
                            <p className="text-gray-900 dark:text-white">{selectedUser.user.full_name}</p>
                          </div>
                          <div>
                            <strong className="text-gray-700 dark:text-gray-300">Email:</strong>
                            <p className="text-gray-900 dark:text-white">{selectedUser.user.email}</p>
                          </div>
                          {selectedUser.user.college_name && (
                            <div>
                              <strong className="text-gray-700 dark:text-gray-300">College:</strong>
                              <p className="text-gray-900 dark:text-white">{selectedUser.user.college_name}</p>
                            </div>
                          )}
                          {selectedUser.user.branch && (
                            <div>
                              <strong className="text-gray-700 dark:text-gray-300">Branch:</strong>
                              <p className="text-gray-900 dark:text-white">{selectedUser.user.branch}</p>
                            </div>
                          )}
                          {selectedUser.user.linkedin_id && (
                            <div>
                              <strong className="text-gray-700 dark:text-gray-300">LinkedIn:</strong>
                              <p className="text-gray-900 dark:text-white">{selectedUser.user.linkedin_id}</p>
                            </div>
                          )}
                          {selectedUser.user.github_id && (
                            <div>
                              <strong className="text-gray-700 dark:text-gray-300">GitHub:</strong>
                              <p className="text-gray-900 dark:text-white">{selectedUser.user.github_id}</p>
                            </div>
                          )}
                          <div>
                            <strong className="text-gray-700 dark:text-gray-300">Eligibility:</strong>
                            <div className={`mt-2 p-3 rounded ${getEligibilityBgColor(selectedUser.eligibility.eligibility_percentage)}`}>
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-semibold">{selectedUser.eligibility.status}</span>
                                <span className={`text-lg font-bold ${getEligibilityColor(selectedUser.eligibility.eligibility_percentage)}`}>
                                  {selectedUser.eligibility.eligibility_percentage}%
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Score: {selectedUser.eligibility.score}/{selectedUser.eligibility.max_score}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Recommendation: <strong>{selectedUser.eligibility.recommendation}</strong>
                              </p>
                            </div>
                          </div>
                          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => approveUserMutation.mutate({ id: selectedUser.user.id })}
                                disabled={approveUserMutation.isPending}
                                className="flex-1 btn-primary text-sm"
                              >
                                {approveUserMutation.isPending ? 'Approving...' : 'Approve'}
                              </button>
                              <button
                                onClick={() => handleRejectUser(selectedUser.user.id)}
                                disabled={rejectUserMutation.isPending}
                                className="flex-1 btn-secondary text-sm bg-red-600 hover:bg-red-700"
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="card">
                        <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                          Click on a user profile to view details
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* Reject Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                {isRejectingUser ? 'Reject User Profile' : 'Reject Experience'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Please provide a reason for rejection (optional):
              </p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="input-field w-full h-24 mb-4"
                placeholder="Reason for rejection..."
              />
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowRejectModal(false)
                    setRejectReason('')
                    setExperienceToReject(null)
                  }}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmReject}
                  disabled={isRejectingUser ? rejectUserMutation.isPending : rejectMutation.isPending}
                  className="flex-1 btn-primary bg-red-600 hover:bg-red-700"
                >
                  {isRejectingUser
                    ? rejectUserMutation.isPending
                      ? 'Rejecting...'
                      : 'Confirm Reject'
                    : rejectMutation.isPending
                    ? 'Rejecting...'
                    : 'Confirm Reject'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Admin Chatbot */}
        <div className="fixed bottom-6 right-6 z-40">
          <Chatbot />
        </div>
      </div>
  )
}
