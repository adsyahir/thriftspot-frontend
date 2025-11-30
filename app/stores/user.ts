import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    email: '',
    username: '',
    token: '',
    isAuthenticated: false,
  }),

  getters: {
    // Use regular function to access state
    getEmail: (state) => state.email,
    getUsername: (state) => state.username,
    isLoggedIn: (state) => state.isAuthenticated,
  },

  actions: {
    setUser(email: string, username: string, token: string) {
      this.email = email
      this.username = username
      this.token = token
      this.isAuthenticated = true
    },

    clearUser() {
      this.email = ''
      this.username = ''
      this.token = ''
      this.isAuthenticated = false
    },
  },
})