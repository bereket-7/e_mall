<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div class="space-y-8">
            <h1 class="text-4xl md:text-6xl font-bold leading-tight">
              Welcome to
              <span class="block text-yellow-300">E-Mall</span>
            </h1>
            <p class="text-xl text-blue-100">
              Discover amazing products at unbeatable prices. Shop electronics, fashion, home goods, and more with fast shipping and secure checkout.
            </p>
            <div class="flex flex-col sm:flex-row gap-4">
              <router-link
                to="/products"
                class="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center"
              >
                Shop Now
              </router-link>
              <button class="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                Learn More
              </button>
            </div>
          </div>
          <div class="relative">
            <img
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600"
              alt="Shopping"
              class="rounded-lg shadow-2xl"
            >
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Why Choose E-Mall?</h2>
          <p class="text-xl text-gray-600">Experience the best online shopping with our premium features</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div class="text-center space-y-4">
            <div class="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900">Free Shipping</h3>
            <p class="text-gray-600">Free delivery on orders over $50. Fast and reliable shipping worldwide.</p>
          </div>
          
          <div class="text-center space-y-4">
            <div class="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900">Quality Guarantee</h3>
            <p class="text-gray-600">30-day money-back guarantee on all products. Shop with confidence.</p>
          </div>
          
          <div class="text-center space-y-4">
            <div class="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900">24/7 Support</h3>
            <p class="text-gray-600">Round-the-clock customer support via chat, email, and phone.</p>
          </div>
          
          <div class="text-center space-y-4">
            <div class="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900">Secure Payment</h3>
            <p class="text-gray-600">SSL encrypted checkout with multiple payment options for your security.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
          <p class="text-xl text-gray-600">Discover our handpicked selection of amazing products</p>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" v-if="!productStore.loading">
          <ProductCard
            v-for="product in featuredProducts"
            :key="product.id"
            :product="product"
          />
        </div>
        
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="i in 4" :key="i" class="bg-white rounded-lg shadow-md p-4 animate-pulse">
            <div class="bg-gray-300 h-48 rounded mb-4"></div>
            <div class="bg-gray-300 h-4 rounded mb-2"></div>
            <div class="bg-gray-300 h-4 rounded w-3/4"></div>
          </div>
        </div>
        
        <div class="text-center mt-12">
          <router-link
            to="/products"
            class="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            View All Products
          </router-link>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
          <p class="text-xl text-gray-600">Explore our wide range of product categories</p>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <router-link
            v-for="category in categories"
            :key="category.id"
            :to="`/products/${category.id}`"
            class="group text-center p-6 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <div class="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
              <component :is="category.icon" class="w-8 h-8 text-blue-600" />
            </div>
            <h3 class="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {{ category.name }}
            </h3>
            <p class="text-sm text-gray-500 mt-1">{{ category.count }} items</p>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Newsletter Section -->
    <section class="py-16 bg-blue-600">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold text-white mb-4">Stay Updated</h2>
        <p class="text-xl text-blue-100 mb-8">Subscribe to our newsletter for exclusive deals and updates</p>
        
        <form @submit.prevent="subscribeNewsletter" class="max-w-md mx-auto flex gap-4">
          <input
            v-model="email"
            type="email"
            placeholder="Enter your email"
            class="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            required
          >
          <button
            type="submit"
            class="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProductStore } from '../stores/products'
import ProductCard from '../components/product/ProductCard.vue'

const productStore = useProductStore()
const email = ref('')

const featuredProducts = computed(() => {
  return productStore.products.slice(0, 4)
})

const categories = [
  {
    id: 'electronics',
    name: 'Electronics',
    count: 4,
    icon: 'DeviceTabletIcon'
  },
  {
    id: 'fashion',
    name: 'Fashion',
    count: 2,
    icon: 'ShirtIcon'
  },
  {
    id: 'home',
    name: 'Home & Garden',
    count: 0,
    icon: 'HomeIcon'
  },
  {
    id: 'books',
    name: 'Books',
    count: 0,
    icon: 'BookIcon'
  },
  {
    id: 'sports',
    name: 'Sports',
    count: 0,
    icon: 'BeakerIcon'
  }
]

// Mock icons as simple SVG components
const DeviceTabletIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a1 1 0 001-1V4a1 1 0 00-1-1H8a1 1 0 00-1 1v16a1 1 0 001 1z"/></svg>`
}

const ShirtIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>`
}

const HomeIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>`
}

const BookIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>`
}

const BeakerIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547A1.98 1.98 0 004 17.5V18a2 2 0 002 2h12a2 2 0 002-2v-.5a1.98 1.98 0 00-.572-1.072z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v7M15 11l1 5H8l1-5"/></svg>`
}

const subscribeNewsletter = () => {
  if (email.value) {
    window.showNotification({
      type: 'success',
      title: 'Subscribed!',
      message: 'Thank you for subscribing to our newsletter!'
    })
    email.value = ''
  }
}

onMounted(() => {
  if (productStore.products.length === 0) {
    productStore.fetchProducts()
  }
})
</script>