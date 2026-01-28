import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersAPI } from '../api/users'
import { useAuthStore } from '../store/authStore'
import { useState } from 'react'
import React from 'react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { User, Linkedin, Github, GraduationCap, CheckCircle2 } from 'lucide-react'

export default function ProfilePage() {
  const { updateUser } = useAuthStore()
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    full_name: '',
    linkedin_id: '',
    github_id: '',
    college_name: '',
    branch: '',
  })
  const [hasChanges, setHasChanges] = useState(false)

  const { data: user, isLoading } = useQuery({
    queryKey: ['user-profile'],
    queryFn: usersAPI.getMe,
  })

  // Update form data when user is loaded
  React.useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        linkedin_id: user.linkedin_id || '',
        github_id: user.github_id || '',
        college_name: user.college_name || '',
        branch: user.branch || '',
      })
      setHasChanges(false)
    }
  }, [user])

  // Track changes
  React.useEffect(() => {
    if (user) {
      const changed = 
        formData.full_name !== (user.full_name || '') ||
        formData.linkedin_id !== (user.linkedin_id || '') ||
        formData.github_id !== (user.github_id || '') ||
        formData.college_name !== (user.college_name || '') ||
        formData.branch !== (user.branch || '')
      setHasChanges(changed)
    }
  }, [formData, user])

  const { data: completion } = useQuery({
    queryKey: ['profile-completion'],
    queryFn: usersAPI.getProfileCompletion,
  })

  const updateMutation = useMutation({
    mutationFn: usersAPI.updateProfile,
    onSuccess: (data) => {
      updateUser(data)
      queryClient.invalidateQueries({ queryKey: ['user-profile'] })
      queryClient.invalidateQueries({ queryKey: ['profile-completion'] })
      setHasChanges(false)
      toast.success('Profile updated successfully!')
    },
    onError: () => {
      toast.error('Failed to update profile')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateMutation.mutate(formData)
  }

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>
  }

  const completionPercentage = completion?.percentage || 0

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Profile</h1>
        {hasChanges && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400"
          >
            <span>You have unsaved changes</span>
          </motion.div>
        )}
      </div>

      {/* Profile Completion Bar */}
      <motion.div 
        className="card relative overflow-hidden group"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        whileHover={{ scale: 1.02, y: -5 }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-transparent opacity-0 group-hover:opacity-100"
          transition={{ duration: 0.3 }}
        />
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Profile Completion
          </span>
          <span className="text-sm font-semibold text-primary-600">
            {completionPercentage}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 0.5 }}
            className="bg-primary-600 h-3 rounded-full"
          />
        </div>
        {completionPercentage < 100 && (
          <motion.p 
            className="text-sm text-gray-500 dark:text-gray-400 mt-2 relative z-10"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Complete your profile to unlock all features
          </motion.p>
        )}
      </motion.div>

      {/* Profile Form */}
      <motion.form 
        onSubmit={handleSubmit} 
        className="card space-y-6 relative overflow-hidden group"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
        whileHover={{ scale: 1.01 }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100"
          transition={{ duration: 0.3 }}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <User className="w-4 h-4 inline mr-2" />
            Full Name *
          </label>
          <input
            type="text"
            required
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            className="input-field"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Linkedin className="w-4 h-4 inline mr-2" />
            LinkedIn ID
          </label>
          <input
            type="text"
            value={formData.linkedin_id}
            onChange={(e) => setFormData({ ...formData, linkedin_id: e.target.value })}
            className="input-field"
            placeholder="your-linkedin-id"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Github className="w-4 h-4 inline mr-2" />
            GitHub ID
          </label>
          <input
            type="text"
            value={formData.github_id}
            onChange={(e) => setFormData({ ...formData, github_id: e.target.value })}
            className="input-field"
            placeholder="your-github-id"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <GraduationCap className="w-4 h-4 inline mr-2" />
            College Name
          </label>
          <input
            type="text"
            value={formData.college_name}
            onChange={(e) => setFormData({ ...formData, college_name: e.target.value })}
            className="input-field"
            placeholder="Your college name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <GraduationCap className="w-4 h-4 inline mr-2" />
            Branch
          </label>
          <input
            type="text"
            value={formData.branch}
            onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
            className="input-field"
            placeholder="Your branch (e.g., Computer Science, Electrical Engineering)"
          />
        </div>

        {hasChanges && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700"
          >
            <button 
              type="submit" 
              className="btn-primary flex-1" 
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? (
                <span className="flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                  />
                  Saving...
                </span>
              ) : (
                'Save Changes'
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                if (user) {
                setFormData({
                    full_name: user.full_name || '',
                    linkedin_id: user.linkedin_id || '',
                    github_id: user.github_id || '',
                    college_name: user.college_name || '',
                    branch: user.branch || '',
                })
                  setHasChanges(false)
                }
              }}
              className="btn-secondary"
              disabled={updateMutation.isPending}
            >
              Cancel
            </button>
          </motion.div>
        )}
      </motion.form>

      {completionPercentage === 100 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02, y: -5 }}
          className="card bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 relative overflow-hidden group"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent opacity-0 group-hover:opacity-100"
            transition={{ duration: 0.3 }}
          />
          <div className="flex items-center space-x-3 relative z-10">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
            <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
            </motion.div>
            <div>
              <h3 className="font-semibold text-green-900 dark:text-green-100">
                Profile Complete!
              </h3>
              <p className="text-sm text-green-700 dark:text-green-300">
                Your profile is 100% complete. You can now access all features.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
