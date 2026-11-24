/**
 * API Services Index
 *
 * This file provides a centralized way to access all API services.
 * All services extend BaseService and are automatically initialized with the Nuxt app context.
 */

import { AuthService } from './auth'
import { RoleService } from './roles'
import { ShopService } from './shops'
import { ItemService } from './items'
import { AnalyticsService } from './analytics'

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

  const shops = new ShopService()
  shops.init(nuxtApp)

  const items = new ItemService()
  items.init(nuxtApp)

  const analytics = new AnalyticsService()
  analytics.init(nuxtApp)

  return {
    auth,
    roles,
    shops,
    items,
    analytics,
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
export { ShopService } from './shops'
export { ItemService } from './items'
export { AnalyticsService } from './analytics'
export { BaseService } from './base'
export { ErrorHandler, type ErrorResponse } from './errorHandler'
