import type { AxiosInstance } from 'axios'
import { type ErrorResponse, ErrorHandler } from './errorHandler'
import type { NuxtApp } from 'nuxt/app'

export class BaseService {
  protected axiosApi: AxiosInstance | null = null

  init(nuxtApp: NuxtApp) {
    this.axiosApi = nuxtApp.$axiosApi as AxiosInstance
    if (!this.axiosApi) {
      console.error('[BaseService] Failed to initialize: nuxtApp.$axiosApi is undefined')
      console.error('[BaseService] Available keys on nuxtApp:', Object.keys(nuxtApp))
    }
  }

  async handleRequest(requestFn: () => Promise<any>) {
    try {
      const response = await requestFn()
      return {
        data: response.data?.data || response.data,
        error: null,
        success: true,
        meta: response.data?.meta || null,
        message: response.data?.message || 'Success',
      }
    } catch (error) {
      const handledError: ErrorResponse = ErrorHandler.handle(error)
      throw handledError
    }
  }

  private ensureAxiosInitialized() {
    if (!this.axiosApi) {
      throw new Error('BaseService: axiosApi is not initialized. Make sure to call init(nuxtApp) before using the service.')
    }
  }

  async get(endpoint: string, params = {}) {
    this.ensureAxiosInitialized()
    const config = {
      params,
    }
    return this.handleRequest(() => this.axiosApi!.get(endpoint, config))
  }

  async post(endpoint: string, data = {}) {
    this.ensureAxiosInitialized()
    return this.handleRequest(() => this.axiosApi!.post(endpoint, data))
  }

  async put(endpoint: string, data = {}) {
    this.ensureAxiosInitialized()
    // If data is FormData, use putFormData to handle Laravel's PUT method spoofing
    if (data instanceof FormData) {
      return this.putFormData(endpoint, data)
    }
    return this.handleRequest(() => this.axiosApi!.put(endpoint, data))
  }

  async patch(endpoint: string, data = {}) {
    this.ensureAxiosInitialized()
    return this.handleRequest(() => this.axiosApi!.patch(endpoint, data))
  }

  async delete(endpoint: string) {
    this.ensureAxiosInitialized()
    return this.handleRequest(() => this.axiosApi!.delete(endpoint))
  }

  async postFormData(endpoint: string, formData: FormData) {
    this.ensureAxiosInitialized()
    // Let axios automatically set Content-Type with proper boundary for FormData
    return this.handleRequest(() => this.axiosApi!.post(endpoint, formData))
  }

  async putFormData(endpoint: string, formData: FormData) {
    this.ensureAxiosInitialized()
    // Add Laravel method spoofing field for PUT requests
    if (formData instanceof FormData) {
      formData.append('_method', 'PUT')
    }

    // Let axios automatically set Content-Type with proper boundary for FormData
    return this.handleRequest(() =>
      this.axiosApi!.post(endpoint, formData, {
        headers: {
          'X-HTTP-Method-Override': 'PUT',
        },
      })
    )
  }

  async postWithBlob(endpoint: string, data = {}) {
    this.ensureAxiosInitialized()
    try {
      const response = await this.axiosApi!.post(endpoint, data, {
        responseType: 'blob',
        headers: {
          Accept: 'application/pdf',
          'Content-Type': 'application/json',
        },
      })
      return response.data
    } catch (error: any) {
      // If the response is a blob but contains error JSON, we need to parse it
      if (error.response && error.response.data instanceof Blob) {
        const text = await error.response.data.text()
        try {
          const errorData = JSON.parse(text)
          throw new Error(errorData.message || 'PDF generation failed')
        } catch (parseError) {
          // Could not parse blob error
        }
      }
      const handledError: ErrorResponse = ErrorHandler.handle(error)
      throw handledError
    }
  }
}
