import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    isOpen: false
  }),

  getters: {
    itemCount: (state) => state.items.reduce((total, item) => total + item.quantity, 0),
    totalPrice: (state) => state.items.reduce((total, item) => total + (item.price * item.quantity), 0),
    subtotal: (state) => state.items.reduce((total, item) => total + (item.price * item.quantity), 0),
    tax: (state) => state.subtotal * 0.08, // 8% tax
    shipping: (state) => state.subtotal > 50 ? 0 : 9.99,
    grandTotal: (state) => state.subtotal + state.tax + state.shipping
  },

  actions: {
    addItem(product, quantity = 1, selectedVariant = null) {
      const existingItem = this.items.find(item => 
        item.id === product.id && 
        JSON.stringify(item.selectedVariant) === JSON.stringify(selectedVariant)
      )

      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        this.items.push({
          ...product,
          quantity,
          selectedVariant,
          cartId: Date.now() + Math.random()
        })
      }
      
      this.saveToLocalStorage()
    },

    removeItem(cartId) {
      this.items = this.items.filter(item => item.cartId !== cartId)
      this.saveToLocalStorage()
    },

    updateQuantity(cartId, quantity) {
      const item = this.items.find(item => item.cartId === cartId)
      if (item) {
        item.quantity = Math.max(0, quantity)
        if (item.quantity === 0) {
          this.removeItem(cartId)
        }
      }
      this.saveToLocalStorage()
    },

    clearCart() {
      this.items = []
      this.saveToLocalStorage()
    },

    toggleCart() {
      this.isOpen = !this.isOpen
    },

    openCart() {
      this.isOpen = true
    },

    closeCart() {
      this.isOpen = false
    },

    saveToLocalStorage() {
      localStorage.setItem('cart', JSON.stringify(this.items))
    },

    loadFromLocalStorage() {
      const saved = localStorage.getItem('cart')
      if (saved) {
        this.items = JSON.parse(saved)
      }
    },

    applyCoupon(code) {
      // Mock coupon functionality
      const validCoupons = {
        'SAVE10': { discount: 0.1, type: 'percentage' },
        'SAVE20': { discount: 0.2, type: 'percentage' },
        'FREESHIP': { discount: this.shipping, type: 'fixed' }
      }
      
      return validCoupons[code] || null
    }
  }
})