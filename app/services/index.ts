/**
 * API Services Index
 *
 * This file provides a centralized way to access all API services.
 * All services extend BaseService and are automatically initialized with the Nuxt app context.
 */

import { AuthService } from './auth'
import { RoleService } from './roles'

/**
 * Composable to access all API services
 *
 * Usage in components:
 * ```ts
 * const api = useApi()
 * const response = await api.auth.login(credentials)
 * const roles = await api.roles.getRoles()
 * ```
 */
export const useApi = () => {
  const nuxtApp = useNuxtApp()

  // Initialize Auth Service
  const auth = new AuthService()
  auth.init(nuxtApp)

  // Initialize Role Service
  const roles = new RoleService()
  roles.init(nuxtApp)

  return {
    auth,
    roles,
  }
}

/**
 * Individual service composables (for when you only need one service)
 */
export { useAuthService } from './auth'
export { useRoleService } from './roles'

/**
 * Export service classes for direct use if needed
 */
export { AuthService } from './auth'
export { RoleService } from './roles'
export { BaseService } from './base'
export { ErrorHandler, type ErrorResponse } from './errorHandler'
