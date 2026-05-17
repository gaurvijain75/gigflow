import api from './api'
import { Lead, LeadFilters, LeadsResponse, StatsData } from '../types'

interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export const leadsService = {
  getLeads: async (filters: LeadFilters = {}) => {
    const params = new URLSearchParams()
    if (filters.status) params.append('status', filters.status)
    if (filters.source) params.append('source', filters.source)
    if (filters.search) params.append('search', filters.search)
    if (filters.sort) params.append('sort', filters.sort)
    if (filters.page) params.append('page', String(filters.page))
    params.append('limit', '10')
    const { data } = await api.get<ApiResponse<LeadsResponse>>(`/leads?${params}`)
    return data.data
  },

  getLead: async (id: string) => {
    const { data } = await api.get<ApiResponse<{ lead: Lead }>>(`/leads/${id}`)
    return data.data.lead
  },

  createLead: async (lead: Partial<Lead>) => {
    const { data } = await api.post<ApiResponse<{ lead: Lead }>>('/leads', lead)
    return data.data.lead
  },

  updateLead: async (id: string, lead: Partial<Lead>) => {
    const { data } = await api.put<ApiResponse<{ lead: Lead }>>(`/leads/${id}`, lead)
    return data.data.lead
  },

  deleteLead: async (id: string) => {
    await api.delete(`/leads/${id}`)
  },

  getStats: async () => {
    const { data } = await api.get<ApiResponse<StatsData>>('/leads/stats')
    return data.data
  },

  exportCSV: async () => {
    const response = await api.get('/leads/export', { responseType: 'blob' })
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'gigflow-leads.csv')
    document.body.appendChild(link)
    link.click()
    link.remove()
  },
}