// plugins/api.ts
import axios from 'axios'
import type { AxiosError, InternalAxiosRequestConfig } from 'axios'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const userStore = useUserStore()

  // Track if we're currently refreshing to avoid multiple refresh calls
  let isRefreshing = false
  let refreshSubscribers: ((token: string) => void)[] = []

  // Queue failed requests while refreshing
  const subscribeTokenRefresh = (cb: (token: string) => void) => {
    refreshSubscribers.push(cb)
  }

  // Retry queued requests with new token
  const onTokenRefreshed = (token: string) => {
    refreshSubscribers.forEach((cb) => cb(token))
    refreshSubscribers = []
  }

  // Create axios instance with base configuration
  const api = axios.create({
    baseURL: config.public.apiBase,
    withCredentials: true,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 second timeout
  })

  // Check if token is about to expire (within 5 minutes)
  const isTokenExpiringSoon = (token: string): boolean => {
    try {
      const parts = token.split('.')
      if (parts.length !== 3) return true

      const payloadPart = parts[1]
      if (!payloadPart) return true

      const payload = JSON.parse(atob(payloadPart))
      const expirationTime = payload.exp * 1000
      const fiveMinutes = 5 * 60 * 1000
      return Date.now() >= (expirationTime - fiveMinutes)
    } catch {
      return true
    }
  }

  // Refresh the access token
  const refreshAccessToken = async (): Promise<string | null> => {
    try {
      console.log('🔄 Refreshing access token...')
      const response = await axios.post(
        `${config.public.apiBase}/auth/refresh`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${userStore.token}`,
            'Accept': 'application/json',
          },
        }
      )

      const newToken = response.data.access_token

      // Update token in store
      userStore.setUser(userStore.email, userStore.username, newToken)

      console.log('✅ Token refreshed successfully')
      return newToken
    } catch (error) {
      console.error('❌ Token refresh failed:', error)
      // Clear user session on refresh failure
      userStore.clearUser()
      // Redirect to login
      if (import.meta.client) {
        navigateTo('/auth/signin')
      }
      return null
    }
  }

  // Request interceptor
  api.interceptors.request.use(
    async (config) => {
      // Log requests in development
      if (process.dev) {
        console.log('🚀 API Request:', config.method?.toUpperCase(), config.url)
      }

      // Skip token check for auth endpoints
      if (config.url?.includes('/auth/login') || config.url?.includes('/auth/register')) {
        return config
      }

      // Add auth token from user store
      if (userStore.token) {
        // Check if token is about to expire and refresh proactively
        if (isTokenExpiringSoon(userStore.token) && !isRefreshing) {
          isRefreshing = true
          const newToken = await refreshAccessToken()
          isRefreshing = false

          if (newToken) {
            config.headers.Authorization = `Bearer ${newToken}`
            onTokenRefreshed(newToken)
          }
        } else {
          config.headers.Authorization = `Bearer ${userStore.token}`
        }
      }

      return config
    },
    (error) => {
      console.error('❌ Request Error:', error)
      return Promise.reject(error)
    }
  )

  // Response interceptor
  api.interceptors.response.use(
    (response) => {
      // Log responses in development
      if (process.dev) {
        console.log('✅ API Response:', response.status, response.config.url)
      }

      // Return only the data
      return response.data
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

      // Handle errors globally
      if (error.response) {
        // Server responded with error status
        console.error('❌ API Error:', error.response.status, error.response.statusText)
        console.error('Response data:', error.response.data)

        // Handle 401 Unauthorized - token expired
        if (error.response.status === 401 && !originalRequest._retry) {
          if (originalRequest.url?.includes('/auth/refresh')) {
            // Refresh token itself is invalid, logout user
            console.error('🚫 Refresh token invalid, logging out...')
            userStore.clearUser()
            if (import.meta.client) {
              navigateTo('/auth/signin')
            }
            return Promise.reject(error)
          }

          // If already refreshing, queue this request
          if (isRefreshing) {
            return new Promise((resolve) => {
              subscribeTokenRefresh((token: string) => {
                originalRequest.headers.Authorization = `Bearer ${token}`
                resolve(api(originalRequest))
              })
            })
          }

          originalRequest._retry = true
          isRefreshing = true

          const newToken = await refreshAccessToken()
          isRefreshing = false

          if (newToken) {
            onTokenRefreshed(newToken)
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            return api(originalRequest)
          }
        }
      } else if (error.request) {
        // Request made but no response
        console.error('❌ Network Error: No response received')
        console.error('Check if backend is running and CORS is configured')
      } else {
        // Something else happened
        console.error('❌ Error:', error.message)
      }

      return Promise.reject(error)
    }
  )

  // Make it available as $api throughout the app
  return {
    provide: {
      api  // Now accessible as useNuxtApp().$api
    }
  }
})
