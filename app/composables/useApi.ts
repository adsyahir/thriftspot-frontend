import type { UseFetchOptions } from 'nuxt/app'

// Get the axios instance from the plugin
export const useApi = () => {
  const { $api } = useNuxtApp()
  return $api
}

// Composable for reactive data fetching (SSR-friendly)
export function useFetchApi<T = any>(
  url: string,
  options?: any
) {
  const config = useRuntimeConfig()

  const finalOptions = {
    baseURL: config.public.apiBase,
    ...options,
  }

  return useFetch<T>(url, finalOptions)
}

// Helper methods for common HTTP operations with axios
export const useApiHelpers = () => {
  const api = useApi()

  return {
    // GET request
    get: async <T = any>(url: string, params?: Record<string, any>) => {
      return await api.get<T>(url, { params }) as T
    },

    // POST request
    post: async <T = any>(url: string, data?: any) => {
      return await api.post<T>(url, data) as T
    },

    // PUT request
    put: async <T = any>(url: string, data?: any) => {
      return await api.put<T>(url, data) as T
    },

    // PATCH request
    patch: async <T = any>(url: string, data?: any) => {
      return await api.patch<T>(url, data) as T
    },

    // DELETE request
    delete: async <T = any>(url: string) => {
      return await api.delete<T>(url) as T
    },
  }
}
