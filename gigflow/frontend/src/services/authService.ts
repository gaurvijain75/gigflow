import api from './api'
import { User } from '../types'

interface AuthResponse {
  success: boolean
  message: string
  data: { token: string; user: User }
}

export const authService = {
  register: async (name: string, email: string, password: string, role: string) => {
    const { data } = await api.post<AuthResponse>('/auth/register', { name, email, password, role })
    return data
  },

  login: async (email: string, password: string) => {
    const { data } = await api.post<AuthResponse>('/auth/login', { email, password })
    return data
  },

  getMe: async () => {
    const { data } = await api.get('/auth/me')
    return data
  },
}