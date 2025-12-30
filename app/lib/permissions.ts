import type { RouteLocationNormalized } from 'vue-router'

/**
 * Check if user has required permissions based on route meta
 * Returns an object with success status and redirect path if access denied
 */
export function checkPermissions(
  userStore: any,
  route: RouteLocationNormalized
): { hasAccess: boolean; redirectTo?: string } {
  try {
    // Get permission configuration from route meta
    const permission = route.meta.permission as string | undefined
    const permissions = route.meta.permissions as string[] | undefined
    const operator = (route.meta.permissionOperator as 'AND' | 'OR') || 'AND'

    // Single permission check
    if (permission) {
      if (!userStore.hasPermission(permission)) {
        console.warn(`[Permission Check] Access denied - missing permission: ${permission}`)
        return { hasAccess: false, redirectTo: '/error/403' }
      }
    }

    // Multiple permissions check
    if (permissions && permissions.length > 0) {
      let hasAccess = false

      if (operator === 'AND') {
        // User must have ALL permissions
        hasAccess = permissions.every(perm => userStore.hasPermission(perm))
      } else {
        // User must have AT LEAST ONE permission
        hasAccess = permissions.some(perm => userStore.hasPermission(perm))
      }

      if (!hasAccess) {
        console.warn(`[Permission Check] Access denied - missing permissions (${operator}):`, permissions)
        return { hasAccess: false, redirectTo: '/error/403' }
      }
    }

    return { hasAccess: true }
  } catch (error) {
    console.error('[Permission Check] Error checking permissions:', error)
    return { hasAccess: false, redirectTo: '/error/500' }
  }
}
