<template>
  <div v-if="product" class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Breadcrumb -->
      <nav class="flex items-center space-x-2 text-sm text-gray-500 mb-8">
        <router-link to="/" class="hover:text-blue-600">Home</router-link>
        <span>/</span>
        <router-link to="/products" class="hover:text-blue-600">Products</router-link>
        <span>/</span>
        <router-link :to="`/products/${product.category}`" class="hover:text-blue-600">
          {{ product.category }}
        </router-link>
        <span>/</span>
        <span class="text-gray-900">{{ product.name }}</span>
      </nav>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Product Images -->
        <div class="space-y-4">
          <!-- Main Image -->
          <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img
              :src="selectedImage"
              :alt="product.name"
              class="w-full h-full object-cover"
            >
          </div>
          
          <!-- Thumbnail Images -->
          <div class="flex space-x-2">
            <button
              v-for="(image, index) in product.images"
              :key="index"
              @click="selectedImage = image"
              :class="[
                'w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors',
                selectedImage === image ? 'border-blue-600' : 'border-gray-200'
              ]"
            >
              <img
                :src="image"
                :alt="`${product.name} ${index + 1}`"
                class="w-full h-full object-cover"
              >
            </button>
          </div>
        </div>

        <!-- Product Info -->
        <div class="space-y-6">
          <!-- Basic Info -->
          <div>
            <p class="text-sm text-gray-500 mb-2">{{ product.brand }}</p>
            <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ product.name }}</h1>
            
            <!-- Rating -->
            <div class="flex items-center mb-4">
              <div class="flex items-center">
                <div class="flex">
                  <svg
                    v-for="i in 5"
                    :key="i"
                    :class="[
                      'w-5 h-5',
                      i <= Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                    ]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                </div>
                <span class="text-sm text-gray-600 ml-2">
                  {{ product.rating }} ({{ product.reviewCount }} reviews)
                </span>
              </div>
            </div>
          </div>

          <!-- Price -->
          <div class="border-t border-b border-gray-200 py-6">
            <div class="flex items-center space-x-4">
              <span class="text-3xl font-bold text-gray-900">${{ product.price }}</span>
              <span
                v-if="product.originalPrice > product.price"
                class="text-xl text-gray-500 line-through"
              >
                ${{ product.originalPrice }}
              </span>
              <span
                v-if="product.discount > 0"
                class="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium"
              >
                Save {{ product.discount }}%
              </span>
            </div>
            
            <!-- Stock Status -->
            <div class="flex items-center mt-4">
              <div
                :class="[
                  'w-3 h-3 rounded-full mr-2',
                  product.inStock ? 'bg-green-500' : 'bg-red-500'
                ]"
              ></div>
              <span
                :class="[
                  'font-medium',
                  product.inStock ? 'text-green-600' : 'text-red-600'
                ]"
              >
                {{ product.inStock ? 'In Stock' : 'Out of Stock' }}
              </span>
              <span v-if="product.inStock && product.stockCount <= 10" class="text-orange-600 ml-4">
                Only {{ product.stockCount }} left!
              </span>
            </div>
          </div>

          <!-- Product Variants -->
          <div v-if="product.variants" class="space-y-4">
            <div
              v-for="variant in product.variants"
              :key="variant.name"
              class="space-y-2"
            >
              <label class="block text-sm font-medium text-gray-700">
                {{ variant.name }}
              </label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="option in variant.options"
                  :key="option"
                  @click="selectVariant(variant.name, option)"
                  :class="[
                    'px-4 py-2 border rounded-lg text-sm font-medium transition-colors',
                    selectedVariants[variant.name] === option
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  ]"
                >
                  {{ option }}
                </button>
              </div>
            </div>
          </div>

          <!-- Quantity and Actions -->
          <div class="space-y-4">
            <!-- Quantity Selector -->
            <div class="flex items-center space-x-4">
              <label class="text-sm font-medium text-gray-700">Quantity:</label>
              <div class="flex items-center border border-gray-300 rounded-lg">
                <button
                  @click="quantity = Math.max(1, quantity - 1)"
                  class="px-3 py-2 text-gray-600 hover:text-gray-800"
                >
                  -
                </button>
                <input
                  v-model="quantity"
                  type="number"
                  min="1"
                  :max="product.stockCount"
                  class="w-16 px-3 py-2 text-center border-0 focus:outline-none"
                >
                <button
                  @click="quantity = Math.min(product.stockCount, quantity + 1)"
                  class="px-3 py-2 text-gray-600 hover:text-gray-800"
                >
                  +
                </button>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex space-x-4">
              <button
                @click="addToCart"
                :disabled="!product.inStock"
                class="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {{ product.inStock ? 'Add to Cart' : 'Out of Stock' }}
              </button>
              
              <button
                @click="toggleWishlist"
                :class="[
                  'px-6 py-3 rounded-lg font-medium transition-colors',
                  wishlistStore.isInWishlist(product.id)
                    ? 'bg-red-100 text-red-600 hover:bg-red-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                ]"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
                </svg>
              </button>
            </div>

            <!-- Quick Actions -->
            <div class="flex space-x-4 text-sm">
              <button
                v-if="authStore.isAuthenticated"
                @click="buyNow"
                class="text-blue-600 hover:text-blue-700 font-medium"
              >
                Buy Now
              </button>
              <button class="text-gray-600 hover:text-gray-700 font-medium">
                Share
              </button>
            </div>
          </div>

          <!-- Features -->
          <div class="space-y-3">
            <h3 class="text-lg font-semibold text-gray-900">Key Features</h3>
            <ul class="space-y-2">
              <li
                v-for="feature in product.features"
                :key="feature"
                class="flex items-center text-gray-700"
              >
                <svg class="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                {{ feature }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Product Description and Details -->
      <div class="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Description -->
        <div class="lg:col-span-2 space-y-8">
          <div>
            <h2 class="text-2xl font-bold text-gray-900 mb-4">Description</h2>
            <p class="text-gray-700 leading-relaxed">{{ product.description }}</p>
          </div>

          <!-- Reviews Section -->
          <div>
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
            <div class="space-y-6">
              <!-- Review Summary -->
              <div class="bg-gray-50 p-6 rounded-lg">
                <div class="flex items-center space-x-4 mb-4">
                  <div class="text-4xl font-bold text-gray-900">{{ product.rating }}</div>
                  <div>
                    <div class="flex items-center mb-1">
                      <div class="flex">
                        <svg
                          v-for="i in 5"
                          :key="i"
                          :class="[
                            'w-5 h-5',
                            i <= Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                          ]"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      </div>
                    </div>
                    <p class="text-sm text-gray-600">Based on {{ product.reviewCount }} reviews</p>
                  </div>
                </div>
              </div>

              <!-- Mock Reviews -->
              <div class="space-y-4">
                <div
                  v-for="review in mockReviews"
                  :key="review.id"
                  class="border-b border-gray-200 pb-4"
                >
                  <div class="flex items-center space-x-4 mb-2">
                    <img
                      :src="review.avatar"
                      :alt="review.name"
                      class="w-10 h-10 rounded-full"
                    >
                    <div>
                      <h4 class="font-medium text-gray-900">{{ review.name }}</h4>
                      <div class="flex items-center">
                        <div class="flex">
                          <svg
                            v-for="i in 5"
                            :key="i"
                            :class="[
                              'w-4 h-4',
                              i <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                            ]"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                          </svg>
                        </div>
                        <span class="text-sm text-gray-500 ml-2">{{ review.date }}</span>
                      </div>
                    </div>
                  </div>
                  <p class="text-gray-700">{{ review.comment }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar Info -->
        <div class="space-y-6">
          <!-- Shipping Info -->
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="font-semibold text-gray-900 mb-4">Shipping & Returns</h3>
            <div class="space-y-3 text-sm text-gray-600">
              <div class="flex items-center">
                <svg class="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                Free shipping on orders over $50
              </div>
              <div class="flex items-center">
                <svg class="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                30-day return policy
              </div>
              <div class="flex items-center">
                <svg class="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                1-year warranty included
              </div>
            </div>
          </div>

          <!-- Related Products -->
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="font-semibold text-gray-900 mb-4">You Might Also Like</h3>
            <div class="space-y-4">
              <div
                v-for="relatedProduct in relatedProducts"
                :key="relatedProduct.id"
                class="flex space-x-3"
              >
                <img
                  :src="relatedProduct.images[0]"
                  :alt="relatedProduct.name"
                  class="w-16 h-16 object-cover rounded-lg"
                >
                <div class="flex-1">
                  <router-link
                    :to="`/product/${relatedProduct.id}`"
                    class="text-sm font-medium text-gray-900 hover:text-blue-600 line-clamp-2"
                  >
                    {{ relatedProduct.name }}
                  </router-link>
                  <p class="text-sm font-bold text-gray-900 mt-1">${{ relatedProduct.price }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Loading State -->
  <div v-else class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p class="text-gray-600">Loading product details...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '../stores/products'
import { useCartStore } from '../stores/cart'
import { useWishlistStore } from '../stores/wishlist'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const authStore = useAuthStore()

const selectedImage = ref('')
const selectedVariants = ref({})
const quantity = ref(1)

const product = computed(() => {
  return productStore.getProductById(route.params.id)
})

const relatedProducts = computed(() => {
  if (!product.value) return []
  return productStore.getRelatedProducts(product.value)
})

const mockReviews = [
  {
    id: 1,
    name: 'Sarah Johnson',
    rating: 5,
    date: '2 weeks ago',
    avatar: 'https://via.placeholder.com/40',
    comment: 'Excellent product! Exactly as described and arrived quickly. Highly recommend!'
  },
  {
    id: 2,
    name: 'Mike Chen',
    rating: 4,
    date: '1 month ago',
    avatar: 'https://via.placeholder.com/40',
    comment: 'Great quality and good value for money. Will definitely buy again.'
  },
  {
    id: 3,
    name: 'Emily Davis',
    rating: 5,
    date: '1 month ago',
    avatar: 'https://via.placeholder.com/40',
    comment: 'Love this product! Perfect for my needs and the customer service was excellent.'
  }
]

const selectVariant = (variantName, option) => {
  selectedVariants.value[variantName] = option
}

const addToCart = () => {
  if (product.value && product.value.inStock) {
    cartStore.addItem(product.value, quantity.value, selectedVariants.value)
    cartStore.openCart()
    
    window.showNotification({
      type: 'success',
      title: 'Added to cart!',
      message: `${quantity.value}x ${product.value.name}`
    })
  }
}

const toggleWishlist = () => {
  if (product.value) {
    wishlistStore.toggleItem(product.value)
    
    const message = wishlistStore.isInWishlist(product.value.id)
      ? 'Added to wishlist'
      : 'Removed from wishlist'
      
    window.showNotification({
      type: 'success',
      title: message,
      message: product.value.name
    })
  }
}

const buyNow = () => {
  if (product.value && product.value.inStock) {
    addToCart()
    router.push('/checkout')
  }
}

onMounted(() => {
  if (productStore.products.length === 0) {
    productStore.fetchProducts()
  }
  
  if (product.value) {
    selectedImage.value = product.value.images[0]
    
    // Initialize variant selections
    if (product.value.variants) {
      product.value.variants.forEach(variant => {
        selectedVariants.value[variant.name] = variant.options[0]
      })
    }
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>