<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="order" class="space-y-8">
        <!-- Order Header -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Order {{ order.id }}</h1>
              <p class="text-gray-600 mt-1">Placed on {{ formatDate(order.date) }}</p>
            </div>
            <div class="mt-4 sm:mt-0">
              <span
                :class="[
                  'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
                  getStatusColor(order.status)
                ]"
              >
                {{ order.status.charAt(0).toUpperCase() + order.status.slice(1) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Order Progress -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-6">Order Progress</h2>
          
          <div class="relative">
            <!-- Progress Line -->
            <div class="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-200"></div>
            
            <div class="space-y-8">
              <div
                v-for="(step, index) in trackingSteps"
                :key="step.status"
                class="relative flex items-start"
              >
                <!-- Status Dot -->
                <div
                  :class="[
                    'flex items-center justify-center w-8 h-8 rounded-full border-2 bg-white',
                    step.completed
                      ? 'border-green-500 text-green-500'
                      : step.current
                      ? 'border-blue-500 text-blue-500'
                      : 'border-gray-300 text-gray-300'
                  ]"
                >
                  <svg v-if="step.completed" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  <div v-else-if="step.current" class="w-2 h-2 bg-current rounded-full"></div>
                  <div v-else class="w-2 h-2 bg-current rounded-full"></div>
                </div>
                
                <!-- Status Content -->
                <div class="ml-4 flex-1">
                  <h3
                    :class="[
                      'text-sm font-medium',
                      step.completed || step.current ? 'text-gray-900' : 'text-gray-500'
                    ]"
                  >
                    {{ step.title }}
                  </h3>
                  <p
                    :class="[
                      'text-sm mt-1',
                      step.completed || step.current ? 'text-gray-600' : 'text-gray-400'
                    ]"
                  >
                    {{ step.description }}
                  </p>
                  <p v-if="step.date" class="text-xs text-gray-500 mt-1">
                    {{ formatDateTime(step.date) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Items -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-6">Order Items</h2>
          
          <div class="space-y-4">
            <div
              v-for="item in order.items"
              :key="item.cartId"
              class="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
            >
              <img
                :src="item.images[0]"
                :alt="item.name"
                class="w-16 h-16 object-cover rounded-lg"
              >
              <div class="flex-1">
                <router-link
                  :to="`/product/${item.id}`"
                  class="text-lg font-medium text-gray-900 hover:text-blue-600"
                >
                  {{ item.name }}
                </router-link>
                <p class="text-sm text-gray-600">{{ item.brand }}</p>
                <p class="text-sm text-gray-600">Quantity: {{ item.quantity }}</p>
              </div>
              <div class="text-right">
                <p class="text-lg font-semibold text-gray-900">
                  ${{ (item.price * item.quantity).toFixed(2) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="mt-6 pt-6 border-t border-gray-200">
            <div class="flex justify-between text-lg font-semibold text-gray-900">
              <span>Total</span>
              <span>${{ order.total.toFixed(2) }}</span>
            </div>
          </div>
        </div>

        <!-- Shipping Address -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h2>
          <div class="text-gray-600">
            <p>{{ order.shippingAddress.firstName }} {{ order.shippingAddress.lastName }}</p>
            <p>{{ order.shippingAddress.address }}</p>
            <p>{{ order.shippingAddress.city }}, {{ order.shippingAddress.zipCode }}</p>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-wrap gap-4">
          <router-link
            to="/orders"
            class="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            ← Back to Orders
          </router-link>
          <button
            v-if="order.status === 'delivered'"
            @click="reorderItems"
            class="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Reorder Items
          </button>
        </div>
      </div>

      <!-- Order Not Found -->
      <div v-else class="text-center py-16">
        <svg class="w-24 h-24 mx-auto text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">Order not found</h2>
        <p class="text-gray-600 mb-8">The order you're looking for doesn't exist or has been removed.</p>
        <router-link
          to="/orders"
          class="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          View All Orders
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from '../stores/cart'

const route = useRoute()
const cartStore = useCartStore()

const order = ref(null)

const trackingSteps = computed(() => {
  if (!order.value) return []
  
  const steps = [
    {
      status: 'confirmed',
      title: 'Order Confirmed',
      description: 'Your order has been received and confirmed',
      completed: true,
      current: false,
      date: order.value.date
    },
    {
      status: 'processing',
      title: 'Processing',
      description: 'Your order is being prepared for shipment',
      completed: ['processing', 'shipped', 'delivered'].includes(order.value.status),
      current: order.value.status === 'processing',
      date: order.value.status !== 'confirmed' ? order.value.date : null
    },
    {
      status: 'shipped',
      title: 'Shipped',
      description: 'Your order is on its way to you',
      completed: ['shipped', 'delivered'].includes(order.value.status),
      current: order.value.status === 'shipped',
      date: ['shipped', 'delivered'].includes(order.value.status) ? order.value.date : null
    },
    {
      status: 'delivered',
      title: 'Delivered',
      description: 'Your order has been delivered successfully',
      completed: order.value.status === 'delivered',
      current: order.value.status === 'delivered',
      date: order.value.status === 'delivered' ? order.value.date : null
    }
  ]
  
  return steps
})

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatDateTime = (date) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
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

const reorderItems = () => {
  order.value.items.forEach(item => {
    cartStore.addItem(item, item.quantity)
  })
  
  cartStore.openCart()
  
  window.showNotification({
    type: 'success',
    title: 'Items added to cart',
    message: `${order.value.items.length} items have been added to your cart.`
  })
}

onMounted(() => {
  const orderId = route.params.orderId
  const orders = JSON.parse(localStorage.getItem('orders') || '[]')
  order.value = orders.find(o => o.id === orderId) || null
})
</script>