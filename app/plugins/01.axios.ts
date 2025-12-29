import axios, { type AxiosInstance } from 'axios'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  // Create axios instance
  const axiosApi: AxiosInstance = axios.create({
    baseURL: config.public.apiBase,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    withCredentials: true, // Important for CSRF protection and cookies
  })

  // Request interceptor - Add auth token
  axiosApi.interceptors.request.use(
    (config) => {
      // Add Authorization header from userStore if token exists
      const userStore = useUserStore()
      if (userStore.access_token) {
        config.headers.Authorization = `Bearer ${userStore.access_token}`
      }

      return config
    },
    (error) => {
      console.error('[Axios Request Error]', error)
      return Promise.reject(error)
    }
  )

  // Track if we're currently refreshing to prevent multiple refresh attempts
  let isRefreshing = false
  let failedQueue: Array<{ resolve: (value?: unknown) => void; reject: (reason?: unknown) => void }> = []

  const processQueue = (error: Error | null = null) => {
    failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error)
      } else {
        prom.resolve()
      }
    })
    failedQueue = []
  }

  // Response interceptor - Handle responses and errors
  axiosApi.interceptors.response.use(
    (response) => {
      return response
    },
    async (error) => {
      const originalRequest = error.config

      // Handle 401 Unauthorized - Try to refresh token
      if (error.response?.status === 401 && !originalRequest._retry) {
        // Don't retry if this is the refresh endpoint itself
        if (originalRequest.url?.includes('/auth/refresh')) {
          console.error('[Axios] Refresh token expired or invalid')
          const userStore = useUserStore()
          userStore.clearUser()
          if (import.meta.client) {
            await navigateTo('/auth/signin')
          }
          return Promise.reject(error)
        }

        // If already refreshing, queue this request
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          })
            .then(() => {
              return axiosApi(originalRequest)
            })
            .catch((err) => {
              return Promise.reject(err)
            })
        }

        originalRequest._retry = true
        isRefreshing = true

        try {
          // Call refresh endpoint
          const response = await axiosApi.post('/auth/refresh')

          // Update access token in store if returned
          if (response.data.access_token) {
            const userStore = useUserStore()
            userStore.access_token = response.data.access_token
          }

          // Process queued requests
          processQueue(null)
          isRefreshing = false

          // Retry original request
          return axiosApi(originalRequest)
        } catch (refreshError) {
          // Refresh failed
          console.error('[Axios] Token refresh failed')
          processQueue(refreshError as Error)
          isRefreshing = false

          const userStore = useUserStore()
          userStore.clearUser()
          if (import.meta.client) {
            await navigateTo('/auth/signin')
          }
          return Promise.reject(refreshError)
        }
      }

      // Handle 403 Forbidden - Insufficient permissions
      if (error.response?.status === 403) {
        console.error('[Axios] Access forbidden:', error.response.data)
      }

      // Handle 404 Not Found
      if (error.response?.status === 404) {
        console.error('[Axios] Resource not found:', error.config?.url)
      }

      // Handle 500 Server Error
      if (error.response?.status >= 500) {
        console.error('[Axios] Server error:', error.response.data)
      }

      return Promise.reject(error)
    }
  )

  // Inject axios instance into Nuxt app
  return {
    provide: {
      axiosApi,
    },
  }
})
