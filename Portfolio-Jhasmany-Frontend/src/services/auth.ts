import { apiClient } from '@/lib/api-client'
import type { LoginFormData, RegisterFormData } from '@/schemas/auth.schema'

export interface AuthResponse {
  success: boolean
  message: string
  user?: {
    id: string
    name: string
    email: string
  }
  token?: string
}

export const authService = {
  async login(data: LoginFormData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post('auth/login', {
        json: data,
      }).json<AuthResponse>()

      if (response.token) {
        // Store token in localStorage (in a real app, consider more secure storage)
        localStorage.setItem('auth_token', response.token)
      }

      return response
    } catch (error) {
      console.error('Login error:', error)
      return {
        success: false,
        message: 'Login failed. Please try again.',
      }
    }
  },

  async register(data: Omit<RegisterFormData, 'confirmPassword'>): Promise<AuthResponse> {
    try {
      const response = await apiClient.post('auth/register', {
        json: data,
      }).json<AuthResponse>()

      return response
    } catch (error) {
      console.error('Registration error:', error)
      return {
        success: false,
        message: 'Registration failed. Please try again.',
      }
    }
  },

  async logout(): Promise<void> {
    try {
      const token = localStorage.getItem('auth_token')
      if (token) {
        await apiClient.post('auth/logout', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('auth_token')
    }
  },

  async getCurrentUser(): Promise<AuthResponse['user'] | null> {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) return null

      const response = await apiClient.get('auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).json<{ user: AuthResponse['user'] }>()

      return response.user
    } catch (error) {
      console.error('Get current user error:', error)
      localStorage.removeItem('auth_token')
      return null
    }
  },

  getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('auth_token')
  },

  isAuthenticated(): boolean {
    return !!this.getToken()
  },
}