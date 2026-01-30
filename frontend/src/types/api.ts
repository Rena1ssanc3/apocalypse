// User types
export interface User {
  id: number
  username: string
  email?: string
  enabled?: boolean
  isSuperuser?: boolean
  createdAt?: string
  updatedAt?: string
}

// Authentication types
export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
}

export interface AuthResponse {
  user: User
}

// API Error types
export interface ApiError {
  message: string
  code?: string
  details?: unknown
}

// Generic API response wrapper
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

// User Management types
export interface CreateUserRequest {
  username: string
  password: string
  email?: string
}

export interface UpdateUserStatusRequest {
  enabled: boolean
}
