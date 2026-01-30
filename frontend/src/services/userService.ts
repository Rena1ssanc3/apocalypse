import api from './api'
import type { User, CreateUserRequest, UpdateUserStatusRequest } from '../types/api'

export const userService = {
  async getUsers(): Promise<User[]> {
    const response = await api.get<User[]>('/users')
    return response.data
  },

  async createUser(request: CreateUserRequest): Promise<User> {
    const response = await api.post<User>('/users', request)
    return response.data
  },

  async updateUserStatus(userId: number, request: UpdateUserStatusRequest): Promise<User> {
    const response = await api.patch<User>(`/users/${userId}/status`, request)
    return response.data
  }
}

export default userService
