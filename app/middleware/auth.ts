import { checkPermissions } from '@/lib/permissions'

export default defineNuxtRouteMiddleware(async (to) => {
  // Only run on client-side where we have access to cookies/tokens
  if (import.meta.server) {
    return
  }

  const userStore = useUserStore()

  try {
    // If no access_token (e.g., after page refresh), try to refresh first
    if (!userStore.access_token) {

      const refreshed = await userStore.refreshToken()

      if (!refreshed) {
        console.error('[AUTH MIDDLEWARE] Token refresh failed, redirecting to signin')
        return navigateTo('/auth/signin', { replace: true })
      }
    }

    // Verify authentication with backend
    const isAuthenticated = await userStore.verifyAuth()

    if (!isAuthenticated) {
      return navigateTo('/auth/signin', { replace: true })
    }

    // After authentication, check permissions
    const permissionResult = checkPermissions(userStore, to)
    if (!permissionResult.hasAccess && permissionResult.redirectTo) {
      return navigateTo(permissionResult.redirectTo, { replace: true })
    }
  } catch (error) {
    console.error('[AUTH MIDDLEWARE] Error verifying auth:', error)
    return navigateTo('/auth/signin', { replace: true })
  }
})
