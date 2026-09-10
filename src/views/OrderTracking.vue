<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto px-4 py-8">
      <div v-if="!order" class="bg-white rounded-lg shadow p-8 text-center">
        <h1 class="text-xl font-semibold mb-2">Order not found</h1>
        <router-link to="/orders" class="text-blue-600">Back to orders</router-link>
      </div>
      <template v-else>
        <div class="flex justify-between items-start mb-8">
          <div>
            <h1 class="text-3xl font-bold">Track {{ order.id }}</h1>
            <p class="text-gray-600">Placed {{ formatDate(order.date) }}</p>
          </div>
          <span :class="['px-3 py-1 rounded-full text-sm', getStatusColor(order.status)]">{{
            order.status
          }}</span>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <ol class="space-y-4">
            <li v-for="step in timeline" :key="step.status" class="flex gap-4">
              <div
                :class="[
                  'w-8 h-8 rounded-full flex items-center justify-center text-white text-sm',
                  step.completed || step.current ? 'bg-blue-600' : 'bg-gray-300'
                ]"
              >
                ✓
              </div>
              <div>
                <p class="font-medium">{{ step.title }}</p>
                <p class="text-sm text-gray-600">{{ step.description }}</p>
                <p v-if="step.date" class="text-xs text-gray-400">{{ formatDateTime(step.date) }}</p>
              </div>
            </li>
          </ol>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 class="font-semibold mb-4">Items</h2>
          <div v-for="(item, i) in order.items" :key="i" class="flex justify-between py-2 border-b text-sm">
            <span>{{ item.name || `Product #${item.id}` }} × {{ item.quantity }}</span>
            <span>${{ Number(item.price || 0).toFixed(2) }}</span>
          </div>
          <div class="flex justify-between font-semibold mt-4">
            <span>Total</span>
            <span>${{ Number(order.total).toFixed(2) }}</span>
          </div>
        </div>

        <div class="flex gap-3">
          <button class="bg-blue-600 text-white px-4 py-2 rounded-lg" @click="reorderItems">Reorder</button>
          <button
            v-if="['confirmed', 'processing'].includes(order.status)"
            class="border px-4 py-2 rounded-lg text-red-600"
            @click="cancel"
          >
            Cancel order
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'
import { useNotification } from '../composables/useNotification'
import { fetchOrderById, cancelOrder } from '../services/orders'

const route = useRoute()
const cartStore = useCartStore()
const authStore = useAuthStore()
const { notify } = useNotification()
const order = ref(null)

const timeline = computed(() => {
  if (!order.value) return []
  const status = order.value.status
  const orderDate = order.value.date
  const steps = [
    {
      status: 'confirmed',
      title: 'Order Confirmed',
      description: 'We received your order',
      completed: true,
      current: status === 'confirmed',
      date: orderDate
    },
    {
      status: 'processing',
      title: 'Processing',
      description: 'Preparing your items',
      completed: ['processing', 'shipped', 'delivered'].includes(status),
      current: status === 'processing',
      date: ['processing', 'shipped', 'delivered'].includes(status) ? orderDate : null
    },
    {
      status: 'shipped',
      title: 'Shipped',
      description: 'On the way',
      completed: ['shipped', 'delivered'].includes(status),
      current: status === 'shipped',
      date: ['shipped', 'delivered'].includes(status) ? orderDate : null
    },
    {
      status: 'delivered',
      title: 'Delivered',
      description: 'Delivered successfully',
      completed: status === 'delivered',
      current: status === 'delivered',
      date: status === 'delivered' ? orderDate : null
    }
  ]
  if (status === 'cancelled') {
    return [
      {
        status: 'cancelled',
        title: 'Cancelled',
        description: 'This order was cancelled',
        completed: true,
        current: true,
        date: orderDate
      }
    ]
  }
  return steps
})

const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
const formatDateTime = (date) =>
  new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })

const getStatusColor = (status) => {
  const map = {
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-yellow-100 text-yellow-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return map[status] || 'bg-gray-100 text-gray-800'
}

const reorderItems = () => {
  ;(order.value.items || []).forEach((item) => cartStore.addItem(item, item.quantity || 1))
  cartStore.openCart()
  notify({ type: 'success', title: 'Items added to cart' })
}

const cancel = async () => {
  try {
    order.value = await cancelOrder(order.value.id, authStore.user?.id)
    notify({ type: 'success', title: 'Order cancelled' })
  } catch (e) {
    notify({ type: 'error', title: 'Cannot cancel', message: e.message })
  }
}

onMounted(async () => {
  order.value = await fetchOrderById(route.params.orderId)
})
</script>
