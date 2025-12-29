export interface ErrorResponse {
  message: string
  errors?: Record<string, string[]>
  statusCode?: number
  data?: any
}

export class ErrorHandler {
  static handle(error: any): ErrorResponse {
    // Handle Axios errors
    if (error.response) {
      const status = error.response.status
      const data = error.response.data

      // Extract error message
      let message = 'An error occurred'
      if (data?.message) {
        message = data.message
      } else if (data?.error) {
        message = data.error
      } else if (typeof data === 'string') {
        message = data
      }

      // Handle validation errors (422)
      if (status === 422 && data?.errors) {
        return {
          message: message || 'Validation failed',
          errors: data.errors,
          statusCode: status,
          data: data,
        }
      }

      // Handle authentication errors (401)
      if (status === 401) {
        return {
          message: message || 'Unauthorized. Please login.',
          statusCode: status,
          data: data,
        }
      }

      // Handle forbidden errors (403)
      if (status === 403) {
        return {
          message: message || 'Forbidden. You do not have permission.',
          statusCode: status,
          data: data,
        }
      }

      // Handle not found errors (404)
      if (status === 404) {
        return {
          message: message || 'Resource not found.',
          statusCode: status,
          data: data,
        }
      }

      // Handle server errors (500)
      if (status >= 500) {
        return {
          message: message || 'Server error. Please try again later.',
          statusCode: status,
          data: data,
        }
      }

      return {
        message,
        statusCode: status,
        data: data,
      }
    }

    // Handle network errors
    if (error.request) {
      return {
        message: 'Network error. Please check your connection.',
        statusCode: 0,
      }
    }

    // Handle other errors
    return {
      message: error.message || 'An unexpected error occurred',
    }
  }

  /**
   * Format validation errors for display
   */
  static formatValidationErrors(errors: Record<string, string[]>): string {
    return Object.values(errors)
      .flat()
      .join(', ')
  }
}
