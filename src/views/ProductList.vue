<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Page Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">
              {{ categoryName || 'All Products' }}
            </h1>
            <p class="text-gray-600 mt-2">
              {{ filteredProductCount }} products found
            </p>
          </div>
          
          <!-- Mobile Filter Toggle -->
          <button
            @click="showMobileFilters = true"
            class="md:hidden mt-4 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
            </svg>
            Filters
          </button>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex gap-8">
        <!-- Desktop Sidebar Filters -->
        <aside class="hidden md:block w-64 flex-shrink-0">
          <ProductFilters />
        </aside>

        <!-- Mobile Filters Modal -->
        <div
          v-if="showMobileFilters"
          class="fixed inset-0 z-50 md:hidden"
        >
          <div class="absolute inset-0 bg-black bg-opacity-50" @click="showMobileFilters = false"></div>
          <div class="absolute left-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto">
            <div class="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 class="text-lg font-semibold text-gray-900">Filters</h2>
              <button
                @click="showMobileFilters = false"
                class="p-2 text-gray-400 hover:text-gray-600"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div class="p-4">
              <ProductFilters @close="showMobileFilters = false" />
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <main class="flex-1">
          <!-- Sort and View Options -->
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center space-x-4">
              <!-- Sort Options -->
              <select
                v-model="sortBy"
                @change="updateSort"
                class="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
              </select>
            </div>

            <!-- View Toggle -->
            <div class="flex items-center space-x-2">
              <button
                @click="viewMode = 'grid'"
                :class="[
                  'p-2 rounded-lg',
                  viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                ]"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                </svg>
              </button>
              <button
                @click="viewMode = 'list'"
                :class="[
                  'p-2 rounded-lg',
                  viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                ]"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Products Grid/List -->
          <div v-if="!productStore.loading">
            <!-- Grid View -->
            <div
              v-if="viewMode === 'grid'"
              class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <ProductCard
                v-for="product in productStore.filteredProducts"
                :key="product.id"
                :product="product"
              />
            </div>

            <!-- List View -->
            <div
              v-else
              class="space-y-4"
            >
              <ProductListItem
                v-for="product in productStore.filteredProducts"
                :key="product.id"
                :product="product"
              />
            </div>

            <!-- No Products Found -->
            <div
              v-if="productStore.filteredProducts.length === 0"
              class="text-center py-12"
            >
              <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <h3 class="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p class="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
              <button
                @click="clearFilters"
                class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>

          <!-- Loading State -->
          <div v-else class="space-y-4">
            <div
              v-if="viewMode === 'grid'"
              class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <div
                v-for="i in 6"
                :key="i"
                class="bg-white rounded-lg shadow-md p-4 animate-pulse"
              >
                <div class="bg-gray-300 h-48 rounded mb-4"></div>
                <div class="bg-gray-300 h-4 rounded mb-2"></div>
                <div class="bg-gray-300 h-4 rounded w-3/4"></div>
              </div>
            </div>
            <div v-else class="space-y-4">
              <div
                v-for="i in 6"
                :key="i"
                class="bg-white rounded-lg shadow-md p-4 animate-pulse flex space-x-4"
              >
                <div class="bg-gray-300 w-24 h-24 rounded"></div>
                <div class="flex-1 space-y-2">
                  <div class="bg-gray-300 h-4 rounded w-3/4"></div>
                  <div class="bg-gray-300 h-4 rounded w-1/2"></div>
                  <div class="bg-gray-300 h-4 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="mt-12 flex justify-center">
            <nav class="flex items-center space-x-2">
              <button
                :disabled="currentPage === 1"
                @click="changePage(currentPage - 1)"
                class="px-3 py-2 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="changePage(page)"
                :class="[
                  'px-3 py-2 rounded-lg border',
                  page === currentPage
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-300 text-gray-500 hover:bg-gray-50'
                ]"
              >
                {{ page }}
              </button>
              
              <button
                :disabled="currentPage === totalPages"
                @click="changePage(currentPage + 1)"
                class="px-3 py-2 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useProductStore } from '../stores/products'
import ProductCard from '../components/product/ProductCard.vue'
import ProductListItem from '../components/product/ProductListItem.vue'
import ProductFilters from '../components/product/ProductFilters.vue'

const route = useRoute()
const productStore = useProductStore()

const showMobileFilters = ref(false)
const viewMode = ref('grid')
const sortBy = ref('name')
const currentPage = ref(1)
const itemsPerPage = 12

const categoryName = computed(() => {
  if (route.params.category) {
    const category = productStore.categories.find(c => c.id === route.params.category)
    return category?.name || route.params.category
  }
  return ''
})

const filteredProductCount = computed(() => {
  return productStore.filteredProducts.length
})

const totalPages = computed(() => {
  return Math.ceil(filteredProductCount.value / itemsPerPage)
})

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

const updateSort = () => {
  productStore.setFilters({ sortBy: sortBy.value })
}

const clearFilters = () => {
  productStore.resetFilters()
  sortBy.value = 'name'
  currentPage.value = 1
}

const changePage = (page) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Watch for route changes
watch(
  () => route.params.category,
  (newCategory) => {
    if (newCategory) {
      productStore.setFilters({ category: newCategory })
    } else {
      productStore.setFilters({ category: '' })
    }
    currentPage.value = 1
  },
  { immediate: true }
)

onMounted(() => {
  if (productStore.products.length === 0) {
    productStore.fetchProducts()
  }
})
</script>