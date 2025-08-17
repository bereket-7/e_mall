<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <Header />
    
    <!-- Main Content -->
    <main class="flex-1">
      <router-view />
    </main>
    
    <!-- Footer -->
    <Footer />
    
    <!-- Cart Sidebar -->
    <CartSidebar />
    
    <!-- Notification Toast -->
    <NotificationToast />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import { useCartStore } from './stores/cart'
import { useWishlistStore } from './stores/wishlist'
import { useProductStore } from './stores/products'
import Header from './components/layout/Header.vue'
import Footer from './components/layout/Footer.vue'
import CartSidebar from './components/cart/CartSidebar.vue'
import NotificationToast from './components/ui/NotificationToast.vue'

const authStore = useAuthStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const productStore = useProductStore()

onMounted(() => {
  // Initialize stores
  authStore.initializeAuth()
  cartStore.loadFromLocalStorage()
  wishlistStore.loadFromLocalStorage()
  productStore.fetchProducts()
})
</script>

<style>
/* Global styles */
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}

/* Custom scrollbar */
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

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from {
  transform: translateX(100%);
}

.slide-leave-to {
  transform: translateX(100%);
}
</style>