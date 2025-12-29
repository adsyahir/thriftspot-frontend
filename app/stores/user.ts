import { defineStore } from 'pinia'
import type { LoginRequest } from '~/types/auth'
import { useAuthService } from '~/services/auth'

export const useUserStore = defineStore('user', {
  state: () => ({
    email: '',
    username: '',
    name: '',
    roles: [] as string[],
    permissions: [] as string[],
    isAuthenticated: false,
    isLoading: false,
    isInitialLoad: true,
    error: null as string | null,
    access_token: null as string | null,
  }),

  getters: {
    getEmail: (state) => state.email,
    getUsername: (state) => state.username,
    getName: (state) => state.name,
    isLoggedIn: (state) => state.isAuthenticated,
    hasRole: (state) => (role: string) => state.roles.includes(role),
    hasPermission: (state) => (permission: string) => state.permissions.includes(permission),
  },

  actions: {
    /**
     * Login user with email and password
     */
    async login(credentials: LoginRequest): Promise<{ success: boolean; message?: string }> {
      this.isLoading = true
      this.error = null

      try {
        const authService = useAuthService()

        const response = await authService.login(credentials)

        if (response.data.user) {
          this.email = response.data.user.email
          this.username = response.data.user.username
          this.name = response.data.user.name
          this.roles = response.data.user.roles || []
          this.permissions = response.data.user.permissions || []
          this.isAuthenticated = true

          // Store access token from response
          if (response.data.access_token) {
            this.access_token = response.data.access_token
          }

          // Test: Verify token is working by making an API call
          if (this.access_token) {
            try {
              const authService = useAuthService()
              const meResponse = await authService.me()
            } catch (error) {
              console.error('[USER STORE] ❌ Token test failed:', error)
            }
          }
        }

        return {
          success: true,
          message: response.message || 'Login successful',
        }
      } catch (err: any) {
        this.error = err.message || 'Login failed'
        this.clearUser()

        return {
          success: false,
          message: this.error || 'Login failed',
        }
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Logout user and clear session
     */
    async logout(): Promise<void> {
      try {
        const authService = useAuthService()
        await authService.logout()
        // Backend will clear the httpOnly cookie
      } catch (err) {
        console.error('Logout error:', err)
        // Continue with logout even if API call fails
      } finally {
        // Clear user data (cookies are cleared by backend)
        this.clearUser()
      }
    },

    /**
     * Check if user is authenticated by verifying with backend
     */
    async checkAuth(): Promise<boolean> {
      try {
        const authService = useAuthService()
        const response = await authService.me()

        // /auth/me returns the user object directly, not wrapped in { user: {...} }
        if (response.data && response.data.email) {
          this.setUser(
            response.data.email,
            response.data.username,
            response.data.name,
            response.data.roles,
            response.data.permissions
          )
          return true
        } else {
          this.clearUser()
          return false
        }
      } catch (error) {
        console.error('[USER STORE] Auth check failed:', error)
        this.clearUser()
        return false
      }
    },

    /**
     * Verify authentication with backend using /api/auth/me
     * Returns true if authenticated, false otherwise
     *
     * Note: Token refresh is handled automatically by axios interceptor
     */
    async verifyAuth(): Promise<boolean> {
      if (this.isInitialLoad) {
        this.isLoading = true
      }
    
      try {
        const authService = useAuthService()
        const { data } = await authService.me()
    
        if (!data || !data.email) {
          this.clearUser()
          this.isAuthenticated = false
          return false
        }
    
        this.setUser(
          data.email,
          data.username,
          data.name,
          data.roles,
          data.permissions
        )
    
        this.isAuthenticated = true
    
        const refreshed = await this.refreshToken()
        return Boolean(refreshed) // ✅ always boolean
      } catch (error) {
        this.clearUser()
        this.isAuthenticated = false
        return false
      } finally {
        this.isLoading = false
        this.isInitialLoad = false
      }
    },
    

    /**
     * Refresh access token using refresh token
     * Returns true if refresh successful, false otherwise
     */
    async refreshToken(): Promise<boolean> {
      try {
        const authService = useAuthService()
        const response = await authService.refreshToken()
        if (response.data.access_token) {
          // Update access token
          this.access_token = response.data.access_token
          return true
        } else {
          // No token returned
          this.clearUser()
          return false
        }
      } catch (error) {
        // Token refresh failed
        console.error('[USER STORE] Token refresh failed:', error)
        this.clearUser()
        return false
      }
    },

    /**
     * Set user data manually (used internally)
     */
    setUser(email: string, username: string, name?: string, roles?: string[], permissions?: string[]) {
      this.email = email
      this.username = username
      this.name = name || ''
      this.roles = roles || []
      this.permissions = permissions || []
      this.isAuthenticated = true
    },

    /**
     * Clear user data and reset state
     */
    clearUser() {
      this.email = ''
      this.username = ''
      this.name = ''
      this.roles = []
      this.permissions = []
      this.isAuthenticated = false
      this.error = null
      this.access_token = null
    },
  },
})
