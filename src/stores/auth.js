import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    token: null
  }),

  getters: {
    isAdmin: (state) => state.user?.role === 'admin',
    userName: (state) => state.user?.name || 'Guest'
  },

  actions: {
    async login(credentials) {
      try {
        // Mock login - replace with actual API call
        const mockUser = {
          id: 1,
          name: credentials.email === 'admin@emall.com' ? 'Admin User' : 'John Doe',
          email: credentials.email,
          role: credentials.email === 'admin@emall.com' ? 'admin' : 'customer',
          avatar: 'https://via.placeholder.com/40'
        }
        
        this.user = mockUser
        this.isAuthenticated = true
        this.token = 'mock-jwt-token'
        
        localStorage.setItem('user', JSON.stringify(mockUser))
        localStorage.setItem('token', this.token)
        
        return { success: true }
      } catch (error) {
        return { success: false, message: error.message }
      }
    },

    async register(userData) {
      try {
        // Mock registration - replace with actual API call
        const newUser = {
          id: Date.now(),
          name: userData.name,
          email: userData.email,
          role: 'customer',
          avatar: 'https://via.placeholder.com/40'
        }
        
        this.user = newUser
        this.isAuthenticated = true
        this.token = 'mock-jwt-token'
        
        localStorage.setItem('user', JSON.stringify(newUser))
        localStorage.setItem('token', this.token)
        
        return { success: true }
      } catch (error) {
        return { success: false, message: error.message }
      }
    },

    logout() {
      this.user = null
      this.isAuthenticated = false
      this.token = null
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    },

    initializeAuth() {
      const user = localStorage.getItem('user')
      const token = localStorage.getItem('token')
      
      if (user && token) {
        this.user = JSON.parse(user)
        this.token = token
        this.isAuthenticated = true
      }
    }
  }
})