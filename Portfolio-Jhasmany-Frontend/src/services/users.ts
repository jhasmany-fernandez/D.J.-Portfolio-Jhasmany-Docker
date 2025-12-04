import { apiClient } from '@/lib/api-client'

export interface User {
  id: string
  email: string
  name: string
  role: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateUserData {
  email: string
  name: string
  password: string
  role?: string
}

export interface UpdateUserData {
  email?: string
  name?: string
  password?: string
  role?: string
  isActive?: boolean
}

export const usersService = {
  async getAllUsers(): Promise<User[]> {
    try {
      const response = await apiClient.get('api/users').json<User[]>()
      return response
    } catch (error) {
      console.error('Get all users error:', error)
      throw error
    }
  },

  async getUserById(id: string): Promise<User> {
    try {
      const response = await apiClient.get(`api/users/${id}`).json<User>()
      return response
    } catch (error) {
      console.error('Get user by ID error:', error)
      throw error
    }
  },

  async createUser(data: CreateUserData): Promise<User> {
    try {
      const response = await apiClient.post('api/users', {
        json: data,
      }).json<User>()
      return response
    } catch (error) {
      console.error('Create user error:', error)
      throw error
    }
  },

  async updateUser(id: string, data: UpdateUserData): Promise<User> {
    try {
      const response = await apiClient.patch(`api/users/${id}`, {
        json: data,
      }).json<User>()
      return response
    } catch (error) {
      console.error('Update user error:', error)
      throw error
    }
  },

  async deleteUser(id: string): Promise<void> {
    try {
      await apiClient.delete(`api/users/${id}`)
    } catch (error) {
      console.error('Delete user error:', error)
      throw error
    }
  },
}
