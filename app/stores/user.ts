import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    email: '',
    username: '',
    token: '',              // in-memory access token
    isAuthenticated: false,
  }),

  getters: {
    getEmail: (state) => state.email,
    getUsername: (state) => state.username,
    isLoggedIn: (state) => state.isAuthenticated,

    // Only checks memory token
    isTokenExpired: (state) => {
      if (!state.token) return true

      try {
        const parts = state.token.split('.')
        if (parts.length !== 3) return true

        const payload = JSON.parse(atob(parts[1]))
        const expirationTime = payload.exp * 1000
        return Date.now() >= expirationTime
      } catch (error) {
        console.error('Failed to decode token:', error)
        return true
      }
    },
  },

  actions: {
    setUser(email: string, username: string) {
      this.email = email
      this.username = username
      this.isAuthenticated = true
    },

    setToken(token: string) {
      this.token = token
      this.isAuthenticated = true
    },

    clearUser() {
      this.email = ''
      this.username = ''
      this.token = ''
      this.isAuthenticated = false
    },

    async initializeAuth() {
      /**
       * No token loaded from localStorage anymore.
       * We simply try to refresh on app load.
       */
      try {
        const response = await $fetch('/api/auth/refresh', {
          method: 'POST',
          credentials: 'include', // sends HttpOnly cookie
        })

        this.token = response.access_token
        this.isAuthenticated = true

        // Optional: decode email/username from JWT if stored inside
        const parts = this.token.split('.')
        const payload = JSON.parse(atob(parts[1]))
        this.email = payload.email
        this.username = payload.username

      } catch (err) {
        // refresh token probably expired → user must log in
        this.clearUser()
      }
    },
  },
})
