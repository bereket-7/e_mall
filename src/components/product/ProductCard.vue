<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
    <!-- Product Image -->
    <div class="relative overflow-hidden">
      <img
        :src="product.images[0]"
        :alt="product.name"
        class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
      >
      
      <!-- Discount Badge -->
      <div
        v-if="product.discount > 0"
        class="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold"
      >
        -{{ product.discount }}%
      </div>
      
      <!-- Wishlist Button -->
      <button
        @click.prevent="toggleWishlist"
        :class="[
          'absolute top-2 right-2 p-2 rounded-full transition-colors',
          wishlistStore.isInWishlist(product.id)
            ? 'bg-red-500 text-white'
            : 'bg-white text-gray-400 hover:text-red-500'
        ]"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
        </svg>
      </button>
      
      <!-- Quick Actions -->
      <div class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
        <button
          @click.prevent="quickView"
          class="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
        >
          Quick View
        </button>
        <button
          @click.prevent="quickAddToCart"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </div>
    
    <!-- Product Info -->
    <div class="p-4">
      <!-- Brand -->
      <p class="text-sm text-gray-500 mb-1">{{ product.brand }}</p>
      
      <!-- Product Name -->
      <router-link :to="`/product/${product.id}`">
        <h3 class="font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2">
          {{ product.name }}
        </h3>
      </router-link>
      
      <!-- Rating -->
      <div class="flex items-center mb-2">
        <div class="flex items-center">
          <div class="flex">
            <svg
              v-for="i in 5"
              :key="i"
              :class="[
                'w-4 h-4',
                i <= Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
              ]"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
          </div>
          <span class="text-sm text-gray-500 ml-1">({{ product.reviewCount }})</span>
        </div>
      </div>
      
      <!-- Price -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <span class="text-lg font-bold text-gray-900">${{ product.price }}</span>
          <span
            v-if="product.originalPrice > product.price"
            class="text-sm text-gray-500 line-through"
          >
            ${{ product.originalPrice }}
          </span>
        </div>
        
        <!-- Stock Status -->
        <div class="flex items-center">
          <div
            :class="[
              'w-2 h-2 rounded-full mr-1',
              product.inStock ? 'bg-green-500' : 'bg-red-500'
            ]"
          ></div>
          <span
            :class="[
              'text-xs font-medium',
              product.inStock ? 'text-green-600' : 'text-red-600'
            ]"
          >
            {{ product.inStock ? 'In Stock' : 'Out of Stock' }}
          </span>
        </div>
      </div>
      
      <!-- Stock Count Warning -->
      <div
        v-if="product.inStock && product.stockCount <= 10"
        class="mt-2 text-xs text-orange-600 font-medium"
      >
        Only {{ product.stockCount }} left in stock!
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useCartStore } from '../../stores/cart'
import { useWishlistStore } from '../../stores/wishlist'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const router = useRouter()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()

const toggleWishlist = () => {
  wishlistStore.toggleItem(props.product)
  
  const message = wishlistStore.isInWishlist(props.product.id)
    ? 'Added to wishlist'
    : 'Removed from wishlist'
    
  window.showNotification({
    type: 'success',
    title: message,
    message: props.product.name
  })
}

const quickView = () => {
  router.push(`/product/${props.product.id}`)
}

const quickAddToCart = () => {
  if (props.product.inStock) {
    cartStore.addItem(props.product, 1)
    cartStore.openCart()
    
    window.showNotification({
      type: 'success',
      title: 'Added to cart!',
      message: props.product.name
    })
  } else {
    window.showNotification({
      type: 'error',
      title: 'Out of stock',
      message: 'This product is currently unavailable'
    })
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>