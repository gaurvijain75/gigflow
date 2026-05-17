export type UserRole = 'admin' | 'sales'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost'
export type LeadSource = 'Website' | 'Instagram' | 'Referral'

export interface Lead {
  _id: string
  name: string
  email: string
  status: LeadStatus
  source: LeadSource
  createdBy: { name: string; email: string }
  createdAt: string
  updatedAt: string
}

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface LeadsResponse {
  leads: Lead[]
  pagination: PaginationMeta
}

export interface LeadFilters {
  status?: LeadStatus | ''
  source?: LeadSource | ''
  search?: string
  sort?: 'latest' | 'oldest'
  page?: number
}

export interface StatsData {
  total: number
  statusStats: { _id: string; count: number }[]
  sourceStats: { _id: string; count: number }[]
}