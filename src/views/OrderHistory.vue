<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Order History</h1>
      
      <div v-if="orders.length === 0" class="text-center py-16">
        <svg class="w-24 h-24 mx-auto text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">No orders yet</h2>
        <p class="text-gray-600 mb-8">When you place your first order, it will appear here.</p>
        <router-link
          to="/products"
          class="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Start Shopping
        </router-link>
      </div>

      <div v-else class="space-y-6">
        <div
          v-for="order in orders"
          :key="order.id"
          class="bg-white rounded-lg shadow-md p-6"
        >
          <!-- Order Header -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Order {{ order.id }}</h3>
              <p class="text-sm text-gray-600">Placed on {{ formatDate(order.date) }}</p>
            </div>
            <div class="mt-4 sm:mt-0 text-right">
              <p class="text-lg font-semibold text-gray-900">${{ order.total.toFixed(2) }}</p>
              <span
                :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  getStatusColor(order.status)
                ]"
              >
                {{ order.status.charAt(0).toUpperCase() + order.status.slice(1) }}
              </span>
            </div>
          </div>

          <!-- Order Items -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div
              v-for="item in order.items"
              :key="item.cartId"
              class="flex items-center space-x-3"
            >
              <img
                :src="item.images[0]"
                :alt="item.name"
                class="w-16 h-16 object-cover rounded-lg"
              >
              <div class="flex-1 min-w-0">
                <router-link
                  :to="`/product/${item.id}`"
                  class="text-sm font-medium text-gray-900 hover:text-blue-600 block truncate"
                >
                  {{ item.name }}
                </router-link>
                <p class="text-xs text-gray-500">Qty: {{ item.quantity }}</p>
                <p class="text-sm font-medium text-gray-900">${{ (item.price * item.quantity).toFixed(2) }}</p>
              </div>
            </div>
          </div>

          <!-- Order Actions -->
          <div class="flex flex-wrap gap-3">
            <router-link
              :to="`/track/${order.id}`"
              class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Track Order
            </router-link>
            <button
              v-if="order.status === 'delivered'"
              @click="reorderItems(order)"
              class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Reorder
            </button>
            <button
              class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Download Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCartStore } from '../stores/cart'

const cartStore = useCartStore()
const orders = ref([])

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getStatusColor = (status) => {
  switch (status) {
    case 'confirmed':
      return 'bg-blue-100 text-blue-800'
    case 'processing':
      return 'bg-yellow-100 text-yellow-800'
    case 'shipped':
      return 'bg-purple-100 text-purple-800'
    case 'delivered':
      return 'bg-green-100 text-green-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const reorderItems = (order) => {
  order.items.forEach(item => {
    cartStore.addItem(item, item.quantity)
  })
  
  cartStore.openCart()
  
  window.showNotification({
    type: 'success',
    title: 'Items added to cart',
    message: `${order.items.length} items from order ${order.id} have been added to your cart.`
  })
}

onMounted(() => {
  orders.value = JSON.parse(localStorage.getItem('orders') || '[]')
    .sort((a, b) => new Date(b.date) - new Date(a.date))
})
</script>