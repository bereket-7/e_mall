<template>
  <!-- Cart Sidebar Overlay -->
  <div
    v-if="cartStore.isOpen"
    class="fixed inset-0 z-50 overflow-hidden"
    @click="cartStore.closeCart"
  >
    <div class="absolute inset-0 bg-black bg-opacity-50"></div>
  </div>

  <!-- Cart Sidebar -->
  <div
    :class="[
      'fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300',
      cartStore.isOpen ? 'translate-x-0' : 'translate-x-full'
    ]"
  >
    <!-- Header -->
    <div class="flex items-center justify-between p-4 border-b border-gray-200">
      <h2 class="text-lg font-semibold text-gray-900">
        Shopping Cart ({{ cartStore.itemCount }})
      </h2>
      <button
        @click="cartStore.closeCart"
        class="p-2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <!-- Cart Items -->
    <div class="flex-1 overflow-y-auto p-4">
      <div v-if="cartStore.items.length === 0" class="text-center py-8">
        <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6"/>
        </svg>
        <p class="text-gray-500 mb-4">Your cart is empty</p>
        <button
          @click="cartStore.closeCart"
          class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Continue Shopping
        </button>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="item in cartStore.items"
          :key="item.cartId"
          class="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
        >
          <!-- Product Image -->
          <img
            :src="item.images[0]"
            :alt="item.name"
            class="w-16 h-16 object-cover rounded-md"
          >

          <!-- Product Details -->
          <div class="flex-1 min-w-0">
            <h3 class="text-sm font-medium text-gray-900 truncate">{{ item.name }}</h3>
            <p class="text-sm text-gray-500">{{ item.brand }}</p>
            
            <!-- Variants -->
            <div v-if="item.selectedVariant" class="text-xs text-gray-400 mt-1">
              <span v-for="(value, key) in item.selectedVariant" :key="key" class="mr-2">
                {{ key }}: {{ value }}
              </span>
            </div>

            <!-- Price and Quantity -->
            <div class="flex items-center justify-between mt-2">
              <span class="text-sm font-medium text-gray-900">${{ item.price }}</span>
              
              <!-- Quantity Controls -->
              <div class="flex items-center space-x-2">
                <button
                  @click="cartStore.updateQuantity(item.cartId, item.quantity - 1)"
                  class="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                  </svg>
                </button>
                <span class="text-sm font-medium w-8 text-center">{{ item.quantity }}</span>
                <button
                  @click="cartStore.updateQuantity(item.cartId, item.quantity + 1)"
                  class="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Remove Button -->
          <button
            @click="cartStore.removeItem(item.cartId)"
            class="p-1 text-red-500 hover:text-red-700 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div v-if="cartStore.items.length > 0" class="border-t border-gray-200 p-4 space-y-4">
      <!-- Order Summary -->
      <div class="space-y-2 text-sm">
        <div class="flex justify-between">
          <span>Subtotal</span>
          <span>${{ cartStore.subtotal.toFixed(2) }}</span>
        </div>
        <div class="flex justify-between">
          <span>Tax</span>
          <span>${{ cartStore.tax.toFixed(2) }}</span>
        </div>
        <div class="flex justify-between">
          <span>Shipping</span>
          <span v-if="cartStore.shipping === 0" class="text-green-600">Free</span>
          <span v-else>${{ cartStore.shipping.toFixed(2) }}</span>
        </div>
        <div class="flex justify-between font-semibold text-lg border-t border-gray-200 pt-2">
          <span>Total</span>
          <span>${{ cartStore.grandTotal.toFixed(2) }}</span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="space-y-2">
        <router-link
          to="/cart"
          @click="cartStore.closeCart"
          class="block w-full bg-gray-100 text-gray-900 text-center py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
        >
          View Cart
        </router-link>
        <router-link
          to="/checkout"
          @click="cartStore.closeCart"
          class="block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Checkout
        </router-link>
      </div>

      <!-- Continue Shopping -->
      <button
        @click="cartStore.closeCart"
        class="w-full text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors"
      >
        Continue Shopping
      </button>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '../../stores/cart'

const cartStore = useCartStore()
</script>