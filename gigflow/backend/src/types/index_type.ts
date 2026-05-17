import { Request } from 'express'
import { Document, Types } from 'mongoose'

// ─── User Types ───────────────────────────────────────────────────────────────

export type UserRole = 'admin' | 'sales'

export interface IUser extends Document {
  _id: Types.ObjectId
  name: string
  email: string
  password: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

export interface UserPayload {
  id: string
  email: string
  role: UserRole
}

// ─── Lead Types ───────────────────────────────────────────────────────────────

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost'
export type LeadSource = 'Website' | 'Instagram' | 'Referral'

export interface ILead extends Document {
  _id: Types.ObjectId
  name: string
  email: string
  status: LeadStatus
  source: LeadSource
  createdBy: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

// ─── Request Types ────────────────────────────────────────────────────────────

export interface AuthRequest extends Request {
  user?: UserPayload
}

// ─── API Response Types ───────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data?: T
  error?: string
}

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface PaginatedResponse<T> {
  leads: T[]
  pagination: PaginationMeta
}

// ─── Query Types ──────────────────────────────────────────────────────────────

export interface LeadQuery {
  status?: LeadStatus
  source?: LeadSource
  search?: string
  sort?: 'latest' | 'oldest'
  page?: number
  limit?: number
}
