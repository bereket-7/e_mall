<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">My Wishlist</h1>
      
      <div v-if="wishlistStore.items.length === 0" class="text-center py-16">
        <svg class="w-24 h-24 mx-auto text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
        </svg>
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">Your wishlist is empty</h2>
        <p class="text-gray-600 mb-8">Save items you love to your wishlist and come back to them later.</p>
        <router-link
          to="/products"
          class="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Start Shopping
        </router-link>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="item in wishlistStore.items"
          :key="item.id"
          class="bg-white rounded-lg shadow-md overflow-hidden group"
        >
          <div class="relative">
            <img
              :src="item.images[0]"
              :alt="item.name"
              class="w-full h-48 object-cover"
            >
            <button
              @click="removeFromWishlist(item)"
              class="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
            >
              <svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
            </button>
          </div>
          
          <div class="p-4">
            <router-link
              :to="`/product/${item.id}`"
              class="text-lg font-semibold text-gray-900 hover:text-blue-600 block mb-2"
            >
              {{ item.name }}
            </router-link>
            <p class="text-gray-600 text-sm mb-2">{{ item.brand }}</p>
            
            <!-- Rating -->
            <div class="flex items-center mb-3">
              <div class="flex">
                <svg
                  v-for="i in 5"
                  :key="i"
                  :class="[
                    'w-4 h-4',
                    i <= Math.floor(item.rating) ? 'text-yellow-400' : 'text-gray-300'
                  ]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              </div>
              <span class="text-sm text-gray-600 ml-1">({{ item.reviewCount }})</span>
            </div>
            
            <!-- Price -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-2">
                <span class="text-xl font-bold text-gray-900">${{ item.price }}</span>
                <span
                  v-if="item.originalPrice > item.price"
                  class="text-sm text-gray-500 line-through"
                >
                  ${{ item.originalPrice }}
                </span>
              </div>
              <span
                v-if="item.discount > 0"
                class="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium"
              >
                {{ item.discount }}% off
              </span>
            </div>
            
            <!-- Stock Status -->
            <div class="flex items-center mb-4">
              <div
                :class="[
                  'w-2 h-2 rounded-full mr-2',
                  item.inStock ? 'bg-green-500' : 'bg-red-500'
                ]"
              ></div>
              <span
                :class="[
                  'text-sm font-medium',
                  item.inStock ? 'text-green-600' : 'text-red-600'
                ]"
              >
                {{ item.inStock ? 'In Stock' : 'Out of Stock' }}
              </span>
            </div>
            
            <!-- Actions -->
            <button
              @click="addToCart(item)"
              :disabled="!item.inStock"
              class="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {{ item.inStock ? 'Add to Cart' : 'Out of Stock' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useWishlistStore } from '../stores/wishlist'
import { useCartStore } from '../stores/cart'

const wishlistStore = useWishlistStore()
const cartStore = useCartStore()

const removeFromWishlist = (item) => {
  wishlistStore.removeItem(item.id)
  
  window.showNotification({
    type: 'info',
    title: 'Removed from wishlist',
    message: item.name
  })
}

const addToCart = (item) => {
  cartStore.addItem(item, 1)
  cartStore.openCart()
  
  window.showNotification({
    type: 'success',
    title: 'Added to cart!',
    message: item.name
  })
}
</script>