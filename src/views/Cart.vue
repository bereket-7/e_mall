<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <p class="text-gray-600 mt-2">
          {{ cartStore.itemCount }} {{ cartStore.itemCount === 1 ? 'item' : 'items' }} in your cart
        </p>
      </div>

      <div v-if="cartStore.items.length === 0" class="text-center py-16">
        <svg class="w-24 h-24 mx-auto text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6"/>
        </svg>
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
        <p class="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
        <router-link
          to="/products"
          class="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Continue Shopping
        </router-link>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Cart Items -->
        <div class="lg:col-span-2 space-y-4">
          <div
            v-for="item in cartStore.items"
            :key="item.cartId"
            class="bg-white rounded-lg shadow-md p-6"
          >
            <div class="flex items-center space-x-4">
              <!-- Product Image -->
              <img
                :src="item.images[0]"
                :alt="item.name"
                class="w-24 h-24 object-cover rounded-lg"
              >

              <!-- Product Details -->
              <div class="flex-1 min-w-0">
                <router-link
                  :to="`/product/${item.id}`"
                  class="text-lg font-semibold text-gray-900 hover:text-blue-600 block"
                >
                  {{ item.name }}
                </router-link>
                <p class="text-sm text-gray-500 mt-1">{{ item.brand }}</p>
                
                <!-- Variants -->
                <div v-if="item.selectedVariant" class="flex flex-wrap gap-2 mt-2">
                  <span
                    v-for="(value, key) in item.selectedVariant"
                    :key="key"
                    class="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                  >
                    {{ key }}: {{ value }}
                  </span>
                </div>

                <!-- Stock Status -->
                <div class="flex items-center mt-2">
                  <div
                    :class="[
                      'w-2 h-2 rounded-full mr-2',
                      item.inStock ? 'bg-green-500' : 'bg-red-500'
                    ]"
                  ></div>
                  <span
                    :class="[
                      'text-sm font-medium',
                      item.inStock ? 'text-green-600' : 'text-red-600'
                    ]"
                  >
                    {{ item.inStock ? 'In Stock' : 'Out of Stock' }}
                  </span>
                </div>
              </div>

              <!-- Price and Quantity -->
              <div class="text-right">
                <!-- Price -->
                <div class="text-lg font-bold text-gray-900 mb-2">
                  ${{ (item.price * item.quantity).toFixed(2) }}
                </div>
                
                <!-- Unit Price -->
                <div class="text-sm text-gray-500 mb-4">
                  ${{ item.price }} each
                </div>

                <!-- Quantity Controls -->
                <div class="flex items-center justify-end space-x-2 mb-4">
                  <button
                    @click="cartStore.updateQuantity(item.cartId, item.quantity - 1)"
                    class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                    </svg>
                  </button>
                  <span class="w-12 text-center font-medium">{{ item.quantity }}</span>
                  <button
                    @click="cartStore.updateQuantity(item.cartId, item.quantity + 1)"
                    :disabled="item.quantity >= item.stockCount"
                    class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                  </button>
                </div>

                <!-- Actions -->
                <div class="flex space-x-2">
                  <button
                    @click="moveToWishlist(item)"
                    class="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Save for later
                  </button>
                  <span class="text-gray-300">|</span>
                  <button
                    @click="cartStore.removeItem(item.cartId)"
                    class="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-md p-6 sticky top-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
            
            <!-- Coupon Code -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Promo Code
              </label>
              <div class="flex space-x-2">
                <input
                  v-model="couponCode"
                  type="text"
                  placeholder="Enter code"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                <button
                  @click="applyCoupon"
                  class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Apply
                </button>
              </div>
              <div v-if="appliedCoupon" class="mt-2 text-sm text-green-600">
                ✓ Coupon "{{ appliedCoupon.code }}" applied
              </div>
            </div>

            <!-- Order Breakdown -->
            <div class="space-y-3 mb-6">
              <div class="flex justify-between text-sm">
                <span>Subtotal ({{ cartStore.itemCount }} items)</span>
                <span>${{ cartStore.subtotal.toFixed(2) }}</span>
              </div>
              
              <div v-if="appliedCoupon" class="flex justify-between text-sm text-green-600">
                <span>Discount ({{ appliedCoupon.code }})</span>
                <span>-${{ discountAmount.toFixed(2) }}</span>
              </div>
              
              <div class="flex justify-between text-sm">
                <span>Tax</span>
                <span>${{ cartStore.tax.toFixed(2) }}</span>
              </div>
              
              <div class="flex justify-between text-sm">
                <span>Shipping</span>
                <span v-if="cartStore.shipping === 0" class="text-green-600">Free</span>
                <span v-else>${{ cartStore.shipping.toFixed(2) }}</span>
              </div>
              
              <div class="border-t border-gray-200 pt-3">
                <div class="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${{ finalTotal.toFixed(2) }}</span>
                </div>
              </div>
            </div>

            <!-- Checkout Button -->
            <router-link
              to="/checkout"
              class="block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors mb-4"
            >
              Proceed to Checkout
            </router-link>

            <!-- Continue Shopping -->
            <router-link
              to="/products"
              class="block w-full text-center text-blue-600 hover:text-blue-700 font-medium"
            >
              Continue Shopping
            </router-link>

            <!-- Security Icons -->
            <div class="mt-6 pt-6 border-t border-gray-200">
              <div class="flex items-center justify-center space-x-4 text-xs text-gray-500">
                <div class="flex items-center">
                  <svg class="w-4 h-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                  <span>Secure Checkout</span>
                </div>
                <div class="flex items-center">
                  <svg class="w-4 h-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                  </svg>
                  <span>Privacy Protected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCartStore } from '../stores/cart'
import { useWishlistStore } from '../stores/wishlist'

const cartStore = useCartStore()
const wishlistStore = useWishlistStore()

const couponCode = ref('')
const appliedCoupon = ref(null)

const discountAmount = computed(() => {
  if (!appliedCoupon.value) return 0
  
  if (appliedCoupon.value.type === 'percentage') {
    return cartStore.subtotal * appliedCoupon.value.discount
  } else {
    return appliedCoupon.value.discount
  }
})

const finalTotal = computed(() => {
  return cartStore.grandTotal - discountAmount.value
})

const applyCoupon = () => {
  if (!couponCode.value.trim()) return
  
  const coupon = cartStore.applyCoupon(couponCode.value.toUpperCase())
  
  if (coupon) {
    appliedCoupon.value = {
      code: couponCode.value.toUpperCase(),
      ...coupon
    }
    
    window.showNotification({
      type: 'success',
      title: 'Coupon applied!',
      message: `You saved $${discountAmount.value.toFixed(2)}`
    })
  } else {
    window.showNotification({
      type: 'error',
      title: 'Invalid coupon',
      message: 'Please check the coupon code and try again.'
    })
  }
}

const moveToWishlist = (item) => {
  wishlistStore.addItem(item)
  cartStore.removeItem(item.cartId)
  
  window.showNotification({
    type: 'success',
    title: 'Moved to wishlist',
    message: item.name
  })
}
</script>