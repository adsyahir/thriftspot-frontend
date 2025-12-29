import { BaseService } from './base'
import type { LoginRequest, LoginResponse } from '~/types/auth'

export class AuthService extends BaseService {
  /**
   * Login user with email and password
   */
  async login(credentials: LoginRequest) {
    return await this.post('/auth/login', credentials)
  }

  /**
   * Logout user
   */
  async logout() {
    return await this.post('/auth/logout')
  }

  /**
   * Refresh token (if using manual refresh)
   */
  async refresh() {
    return await this.post('/auth/refresh')
  }

  /**
   * Get current authenticated user
   */
  async me() {
    return await this.post('/auth/me')
  }

  /**
   * Get refresh token
   */
  async refreshToken() {
    return await this.post('/auth/refresh')
  }
}

/**
 * Composable to get AuthService instance
 * Use this in components: const authService = useAuthService()
 */
export const useAuthService = () => {
  const nuxtApp = useNuxtApp()
  const service = new AuthService()
  service.init(nuxtApp)
  return service
}
