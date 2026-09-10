<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="space-y-6">
      <!-- Search -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Search Products</label>
        <input
          v-model="searchQuery"
          @input="updateSearch"
          type="text"
          placeholder="Search by name, brand..."
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
      </div>

      <!-- Categories -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-3">Categories</label>
        <div class="space-y-2">
          <label class="flex items-center">
            <input
              v-model="selectedCategory"
              value=""
              type="radio"
              class="text-blue-600 focus:ring-blue-500"
            >
            <span class="ml-2 text-sm text-gray-700">All Categories</span>
          </label>
          <label
            v-for="category in productStore.categories"
            :key="category.id"
            class="flex items-center"
          >
            <input
              v-model="selectedCategory"
              :value="category.id"
              type="radio"
              class="text-blue-600 focus:ring-blue-500"
            >
            <span class="ml-2 text-sm text-gray-700">
              {{ category.name }} ({{ category.count }})
            </span>
          </label>
        </div>
      </div>

      <!-- Price Range -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-3">Price Range</label>
        <div class="space-y-3">
          <div class="flex items-center space-x-2">
            <input
              v-model="priceRange[0]"
              @input="updatePriceRange"
              type="number"
              min="0"
              placeholder="Min"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
            <span class="text-gray-500">to</span>
            <input
              v-model="priceRange[1]"
              @input="updatePriceRange"
              type="number"
              min="0"
              placeholder="Max"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
          
          <div class="flex justify-between text-sm text-gray-500">
            <span>${{ priceRange[0] }}</span>
            <span>${{ priceRange[1] }}</span>
          </div>
        </div>
      </div>

      <!-- Brands -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-3">Brands</label>
        <div class="space-y-2 max-h-40 overflow-y-auto">
          <label class="flex items-center">
            <input
              v-model="selectedBrand"
              value=""
              type="radio"
              class="text-blue-600 focus:ring-blue-500"
            >
            <span class="ml-2 text-sm text-gray-700">All Brands</span>
          </label>
          <label
            v-for="brand in productStore.brands"
            :key="brand"
            class="flex items-center"
          >
            <input
              v-model="selectedBrand"
              :value="brand"
              type="radio"
              class="text-blue-600 focus:ring-blue-500"
            >
            <span class="ml-2 text-sm text-gray-700">{{ brand }}</span>
          </label>
        </div>
      </div>

      <!-- Rating -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-3">Minimum Rating</label>
        <div class="space-y-2">
          <label
            v-for="rating in [0, 1, 2, 3, 4]"
            :key="rating"
            class="flex items-center cursor-pointer"
          >
            <input
              v-model="selectedRating"
              :value="rating"
              type="radio"
              class="text-blue-600 focus:ring-blue-500"
            >
            <div class="ml-2 flex items-center">
              <div class="flex">
                <svg
                  v-for="i in 5"
                  :key="i"
                  :class="[
                    'w-4 h-4',
                    i <= rating ? 'text-yellow-400' : 'text-gray-300'
                  ]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              </div>
              <span class="ml-1 text-sm text-gray-600">
                {{ rating === 0 ? 'All' : `${rating}+ stars` }}
              </span>
            </div>
          </label>
        </div>
      </div>

      <!-- Stock Status -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-3">Availability</label>
        <div class="space-y-2">
          <label class="flex items-center">
            <input
              v-model="inStockOnly"
              type="checkbox"
              class="text-blue-600 focus:ring-blue-500"
            >
            <span class="ml-2 text-sm text-gray-700">In Stock Only</span>
          </label>
        </div>
      </div>

      <!-- Filter Actions -->
      <div class="pt-4 border-t border-gray-200 space-y-2">
        <button
          @click="applyFilters"
          class="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Apply Filters
        </button>
        <button
          @click="clearAllFilters"
          class="w-full bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
        >
          Clear All
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useProductStore } from '../../stores/products'
import { useNotification } from "../../composables/useNotification"

const { notify } = useNotification()

const emit = defineEmits(['close'])

const productStore = useProductStore()

const searchQuery = ref('')
const selectedCategory = ref('')
const priceRange = ref([0, productStore.maxPrice || 3000])
const selectedBrand = ref('')
const selectedRating = ref(0)
const inStockOnly = ref(false)

const updateSearch = () => {
  productStore.setSearchQuery(searchQuery.value)
}

const updatePriceRange = () => {
  productStore.setFilters({
    priceRange: [Number(priceRange.value[0]), Number(priceRange.value[1])]
  })
}

const applyFilters = async () => {
  productStore.setFilters({
    category: selectedCategory.value,
    priceRange: [Number(priceRange.value[0]), Number(priceRange.value[1])],
    brand: selectedBrand.value,
    rating: Number(selectedRating.value),
    inStockOnly: inStockOnly.value
  })

  productStore.setSearchQuery(searchQuery.value)
  productStore.setPage(1)
  await productStore.fetchProducts()

  notify({
    type: 'success',
    title: 'Filters applied',
    message: 'Product list has been updated'
  })

  emit('close')
}

const clearAllFilters = async () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  priceRange.value = [0, productStore.maxPrice || 3000]
  selectedBrand.value = ''
  selectedRating.value = 0
  inStockOnly.value = false

  productStore.resetFilters()
  await productStore.fetchProducts()

  notify({
    type: 'info',
    title: 'Filters cleared',
    message: 'All filters have been reset'
  })

  emit('close')
}

onMounted(() => {
  const filters = productStore.filters
  selectedCategory.value = filters.category
  priceRange.value = [...filters.priceRange]
  selectedBrand.value = filters.brand
  selectedRating.value = filters.rating
  inStockOnly.value = filters.inStockOnly
  searchQuery.value = productStore.searchQuery
})
</script>