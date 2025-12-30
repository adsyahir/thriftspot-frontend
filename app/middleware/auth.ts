import { checkPermissions } from '@/lib/permissions'

export default defineNuxtRouteMiddleware(async (to) => {
  // Only run on client-side where we have access to cookies/tokens
  if (import.meta.server) {
    return
  }

  const userStore = useUserStore()

  // If store shows authenticated, verify with backend to be sure
  try {
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
