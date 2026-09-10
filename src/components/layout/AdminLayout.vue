<template>
  <div class="min-h-screen flex bg-gray-100">
    <aside class="w-64 bg-gray-900 text-white flex flex-col">
      <div class="p-6 border-b border-gray-800">
        <router-link to="/admin" class="text-xl font-bold">E-Mall Admin</router-link>
      </div>
      <nav class="flex-1 p-4 space-y-1">
        <router-link
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-800"
          active-class="bg-blue-600 hover:bg-blue-600"
        >
          {{ link.label }}
        </router-link>
      </nav>
      <div class="p-4 border-t border-gray-800">
        <router-link to="/" class="text-sm text-gray-300 hover:text-white">← Back to store</router-link>
      </div>
    </aside>
    <div class="flex-1 overflow-auto">
      <slot />
    </div>
  </div>
</template>

<script setup>
const links = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/customers', label: 'Customers' },
  { to: '/admin/coupons', label: 'Coupons' },
  { to: '/admin/reviews', label: 'Reviews' },
  { to: '/admin/reports', label: 'Reports' }
]
</script>
