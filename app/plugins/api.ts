// plugins/api.ts
import axios from 'axios'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

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

  // Request interceptor
  api.interceptors.request.use(
    (config) => {
      // Log requests in development
      if (process.dev) {
        console.log('🚀 API Request:', config.method?.toUpperCase(), config.url)
      }

      // You can add auth tokens here
      // const token = localStorage.getItem('token')
      // if (token) {
      //   config.headers.Authorization = `Bearer ${token}`
      // }
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
    (error) => {
      // Handle errors globally
      if (error.response) {
        // Server responded with error status
        console.error('❌ API Error:', error.response.status, error.response.statusText)
        console.error('Response data:', error.response.data)
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
