export default defineNuxtPlugin(() => {
  const userStore = useUserStore()

  // Initialize auth from localStorage
  userStore.initializeAuth()
})
