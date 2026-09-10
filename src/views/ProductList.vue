<template>
  <div class="min-h-screen bg-gray-50">
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">{{ categoryName || 'All Products' }}</h1>
            <p class="text-gray-600 mt-2">{{ productStore.total }} products found</p>
          </div>
          <button
            @click="showMobileFilters = true"
            class="md:hidden mt-4 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg"
          >
            Filters
          </button>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex gap-8">
        <aside class="hidden md:block w-64 flex-shrink-0">
          <ProductFilters @close="syncAndFetch" />
        </aside>

        <div v-if="showMobileFilters" class="fixed inset-0 z-50 md:hidden">
          <div class="absolute inset-0 bg-black bg-opacity-50" @click="showMobileFilters = false"></div>
          <div class="absolute left-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto p-4">
            <ProductFilters @close="() => { showMobileFilters = false; syncAndFetch() }" />
          </div>
        </div>

        <main class="flex-1">
          <div class="flex items-center justify-between mb-6">
            <select
              v-model="sortBy"
              @change="updateSort"
              class="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest First</option>
            </select>
            <div class="flex items-center space-x-2">
              <button
                @click="viewMode = 'grid'"
                :class="['p-2 rounded-lg', viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200']"
              >
                Grid
              </button>
              <button
                @click="viewMode = 'list'"
                :class="['p-2 rounded-lg', viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200']"
              >
                List
              </button>
            </div>
          </div>

          <div v-if="productStore.loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="i in 6" :key="i" class="bg-white rounded-lg p-4 animate-pulse h-64"></div>
          </div>

          <template v-else>
            <div
              v-if="viewMode === 'grid'"
              class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <ProductCard
                v-for="product in productStore.products"
                :key="product.id"
                :product="product"
              />
            </div>
            <div v-else class="space-y-4">
              <ProductListItem
                v-for="product in productStore.products"
                :key="product.id"
                :product="product"
              />
            </div>
            <div v-if="!productStore.products.length" class="text-center py-12">
              <h3 class="text-lg font-medium">No products found</h3>
              <button @click="clearFilters" class="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg">
                Clear Filters
              </button>
            </div>
          </template>

          <div v-if="productStore.totalPages > 1" class="mt-12 flex justify-center space-x-2">
            <button
              class="px-3 py-2 border rounded disabled:opacity-50"
              :disabled="productStore.page <= 1"
              @click="changePage(productStore.page - 1)"
            >
              Previous
            </button>
            <span class="px-3 py-2">{{ productStore.page }} / {{ productStore.totalPages }}</span>
            <button
              class="px-3 py-2 border rounded disabled:opacity-50"
              :disabled="productStore.page >= productStore.totalPages"
              @click="changePage(productStore.page + 1)"
            >
              Next
            </button>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '../stores/products'
import ProductCard from '../components/product/ProductCard.vue'
import ProductListItem from '../components/product/ProductListItem.vue'
import ProductFilters from '../components/product/ProductFilters.vue'

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()

const showMobileFilters = ref(false)
const viewMode = ref('grid')
const sortBy = ref(productStore.filters.sortBy || 'name')

const categoryName = computed(() => {
  const cat = route.params.category
  if (!cat) return null
  const found = productStore.categories.find((c) => c.id === cat)
  return found?.name || cat
})

const syncQueryToStore = () => {
  const q = route.query
  if (q.q) productStore.setSearchQuery(String(q.q))
  if (q.sort) {
    sortBy.value = String(q.sort)
    productStore.setFilters({ sortBy: sortBy.value })
  }
  if (q.brand) productStore.setFilters({ brand: String(q.brand) })
  if (q.inStock === '1') productStore.setFilters({ inStockOnly: true })
  if (q.min || q.max) {
    productStore.setFilters({
      priceRange: [Number(q.min || 0), Number(q.max || productStore.maxPrice)]
    })
  }
  if (q.page) productStore.setPage(Number(q.page) || 1)
  const category = route.params.category || q.category || ''
  productStore.setFilters({ category })
}

const syncAndFetch = async () => {
  const query = {
    ...(productStore.searchQuery ? { q: productStore.searchQuery } : {}),
    ...(productStore.filters.sortBy !== 'name' ? { sort: productStore.filters.sortBy } : {}),
    ...(productStore.filters.brand ? { brand: productStore.filters.brand } : {}),
    ...(productStore.filters.inStockOnly ? { inStock: '1' } : {}),
    ...(productStore.page > 1 ? { page: String(productStore.page) } : {}),
    min: String(productStore.filters.priceRange[0]),
    max: String(productStore.filters.priceRange[1])
  }
  await router.replace({ query })
  await productStore.fetchProducts()
}

const updateSort = async () => {
  productStore.setFilters({ sortBy: sortBy.value })
  productStore.setPage(1)
  await syncAndFetch()
}

const changePage = async (page) => {
  productStore.setPage(page)
  await syncAndFetch()
}

const clearFilters = async () => {
  productStore.resetFilters()
  sortBy.value = 'name'
  await syncAndFetch()
}

watch(
  () => [route.params.category, route.query],
  async () => {
    syncQueryToStore()
    await productStore.fetchProducts()
  },
  { deep: true }
)

onMounted(async () => {
  syncQueryToStore()
  await productStore.fetchProducts()
})
</script>
