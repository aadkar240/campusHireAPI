import { useState } from 'react'
import React from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { experiencesAPI, ExperienceCreateRequest } from '../api/experiences'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, Plus, X } from 'lucide-react'

const STEPS = ['Company & Role', 'Interview Details', 'Questions & Strategy', 'Result & Review']

export default function ExperienceForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<ExperienceCreateRequest>({
    company_name: '',
    role: '',
    package_offered: undefined,
    interview_rounds: [],
    questions_asked: {
      DSA: [],
      Technical: [],
      HR: [],
      Managerial: [],
    },
    preparation_strategy: '',
    resources_followed: [],
    rejection_reasons: '',
    final_result: 'Selected',
    is_anonymous: false,
  })
  const [newResource, setNewResource] = useState('')
  const [newRound, setNewRound] = useState({
    round_type: '',
    questions: [] as string[],
    difficulty: '',
  })
  const [newQuestion, setNewQuestion] = useState({ category: 'DSA', question: '' })

  const { data: existingExperience } = useQuery({
    queryKey: ['experience', id],
    queryFn: () => experiencesAPI.getById(Number(id)),
    enabled: !!id,
  })

  // Update form data when experience is loaded
  React.useEffect(() => {
    if (existingExperience) {
      setFormData({
        company_name: existingExperience.company_name,
        role: existingExperience.role,
        package_offered: existingExperience.package_offered,
        interview_rounds: existingExperience.interview_rounds || [],
        questions_asked: existingExperience.questions_asked || {
          DSA: [],
          Technical: [],
          HR: [],
          Managerial: [],
        },
        preparation_strategy: existingExperience.preparation_strategy || '',
        resources_followed: existingExperience.resources_followed || [],
        rejection_reasons: existingExperience.rejection_reasons || '',
        final_result: existingExperience.final_result,
        is_anonymous: existingExperience.is_anonymous,
      })
    }
  }, [existingExperience])

  const createMutation = useMutation({
    mutationFn: experiencesAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] })
      toast.success('Experience submitted successfully!')
      navigate('/dashboard')
    },
    onError: () => {
      toast.error('Failed to submit experience')
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: Partial<ExperienceCreateRequest>) =>
      experiencesAPI.update(Number(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] })
      toast.success('Experience updated successfully!')
      navigate('/dashboard')
    },
    onError: () => {
      toast.error('Failed to update experience')
    },
  })

  const handleSubmit = () => {
    if (id) {
      updateMutation.mutate(formData)
    } else {
      createMutation.mutate(formData)
    }
  }

  const addResource = () => {
    if (newResource.trim()) {
      setFormData({
        ...formData,
        resources_followed: [...(formData.resources_followed || []), newResource.trim()],
      })
      setNewResource('')
    }
  }

  const removeResource = (index: number) => {
    setFormData({
      ...formData,
      resources_followed: formData.resources_followed?.filter((_, i) => i !== index) || [],
    })
  }

  const addRound = () => {
    if (newRound.round_type) {
      const roundNumber = (formData.interview_rounds?.length || 0) + 1
      setFormData({
        ...formData,
        interview_rounds: [...(formData.interview_rounds || []), { 
          round_name: `Round ${roundNumber}`,
          ...newRound 
        }],
      })
      setNewRound({ round_type: '', questions: [], difficulty: '' })
    }
  }

  const addQuestion = () => {
    if (newQuestion.question.trim()) {
      const category = newQuestion.category as keyof typeof formData.questions_asked
      setFormData({
        ...formData,
        questions_asked: {
          ...formData.questions_asked,
          [category]: [
            ...(formData.questions_asked?.[category] || []),
            newQuestion.question.trim(),
          ],
        },
      })
      setNewQuestion({ category: 'DSA', question: '' })
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        {id ? 'Edit Experience' : 'Share Interview Experience'}
      </h1>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => (
            <div key={index} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    index <= currentStep
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {index + 1}
                </div>
                <span className="mt-2 text-sm text-center text-gray-600 dark:text-gray-400">
                  {step}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`h-1 flex-1 mx-2 ${
                    index < currentStep ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Steps */}
      <div className="card">
        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold">Company & Role Information</h2>
              <div>
                <label className="block text-sm font-medium mb-2">Company Name *</label>
                <input
                  type="text"
                  required
                  value={formData.company_name}
                  onChange={(e) =>
                    setFormData({ ...formData, company_name: e.target.value })
                  }
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Role *</label>
                <input
                  type="text"
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Package Offered (LPA)</label>
                <input
                  type="number"
                  value={formData.package_offered || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      package_offered: e.target.value ? parseFloat(e.target.value) : undefined,
                    })
                  }
                  className="input-field"
                  placeholder="e.g., 12.5"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={formData.is_anonymous}
                  onChange={(e) =>
                    setFormData({ ...formData, is_anonymous: e.target.checked })
                  }
                  className="w-4 h-4 text-primary-600"
                />
                <label htmlFor="anonymous" className="ml-2 text-sm">
                  Submit anonymously
                </label>
              </div>
            </motion.div>
          )}

          {currentStep === 1 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold">Interview Rounds</h2>
              <div className="space-y-4">
                <div>
                  <select
                    value={newRound.round_type}
                    onChange={(e) =>
                      setNewRound({ ...newRound, round_type: e.target.value })
                    }
                    className="input-field"
                  >
                    <option value="">Select Type</option>
                    <option value="Technical">Technical</option>
                    <option value="HR">HR</option>
                    <option value="Managerial">Managerial</option>
                    <option value="DSA">DSA</option>
                  </select>
                </div>
                <button type="button" onClick={addRound} className="btn-secondary">
                  <Plus className="w-4 h-4 inline mr-2" />
                  Add Round
                </button>
                {formData.interview_rounds?.map((round, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex justify-between">
                      <div>
                        <strong>Round {idx + 1}</strong> - {round.round_type}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            interview_rounds: formData.interview_rounds?.filter(
                              (_, i) => i !== idx
                            ),
                          })
                        }}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold">Questions & Preparation</h2>
              <div>
                <label className="block text-sm font-medium mb-2">Add Question</label>
                <div className="flex gap-2">
                  <select
                    value={newQuestion.category}
                    onChange={(e) =>
                      setNewQuestion({ ...newQuestion, category: e.target.value })
                    }
                    className="input-field w-32"
                  >
                    <option value="DSA">DSA</option>
                    <option value="Technical">Technical</option>
                    <option value="HR">HR</option>
                    <option value="Managerial">Managerial</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Enter question"
                    value={newQuestion.question}
                    onChange={(e) =>
                      setNewQuestion({ ...newQuestion, question: e.target.value })
                    }
                    className="input-field flex-1"
                  />
                  <button type="button" onClick={addQuestion} className="btn-secondary">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Preparation Strategy</label>
                <textarea
                  value={formData.preparation_strategy}
                  onChange={(e) =>
                    setFormData({ ...formData, preparation_strategy: e.target.value })
                  }
                  className="input-field h-32"
                  placeholder="Describe your preparation strategy..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Resources Followed</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="e.g., LeetCode, GeeksforGeeks"
                    value={newResource}
                    onChange={(e) => setNewResource(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addResource())}
                    className="input-field flex-1"
                  />
                  <button type="button" onClick={addResource} className="btn-secondary">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.resources_followed?.map((resource, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full text-sm"
                    >
                      {resource}
                      <button
                        type="button"
                        onClick={() => removeResource(idx)}
                        className="ml-2 hover:text-primary-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold">Final Result</h2>
              <div>
                <label className="block text-sm font-medium mb-2">Result *</label>
                <select
                  value={formData.final_result}
                  onChange={(e) =>
                    setFormData({ ...formData, final_result: e.target.value as 'Selected' | 'Rejected' })
                  }
                  className="input-field"
                >
                  <option value="Selected">Selected</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              {formData.final_result === 'Rejected' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Rejection Reasons</label>
                  <textarea
                    value={formData.rejection_reasons}
                    onChange={(e) =>
                      setFormData({ ...formData, rejection_reasons: e.target.value })
                    }
                    className="input-field h-32"
                    placeholder="If rejected, please share reasons..."
                  />
                </div>
              )}
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-semibold mb-2">Review Your Submission</h3>
                <p>
                  <strong>Company:</strong> {formData.company_name}
                </p>
                <p>
                  <strong>Role:</strong> {formData.role}
                </p>
                <p>
                  <strong>Result:</strong> {formData.final_result}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4 inline mr-2" />
            Previous
          </button>
          {currentStep < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(Math.min(STEPS.length - 1, currentStep + 1))}
              className="btn-primary"
            >
              Next
              <ChevronRight className="w-4 h-4 inline ml-2" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={createMutation.isPending || updateMutation.isPending}
              className="btn-primary"
            >
              {createMutation.isPending || updateMutation.isPending
                ? 'Submitting...'
                : 'Submit Experience'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
