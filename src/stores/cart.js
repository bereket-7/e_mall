import { defineStore } from 'pinia'
import { TAX_RATE, SHIPPING_METHODS } from '../lib/config'
import { validateCoupon, validateCouponAsync } from '../services/orders'

function calcSubtotal(items) {
  return items.reduce((total, item) => total + item.price * item.quantity, 0)
}

function calcDiscount(items, coupon) {
  if (!coupon) return 0
  const subtotal = calcSubtotal(items)
  if (coupon.type === 'percentage') return subtotal * (coupon.discount ?? coupon.value)
  if (coupon.type === 'fixed') return coupon.discount ?? coupon.value
  return 0
}

function calcShipping(items, coupon, shippingMethodId) {
  if (coupon?.type === 'free_shipping') return 0
  const subtotal = calcSubtotal(items)
  const method = SHIPPING_METHODS.find((m) => m.id === shippingMethodId) || SHIPPING_METHODS[0]
  if (subtotal > 50 && method.id === 'standard') return 0
  return method.price
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    isOpen: false,
    appliedCoupon: null,
    shippingMethodId: 'standard'
  }),

  getters: {
    itemCount: (state) => state.items.reduce((total, item) => total + item.quantity, 0),
    subtotal: (state) => calcSubtotal(state.items),
    discountAmount: (state) => calcDiscount(state.items, state.appliedCoupon),
    shipping: (state) => calcShipping(state.items, state.appliedCoupon, state.shippingMethodId),
    tax: (state) => {
      const taxable = Math.max(0, calcSubtotal(state.items) - calcDiscount(state.items, state.appliedCoupon))
      return taxable * TAX_RATE
    },
    grandTotal: (state) => {
      const subtotal = calcSubtotal(state.items)
      const discount = calcDiscount(state.items, state.appliedCoupon)
      const shipping = calcShipping(state.items, state.appliedCoupon, state.shippingMethodId)
      const tax = Math.max(0, subtotal - discount) * TAX_RATE
      return Math.max(0, subtotal - discount) + tax + shipping
    }
  },

  actions: {
    addItem(product, quantity = 1, selectedVariant = null) {
      const stock = product.stockCount ?? Infinity
      const existingItem = this.items.find(
        (item) =>
          item.id === product.id &&
          JSON.stringify(item.selectedVariant) === JSON.stringify(selectedVariant)
      )

      if (existingItem) {
        existingItem.quantity = Math.min(stock, existingItem.quantity + quantity)
      } else {
        this.items.push({
          ...product,
          quantity: Math.min(stock, quantity),
          selectedVariant,
          cartId: Date.now() + Math.random()
        })
      }

      this.saveToLocalStorage()
    },

    removeItem(cartId) {
      this.items = this.items.filter((item) => item.cartId !== cartId)
      this.saveToLocalStorage()
    },

    updateQuantity(cartId, quantity) {
      const item = this.items.find((i) => i.cartId === cartId)
      if (item) {
        const max = item.stockCount ?? Infinity
        item.quantity = Math.max(0, Math.min(max, quantity))
        if (item.quantity === 0) this.removeItem(cartId)
      }
      this.saveToLocalStorage()
    },

    clearCart() {
      this.items = []
      this.appliedCoupon = null
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

    setShippingMethod(id) {
      this.shippingMethodId = id
      this.saveToLocalStorage()
    },

    applyCoupon(code) {
      const coupon = validateCoupon(code)
      if (coupon) {
        this.appliedCoupon = coupon
        this.saveToLocalStorage()
      }
      return coupon
    },

    async applyCouponAsync(code) {
      const coupon = await validateCouponAsync(code)
      if (coupon) {
        this.appliedCoupon = coupon
        this.saveToLocalStorage()
      }
      return coupon
    },

    clearCoupon() {
      this.appliedCoupon = null
      this.saveToLocalStorage()
    },

    saveToLocalStorage() {
      if (typeof localStorage === 'undefined') return
      localStorage.setItem(
        'cart',
        JSON.stringify({
          items: this.items,
          appliedCoupon: this.appliedCoupon,
          shippingMethodId: this.shippingMethodId
        })
      )
    },

    loadFromLocalStorage() {
      if (typeof localStorage === 'undefined') return
      const saved = localStorage.getItem('cart')
      if (!saved) return
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          this.items = parsed
        } else {
          this.items = parsed.items || []
          this.appliedCoupon = parsed.appliedCoupon || null
          this.shippingMethodId = parsed.shippingMethodId || 'standard'
        }
      } catch {
        this.items = []
      }
    }
  }
})
