import { defineStore } from 'pinia'
import * as productService from '../services/products'
import { PAGE_SIZE } from '../lib/config'
import { MOCK_PRODUCTS } from '../data/mockCatalog'

export const useProductStore = defineStore('products', {
  state: () => ({
    products: [],
    categories: [],
    total: 0,
    maxPrice: 3000,
    page: 1,
    pageSize: PAGE_SIZE,
    filters: {
      category: '',
      priceRange: [0, 3000],
      brand: '',
      rating: 0,
      sortBy: 'name',
      inStockOnly: false
    },
    searchQuery: '',
    loading: false,
    error: null
  }),

  getters: {
    filteredProducts: (state) => state.products,
    getProductById: (state) => (id) =>
      state.products.find((product) => product.id === parseInt(id) || product.slug === id),
    brands: () => [...new Set(MOCK_PRODUCTS.map((p) => p.brand))].sort(),
    totalPages: (state) => Math.max(1, Math.ceil(state.total / state.pageSize))
  },

  actions: {
    async fetchProducts(overrides = {}) {
      this.loading = true
      this.error = null
      try {
        const params = {
          page: overrides.page ?? this.page,
          pageSize: this.pageSize,
          category: overrides.category ?? this.filters.category,
          search: overrides.search ?? this.searchQuery,
          brand: overrides.brand ?? this.filters.brand,
          rating: overrides.rating ?? this.filters.rating,
          priceMin: (overrides.priceRange || this.filters.priceRange)[0],
          priceMax: (overrides.priceRange || this.filters.priceRange)[1],
          inStockOnly: overrides.inStockOnly ?? this.filters.inStockOnly,
          sortBy: overrides.sortBy ?? this.filters.sortBy
        }
        const { products, total, maxPrice } = await productService.fetchProducts(params)
        this.products = products
        this.total = total
        this.maxPrice = Math.max(maxPrice, 1000)
        if (this.filters.priceRange[1] < 1000) {
          this.filters.priceRange = [0, this.maxPrice]
        }
        this.categories = await productService.fetchCategories()
      } catch (error) {
        console.error('Error fetching products:', error)
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async fetchProductById(id) {
      const existing = this.getProductById(id)
      if (existing) return existing
      return productService.fetchProductById(id)
    },

    async getRelatedProducts(product) {
      return productService.fetchRelatedProducts(product)
    },

    setFilters(filters) {
      this.filters = { ...this.filters, ...filters }
    },

    setSearchQuery(query) {
      this.searchQuery = query
    },

    setPage(page) {
      this.page = page
    },

    resetFilters() {
      this.filters = {
        category: '',
        priceRange: [0, this.maxPrice || 3000],
        brand: '',
        rating: 0,
        sortBy: 'name',
        inStockOnly: false
      }
      this.searchQuery = ''
      this.page = 1
    }
  }
})
