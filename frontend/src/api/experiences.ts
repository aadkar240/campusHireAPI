import { apiClient } from './client'

export interface Experience {
  id: number
  company_name: string
  role: string
  package_offered?: number
  interview_rounds?: any[]
  questions_asked?: Record<string, string[]>
  preparation_strategy?: string
  resources_followed?: string[]
  rejection_reasons?: string
  final_result: string
  is_anonymous: boolean
  is_approved: boolean
  is_published: boolean
  user_id?: number
  user_name?: string
  created_at: string
}

export interface ExperienceCreateRequest {
  company_name: string
  role: string
  package_offered?: number
  interview_rounds?: any[]
  questions_asked?: Record<string, string[]>
  preparation_strategy?: string
  resources_followed?: string[]
  rejection_reasons?: string
  final_result: string
  is_anonymous: boolean
}

export const experiencesAPI = {
  getAll: async (company_name?: string, role?: string): Promise<Experience[]> => {
    const params: any = {}
    if (company_name) params.company_name = company_name
    if (role) params.role = role
    const response = await apiClient.get('/experiences/', { params })
    return response.data
  },

  getById: async (id: number): Promise<Experience> => {
    const response = await apiClient.get(`/experiences/${id}`)
    return response.data
  },

  create: async (data: ExperienceCreateRequest): Promise<Experience> => {
    const response = await apiClient.post('/experiences/', data)
    return response.data
  },

  update: async (id: number, data: Partial<ExperienceCreateRequest>): Promise<Experience> => {
    const response = await apiClient.put(`/experiences/${id}`, data)
    return response.data
  },

  getMyExperiences: async (): Promise<Experience[]> => {
    const response = await apiClient.get('/experiences/my-experiences')
    return response.data
  },

  bookmark: async (id: number) => {
    const response = await apiClient.post(`/experiences/${id}/bookmark`)
    return response.data
  },

  removeBookmark: async (id: number) => {
    const response = await apiClient.delete(`/experiences/${id}/bookmark`)
    return response.data
  },

  getBookmarks: async (): Promise<Experience[]> => {
    const response = await apiClient.get('/experiences/bookmarks/all')
    return response.data
  },
}
