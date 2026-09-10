import { defineStore } from 'pinia'
import * as wishlistService from '../services/wishlist'
import { useAuthStore } from './auth'

export const useWishlistStore = defineStore('wishlist', {
  state: () => ({
    items: []
  }),

  getters: {
    itemCount: (state) => state.items.length,
    isInWishlist: (state) => (productId) => state.items.some((item) => item.id === productId)
  },

  actions: {
    async load() {
      const auth = useAuthStore()
      this.items = await wishlistService.fetchWishlist(auth.user?.id)
    },

    loadFromLocalStorage() {
      this.load()
    },

    async addItem(product) {
      const auth = useAuthStore()
      this.items = await wishlistService.addToWishlist(auth.user?.id, product)
    },

    async removeItem(productId) {
      const auth = useAuthStore()
      this.items = await wishlistService.removeFromWishlist(auth.user?.id, productId)
    },

    async toggleItem(product) {
      if (this.isInWishlist(product.id)) {
        await this.removeItem(product.id)
      } else {
        await this.addItem(product)
      }
    },

    async clearWishlist() {
      for (const item of [...this.items]) {
        await this.removeItem(item.id)
      }
    }
  }
})
