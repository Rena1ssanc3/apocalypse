import api from './api'
import type { LoginRequest, LoginResponse, AuthResponse } from '@/types/api'

export type { LoginRequest, LoginResponse }

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', credentials)
    return response.data
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout')
  },

  getCurrentUser: async (): Promise<AuthResponse> => {
    const response = await api.get<AuthResponse>('/auth/me')
    return response.data
  },
}
