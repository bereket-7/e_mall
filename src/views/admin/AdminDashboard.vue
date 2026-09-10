<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div v-for="stat in statsCards" :key="stat.label" class="bg-white rounded-lg shadow-md p-6">
        <p class="text-sm font-medium text-gray-600">{{ stat.label }}</p>
        <p class="text-2xl font-bold text-gray-900">{{ stat.value }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-lg font-semibold mb-4">Quick Actions</h2>
        <div class="space-y-3">
          <router-link
            v-for="link in quickLinks"
            :key="link.to"
            :to="link.to"
            class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
          >
            {{ link.label }}
          </router-link>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-lg font-semibold mb-4">Recent Orders</h2>
        <div v-if="!stats.recentOrders?.length" class="text-gray-500">No recent orders</div>
        <div
          v-for="order in stats.recentOrders"
          :key="order.id"
          class="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2"
        >
          <div>
            <p class="font-medium">{{ order.id }}</p>
            <p class="text-sm text-gray-600">{{ order.customer }}</p>
          </div>
          <div class="text-right">
            <p class="font-medium">${{ Number(order.total || 0).toFixed(2) }}</p>
            <span class="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800">{{
              order.status
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { fetchDashboardStats } from '../../services/admin'

const stats = ref({
  totalSales: 0,
  totalOrders: 0,
  totalProducts: 0,
  totalCustomers: 0,
  recentOrders: []
})

const statsCards = computed(() => [
  { label: 'Total Sales', value: `$${Number(stats.value.totalSales).toFixed(2)}` },
  { label: 'Total Orders', value: stats.value.totalOrders },
  { label: 'Total Products', value: stats.value.totalProducts },
  { label: 'Total Customers', value: stats.value.totalCustomers }
])

const quickLinks = [
  { to: '/admin/products', label: 'Manage Products' },
  { to: '/admin/orders', label: 'View Orders' },
  { to: '/admin/customers', label: 'Manage Customers' },
  { to: '/admin/reports', label: 'Reports' }
]

onMounted(async () => {
  stats.value = await fetchDashboardStats()
})
</script>
