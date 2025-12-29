export default defineNuxtRouteMiddleware(async () => {
  // Only run on client-side where we have access to cookies/tokens
  if (import.meta.server) {
    return
  }

  const userStore = useUserStore()
  // If store shows authenticated, verify with backend to be sure
  try {
    const isAuthenticated = await userStore.verifyAuth()
    console.log('[AUTH MIDDLEWARE] isAuthenticated:', isAuthenticated)
    if (!isAuthenticated) {
      return navigateTo('/auth/signin', { replace: true })
    }
  } catch (error) {
    console.error('[AUTH MIDDLEWARE] Error verifying auth:', error)
    return navigateTo('/auth/signin', { replace: true })
  }
})
