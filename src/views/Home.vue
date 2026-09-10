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
                {{ $t('shopNow') }}
              </router-link>
              <a
                href="#features"
                class="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors text-center"
              >
                {{ $t('learnMore') }}
              </a>
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
    <section id="features" class="py-16 bg-white">
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
              <span class="text-2xl font-bold text-blue-600">{{ category.name.charAt(0) }}</span>
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
import { useNotification } from '../composables/useNotification'
import { subscribeNewsletter as subscribe } from '../services/newsletter'

const { notify } = useNotification()
const productStore = useProductStore()
const email = ref('')

const featuredProducts = computed(() => {
  return productStore.products.slice(0, 4)
})

const categories = computed(() => productStore.categories)

const subscribeNewsletter = async () => {
  if (!email.value) return
  try {
    await subscribe(email.value)
    notify({
      type: 'success',
      title: 'Subscribed!',
      message: 'Thank you for subscribing to our newsletter!'
    })
    email.value = ''
  } catch (e) {
    notify({ type: 'error', title: 'Subscription failed', message: e.message })
  }
}

onMounted(() => {
  if (productStore.products.length === 0) {
    productStore.fetchProducts({ pageSize: 50 })
  }
})
</script>