<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-5xl mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">Order History</h1>
      <div v-if="!orders.length" class="bg-white rounded-lg shadow p-8 text-center text-gray-600">
        You have no orders yet.
        <router-link to="/products" class="block mt-4 text-blue-600">Start shopping</router-link>
      </div>
      <div v-for="order in orders" :key="order.id" class="bg-white rounded-lg shadow-md p-6 mb-4">
        <div class="flex justify-between items-start">
          <div>
            <h2 class="text-lg font-semibold">{{ order.id }}</h2>
            <p class="text-sm text-gray-600">{{ formatDate(order.date) }}</p>
            <p class="text-sm mt-2">{{ order.items?.length || 0 }} items</p>
          </div>
          <div class="text-right">
            <p class="font-semibold">${{ Number(order.total).toFixed(2) }}</p>
            <span class="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">{{ order.status }}</span>
          </div>
        </div>
        <div class="mt-4 flex gap-4 text-sm">
          <router-link :to="`/track/${order.id}`" class="text-blue-600">Track</router-link>
          <button class="text-blue-600" @click="reorder(order)">Reorder</button>
          <button
            v-if="['confirmed', 'processing'].includes(order.status)"
            class="text-red-600"
            @click="cancel(order.id)"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'
import { useNotification } from '../composables/useNotification'
import { fetchOrdersForUser, cancelOrder } from '../services/orders'

const authStore = useAuthStore()
const cartStore = useCartStore()
const { notify } = useNotification()
const orders = ref([])

const formatDate = (d) => new Date(d).toLocaleDateString()

const load = async () => {
  orders.value = await fetchOrdersForUser(authStore.user?.id)
}

const reorder = (order) => {
  ;(order.items || []).forEach((item) => cartStore.addItem(item, item.quantity || 1))
  cartStore.openCart()
  notify({ type: 'success', title: 'Items added to cart' })
}

const cancel = async (id) => {
  try {
    await cancelOrder(id, authStore.user?.id)
    notify({ type: 'success', title: 'Order cancelled' })
    await load()
  } catch (e) {
    notify({ type: 'error', title: 'Cannot cancel', message: e.message })
  }
}

onMounted(load)
</script>
