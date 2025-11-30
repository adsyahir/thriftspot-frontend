export default defineNuxtRouteMiddleware(() => {
  const userStore = useUserStore()

  // If user is not authenticated or token is expired, redirect to signin
  if (!userStore.isAuthenticated || userStore.isTokenExpired) {
    if (userStore.isTokenExpired) {
      userStore.clearUser()
    }
    return navigateTo('/auth/signin')
  }
})
