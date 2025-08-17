import { defineStore } from 'pinia'

export const useWishlistStore = defineStore('wishlist', {
  state: () => ({
    items: []
  }),

  getters: {
    itemCount: (state) => state.items.length,
    isInWishlist: (state) => (productId) => state.items.some(item => item.id === productId)
  },

  actions: {
    addItem(product) {
      if (!this.isInWishlist(product.id)) {
        this.items.push(product)
        this.saveToLocalStorage()
      }
    },

    removeItem(productId) {
      this.items = this.items.filter(item => item.id !== productId)
      this.saveToLocalStorage()
    },

    toggleItem(product) {
      if (this.isInWishlist(product.id)) {
        this.removeItem(product.id)
      } else {
        this.addItem(product)
      }
    },

    clearWishlist() {
      this.items = []
      this.saveToLocalStorage()
    },

    saveToLocalStorage() {
      localStorage.setItem('wishlist', JSON.stringify(this.items))
    },

    loadFromLocalStorage() {
      const saved = localStorage.getItem('wishlist')
      if (saved) {
        this.items = JSON.parse(saved)
      }
    }
  }
})