import { defineStore } from 'pinia'
import * as authService from '../services/auth'
import { mergeWishlistOnLogin } from '../services/wishlist'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    token: null,
    loading: false,
    initialized: false
  }),

  getters: {
    isAdmin: (state) => state.user?.role === 'admin',
    userName: (state) => state.user?.name || 'Guest'
  },

  actions: {
    async login(credentials) {
      this.loading = true
      try {
        const { user, session } = await authService.signInWithPassword(
          credentials.email,
          credentials.password
        )
        this.user = user
        this.isAuthenticated = true
        this.token = session?.access_token || 'session'
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('token', this.token)
        await mergeWishlistOnLogin(user.id)
        return { success: true }
      } catch (error) {
        return { success: false, message: error.message }
      } finally {
        this.loading = false
      }
    },

    async register(userData) {
      this.loading = true
      try {
        const { user, session } = await authService.signUp(userData)
        this.user = user
        this.isAuthenticated = true
        this.token = session?.access_token || 'session'
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('token', this.token)
        return { success: true }
      } catch (error) {
        return { success: false, message: error.message }
      } finally {
        this.loading = false
      }
    },

    async loginWithOAuth(provider) {
      try {
        await authService.signInWithOAuth(provider)
        return { success: true }
      } catch (error) {
        return { success: false, message: error.message }
      }
    },

    async requestPasswordReset(email) {
      try {
        await authService.resetPassword(email)
        return { success: true }
      } catch (error) {
        return { success: false, message: error.message }
      }
    },

    async updatePassword(password) {
      try {
        await authService.updatePassword(password)
        return { success: true }
      } catch (error) {
        return { success: false, message: error.message }
      }
    },

    async updateProfile(updates) {
      if (!this.user) return { success: false }
      try {
        await authService.updateProfile(this.user.id, updates)
        this.user = {
          ...this.user,
          name: updates.name || `${updates.firstName || ''} ${updates.lastName || ''}`.trim(),
          email: updates.email || this.user.email
        }
        localStorage.setItem('user', JSON.stringify(this.user))
        return { success: true }
      } catch (error) {
        return { success: false, message: error.message }
      }
    },

    async logout() {
      try {
        await authService.signOut()
      } catch {
        /* ignore */
      }
      this.user = null
      this.isAuthenticated = false
      this.token = null
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    },

    async initializeAuth() {
      const saved = localStorage.getItem('user')
      const token = localStorage.getItem('token')
      if (saved && token) {
        this.user = JSON.parse(saved)
        this.token = token
        this.isAuthenticated = true
      }

      authService.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          const profile = await authService.fetchProfile(session.user.id)
          this.user = {
            id: session.user.id,
            email: session.user.email,
            name: profile?.full_name || session.user.user_metadata?.full_name || 'User',
            role: profile?.role || 'customer',
            avatar: profile?.avatar_url || 'https://via.placeholder.com/40'
          }
          this.isAuthenticated = true
          this.token = session.access_token
          localStorage.setItem('user', JSON.stringify(this.user))
          localStorage.setItem('token', this.token)
        } else if (event === 'SIGNED_OUT') {
          this.user = null
          this.isAuthenticated = false
          this.token = null
        }
      })

      this.initialized = true
    }
  }
})
