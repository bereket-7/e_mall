<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Checkout</h1>
        <div class="flex items-center space-x-2 text-sm text-gray-500 mt-2">
          <router-link to="/cart" class="hover:text-blue-600">Cart</router-link>
          <span>→</span>
          <span class="text-gray-900">Checkout</span>
        </div>
      </div>

      <div v-if="cartStore.items.length === 0" class="text-center py-16">
        <svg class="w-24 h-24 mx-auto text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6"/>
        </svg>
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
        <p class="text-gray-600 mb-8">Add some items to your cart before checking out.</p>
        <router-link
          to="/products"
          class="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Continue Shopping
        </router-link>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Checkout Form -->
        <div class="space-y-8">
          <!-- Contact Information -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Contact Information</h2>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  v-model="form.email"
                  type="email"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="john@example.com"
                >
              </div>
              <div class="flex items-center">
                <input
                  v-model="form.subscribe"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                >
                <label class="ml-2 block text-sm text-gray-900">
                  Email me with news and offers
                </label>
              </div>
            </div>
          </div>

          <!-- Shipping Address -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Shipping Address</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  v-model="form.firstName"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  v-model="form.lastName"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <input
                  v-model="form.address"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  v-model="form.city"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                <input
                  v-model="form.zipCode"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
              </div>
            </div>
          </div>

          <!-- Payment Method -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Payment Method</h2>
            <div class="space-y-4">
              <div class="flex items-center">
                <input
                  v-model="form.paymentMethod"
                  value="card"
                  type="radio"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                >
                <label class="ml-3 block text-sm font-medium text-gray-700">
                  Credit/Debit Card
                </label>
              </div>
              
              <div v-if="form.paymentMethod === 'card'" class="ml-7 space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                  <input
                    v-model="form.cardNumber"
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                    <input
                      v-model="form.expiryDate"
                      type="text"
                      placeholder="MM/YY"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                    <input
                      v-model="form.cvv"
                      type="text"
                      placeholder="123"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                  </div>
                </div>
              </div>

              <div class="flex items-center">
                <input
                  v-model="form.paymentMethod"
                  value="paypal"
                  type="radio"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                >
                <label class="ml-3 block text-sm font-medium text-gray-700">
                  PayPal
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-md p-6 sticky top-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
            
            <!-- Order Items -->
            <div class="space-y-4 mb-6">
              <div
                v-for="item in cartStore.items"
                :key="item.cartId"
                class="flex items-center space-x-3"
              >
                <div class="relative">
                  <img
                    :src="item.images[0]"
                    :alt="item.name"
                    class="w-16 h-16 object-cover rounded-lg"
                  >
                  <div class="absolute -top-2 -right-2 bg-gray-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {{ item.quantity }}
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate">{{ item.name }}</p>
                  <p class="text-sm text-gray-500">{{ item.brand }}</p>
                </div>
                <div class="text-sm font-medium text-gray-900">
                  ${{ (item.price * item.quantity).toFixed(2) }}
                </div>
              </div>
            </div>

            <!-- Order Totals -->
            <div class="space-y-2 mb-6 pt-4 border-t border-gray-200">
              <div class="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${{ cartStore.subtotal.toFixed(2) }}</span>
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
              <div class="flex justify-between text-lg font-semibold pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>${{ cartStore.grandTotal.toFixed(2) }}</span>
              </div>
            </div>

            <!-- Place Order Button -->
            <button
              type="submit"
              :disabled="loading"
              class="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
            >
              <span v-if="loading" class="flex items-center justify-center">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </span>
              <span v-else>Place Order</span>
            </button>

            <!-- Security Info -->
            <div class="text-center text-xs text-gray-500">
              <div class="flex items-center justify-center space-x-2 mb-2">
                <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <span>Secure SSL encrypted checkout</span>
              </div>
              <p>Your payment information is safe and secure</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'

const router = useRouter()
const cartStore = useCartStore()

const loading = ref(false)

const form = ref({
  email: '',
  subscribe: false,
  firstName: '',
  lastName: '',
  address: '',
  city: '',
  zipCode: '',
  paymentMethod: 'card',
  cardNumber: '',
  expiryDate: '',
  cvv: ''
})

const handleSubmit = async () => {
  loading.value = true
  
  try {
    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Generate order ID
    const orderId = 'ORD' + Date.now()
    
    // Save order to localStorage (demo purposes)
    const order = {
      id: orderId,
      items: cartStore.items,
      total: cartStore.grandTotal,
      shippingAddress: {
        firstName: form.value.firstName,
        lastName: form.value.lastName,
        address: form.value.address,
        city: form.value.city,
        zipCode: form.value.zipCode
      },
      status: 'confirmed',
      date: new Date().toISOString()
    }
    
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]')
    existingOrders.push(order)
    localStorage.setItem('orders', JSON.stringify(existingOrders))
    
    // Clear cart
    cartStore.clearCart()
    
    window.showNotification({
      type: 'success',
      title: 'Order placed successfully!',
      message: `Order ${orderId} has been confirmed.`
    })
    
    // Redirect to order tracking
    router.push(`/track/${orderId}`)
    
  } catch (error) {
    window.showNotification({
      type: 'error',
      title: 'Order failed',
      message: 'There was an error processing your order. Please try again.'
    })
  } finally {
    loading.value = false
  }
}
</script>