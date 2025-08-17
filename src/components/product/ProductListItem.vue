<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
    <div class="flex p-6">
      <!-- Product Image -->
      <div class="flex-shrink-0 relative">
        <img
          :src="product.images[0]"
          :alt="product.name"
          class="w-32 h-32 object-cover rounded-lg"
        >
        
        <!-- Discount Badge -->
        <div
          v-if="product.discount > 0"
          class="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold"
        >
          -{{ product.discount }}%
        </div>
      </div>
      
      <!-- Product Info -->
      <div class="flex-1 ml-6">
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <!-- Brand -->
            <p class="text-sm text-gray-500 mb-1">{{ product.brand }}</p>
            
            <!-- Product Name -->
            <router-link :to="`/product/${product.id}`">
              <h3 class="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors mb-2">
                {{ product.name }}
              </h3>
            </router-link>
            
            <!-- Description -->
            <p class="text-gray-600 mb-3 line-clamp-2">{{ product.description }}</p>
            
            <!-- Rating -->
            <div class="flex items-center mb-3">
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
                <span class="text-sm text-gray-500 ml-2">{{ product.rating }} ({{ product.reviewCount }} reviews)</span>
              </div>
            </div>
            
            <!-- Features -->
            <div class="flex flex-wrap gap-2 mb-4">
              <span
                v-for="feature in product.features.slice(0, 3)"
                :key="feature"
                class="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
              >
                {{ feature }}
              </span>
            </div>
          </div>
          
          <!-- Price and Actions -->
          <div class="text-right">
            <!-- Price -->
            <div class="mb-4">
              <div class="flex items-center justify-end space-x-2 mb-1">
                <span class="text-2xl font-bold text-gray-900">${{ product.price }}</span>
                <span
                  v-if="product.originalPrice > product.price"
                  class="text-lg text-gray-500 line-through"
                >
                  ${{ product.originalPrice }}
                </span>
              </div>
              
              <!-- Stock Status -->
              <div class="flex items-center justify-end">
                <div
                  :class="[
                    'w-2 h-2 rounded-full mr-1',
                    product.inStock ? 'bg-green-500' : 'bg-red-500'
                  ]"
                ></div>
                <span
                  :class="[
                    'text-sm font-medium',
                    product.inStock ? 'text-green-600' : 'text-red-600'
                  ]"
                >
                  {{ product.inStock ? 'In Stock' : 'Out of Stock' }}
                </span>
              </div>
              
              <!-- Stock Count Warning -->
              <div
                v-if="product.inStock && product.stockCount <= 10"
                class="text-xs text-orange-600 font-medium mt-1"
              >
                Only {{ product.stockCount }} left!
              </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="space-y-2">
              <button
                @click="addToCart"
                :disabled="!product.inStock"
                class="w-full bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {{ product.inStock ? 'Add to Cart' : 'Out of Stock' }}
              </button>
              
              <div class="flex space-x-2">
                <button
                  @click="toggleWishlist"
                  :class="[
                    'flex-1 px-4 py-2 rounded-lg font-medium transition-colors',
                    wishlistStore.isInWishlist(product.id)
                      ? 'bg-red-100 text-red-600 hover:bg-red-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  ]"
                >
                  <svg class="w-4 h-4 mr-1 inline" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
                  </svg>
                  {{ wishlistStore.isInWishlist(product.id) ? 'Saved' : 'Save' }}
                </button>
                
                <router-link
                  :to="`/product/${product.id}`"
                  class="flex-1 bg-gray-100 text-gray-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors text-center"
                >
                  View Details
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '../../stores/cart'
import { useWishlistStore } from '../../stores/wishlist'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const cartStore = useCartStore()
const wishlistStore = useWishlistStore()

const addToCart = () => {
  if (props.product.inStock) {
    cartStore.addItem(props.product, 1)
    cartStore.openCart()
    
    window.showNotification({
      type: 'success',
      title: 'Added to cart!',
      message: props.product.name
    })
  }
}

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
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>