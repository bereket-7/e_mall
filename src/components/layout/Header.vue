<template>
  <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
    <!-- Top Bar -->
    <div class="bg-gray-900 text-white text-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-2">
          <div class="flex items-center space-x-6">
            <span>Free shipping on orders over $50</span>
            <span>|</span>
            <span>24/7 Customer Support</span>
          </div>
          <div class="flex items-center space-x-4">
            <select
              :value="ui.currency"
              @change="ui.setCurrency($event.target.value)"
              class="bg-transparent text-white text-sm border-none focus:outline-none"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
            <select
              :value="ui.locale"
              @change="onLocaleChange($event.target.value)"
              class="bg-transparent text-white text-sm border-none focus:outline-none"
            >
              <option value="en">EN</option>
              <option value="es">ES</option>
              <option value="fr">FR</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Header -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-4">
        <!-- Logo -->
        <router-link to="/" class="flex items-center">
          <div class="flex items-center">
            <div class="bg-blue-600 text-white rounded-lg p-2 mr-3">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
              </svg>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">E-Mall</h1>
              <p class="text-xs text-gray-500">Your Shopping Destination</p>
            </div>
          </div>
        </router-link>

        <!-- Search Bar -->
        <div class="flex-1 max-w-2xl mx-8">
          <div class="relative">
            <input
              v-model="searchQuery"
              @keyup.enter="performSearch"
              type="text"
              :placeholder="$t('searchPlaceholder')"
              class="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
            <button
              @click="performSearch"
              class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Header Actions -->
        <div class="flex items-center space-x-6">
          <!-- Wishlist -->
          <router-link
            to="/wishlist"
            class="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
            <span v-if="wishlistStore.itemCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {{ wishlistStore.itemCount }}
            </span>
          </router-link>

          <!-- Cart -->
          <button
            @click="cartStore.toggleCart"
            class="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6"/>
            </svg>
            <span v-if="cartStore.itemCount > 0" class="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {{ cartStore.itemCount }}
            </span>
          </button>

          <!-- User Menu -->
          <div class="relative" v-if="authStore.isAuthenticated">
            <button
              @click="showUserMenu = !showUserMenu"
              class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <img
                :src="authStore.user.avatar"
                :alt="authStore.user.name"
                class="w-8 h-8 rounded-full"
              >
              <span class="text-sm font-medium text-gray-700">{{ authStore.user.name }}</span>
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>

            <!-- User Dropdown -->
            <div
              v-if="showUserMenu"
              class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
            >
              <router-link to="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                My Profile
              </router-link>
              <router-link to="/orders" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Order History
              </router-link>
              <router-link to="/wishlist" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Wishlist
              </router-link>
              <div v-if="authStore.isAdmin" class="border-t border-gray-100">
                <router-link to="/admin" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Admin Dashboard
                </router-link>
              </div>
              <div class="border-t border-gray-100">
                <button
                  @click="logout"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          <!-- Login/Register -->
          <div v-else class="flex items-center space-x-4">
            <router-link
              to="/login"
              class="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Sign In
            </router-link>
            <router-link
              to="/register"
              class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign Up
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation Menu -->
    <nav class="border-t border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between py-3">
          <!-- Categories -->
          <div class="flex items-center space-x-8">
            <router-link
              to="/products"
              class="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              All Products
            </router-link>
            <router-link
              to="/products/electronics"
              class="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Electronics
            </router-link>
            <router-link
              to="/products/fashion"
              class="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Fashion
            </router-link>
            <router-link
              to="/products/home"
              class="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Home & Garden
            </router-link>
            <router-link
              to="/products/books"
              class="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Books
            </router-link>
            <router-link
              to="/products/sports"
              class="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Sports
            </router-link>
          </div>

          <!-- Special Offers -->
          <div class="flex items-center space-x-4">
            <span class="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
              🔥 Hot Deals
            </span>
            <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              ✨ New Arrivals
            </span>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../../stores/auth'
import { useCartStore } from '../../stores/cart'
import { useWishlistStore } from '../../stores/wishlist'
import { useProductStore } from '../../stores/products'
import { useUiStore } from '../../stores/ui'

const router = useRouter()
const { locale } = useI18n()
const authStore = useAuthStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const productStore = useProductStore()
const ui = useUiStore()

const searchQuery = ref('')
const showUserMenu = ref(false)

const onLocaleChange = (value) => {
  ui.setLocale(value)
  locale.value = value
}

const performSearch = () => {
  if (searchQuery.value.trim()) {
    productStore.setSearchQuery(searchQuery.value)
    router.push({ path: '/products', query: { q: searchQuery.value.trim() } })
  }
}

const logout = () => {
  authStore.logout()
  showUserMenu.value = false
  router.push('/')
}

document.addEventListener('click', (event) => {
  if (!event.target.closest('.relative')) {
    showUserMenu.value = false
  }
})
</script>