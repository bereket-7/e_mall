<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <template v-if="isAdminRoute">
      <AdminLayout>
        <router-view />
      </AdminLayout>
    </template>
    <template v-else>
      <Header />
      <main class="flex-1">
        <router-view />
      </main>
      <Footer />
      <CartSidebar />
    </template>
    <NotificationToast />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { useCartStore } from './stores/cart'
import { useWishlistStore } from './stores/wishlist'
import { useProductStore } from './stores/products'
import Header from './components/layout/Header.vue'
import Footer from './components/layout/Footer.vue'
import CartSidebar from './components/cart/CartSidebar.vue'
import NotificationToast from './components/ui/NotificationToast.vue'
import AdminLayout from './components/layout/AdminLayout.vue'

const route = useRoute()
const authStore = useAuthStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const productStore = useProductStore()

const isAdminRoute = computed(() => route.path.startsWith('/admin'))

onMounted(async () => {
  await authStore.initializeAuth()
  cartStore.loadFromLocalStorage()
  await wishlistStore.loadFromLocalStorage()
  await productStore.fetchProducts({ page: 1, pageSize: 50 })
})
</script>

<style>
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: #f1f1f1;
}
::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}
</style>
