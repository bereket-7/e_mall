import { defineStore } from 'pinia'

export const useProductStore = defineStore('products', {
  state: () => ({
    products: [],
    categories: [],
    filters: {
      category: '',
      priceRange: [0, 1000],
      brand: '',
      rating: 0,
      sortBy: 'name'
    },
    searchQuery: '',
    loading: false
  }),

  getters: {
    filteredProducts: (state) => {
      let filtered = [...state.products]

      // Search filter
      if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase()
        filtered = filtered.filter(product =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query)
        )
      }

      // Category filter
      if (state.filters.category) {
        filtered = filtered.filter(product => product.category === state.filters.category)
      }

      // Price range filter
      filtered = filtered.filter(product =>
        product.price >= state.filters.priceRange[0] &&
        product.price <= state.filters.priceRange[1]
      )

      // Brand filter
      if (state.filters.brand) {
        filtered = filtered.filter(product => product.brand === state.filters.brand)
      }

      // Rating filter
      if (state.filters.rating > 0) {
        filtered = filtered.filter(product => product.rating >= state.filters.rating)
      }

      // Sort
      filtered.sort((a, b) => {
        switch (state.filters.sortBy) {
          case 'price-low':
            return a.price - b.price
          case 'price-high':
            return b.price - a.price
          case 'rating':
            return b.rating - a.rating
          case 'newest':
            return new Date(b.createdAt) - new Date(a.createdAt)
          default:
            return a.name.localeCompare(b.name)
        }
      })

      return filtered
    },

    getProductById: (state) => (id) => {
      return state.products.find(product => product.id === parseInt(id))
    },

    getRelatedProducts: (state) => (product) => {
      return state.products
        .filter(p => p.id !== product.id && p.category === product.category)
        .slice(0, 4)
    },

    brands: (state) => {
      const brands = [...new Set(state.products.map(p => p.brand))]
      return brands.sort()
    }
  },

  actions: {
    async fetchProducts() {
      this.loading = true
      try {
        // Mock data - replace with actual API call
        this.products = [
          {
            id: 1,
            name: "iPhone 15 Pro",
            price: 999,
            originalPrice: 1099,
            discount: 9,
            brand: "Apple",
            category: "electronics",
            rating: 4.8,
            reviewCount: 245,
            description: "The most advanced iPhone yet with titanium design and A17 Pro chip.",
            images: [
              "https://images.unsplash.com/photo-1592286499084-3aa2d65e6e50?w=500",
              "https://images.unsplash.com/photo-1605464315542-6e5c11d7eb1e?w=500"
            ],
            variants: [
              { name: "Color", options: ["Natural Titanium", "Blue Titanium", "White Titanium", "Black Titanium"] },
              { name: "Storage", options: ["128GB", "256GB", "512GB", "1TB"] }
            ],
            features: ["A17 Pro chip", "Pro camera system", "Titanium design", "Action Button"],
            inStock: true,
            stockCount: 50,
            createdAt: "2024-01-15"
          },
          {
            id: 2,
            name: "Samsung Galaxy S24 Ultra",
            price: 899,
            originalPrice: 999,
            discount: 10,
            brand: "Samsung",
            category: "electronics",
            rating: 4.7,
            reviewCount: 189,
            description: "Ultimate productivity with S Pen and AI-powered features.",
            images: [
              "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500",
              "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=500"
            ],
            variants: [
              { name: "Color", options: ["Titanium Gray", "Titanium Black", "Titanium Violet", "Titanium Yellow"] },
              { name: "Storage", options: ["256GB", "512GB", "1TB"] }
            ],
            features: ["S Pen included", "200MP camera", "AI features", "5000mAh battery"],
            inStock: true,
            stockCount: 30,
            createdAt: "2024-01-20"
          },
          {
            id: 3,
            name: "Nike Air Force 1",
            price: 90,
            originalPrice: 110,
            discount: 18,
            brand: "Nike",
            category: "fashion",
            rating: 4.6,
            reviewCount: 523,
            description: "Classic basketball shoe with timeless style and comfort.",
            images: [
              "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500",
              "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=500"
            ],
            variants: [
              { name: "Size", options: ["7", "8", "9", "10", "11", "12"] },
              { name: "Color", options: ["White", "Black", "Red", "Blue"] }
            ],
            features: ["Leather upper", "Air-Sole unit", "Rubber outsole", "Classic design"],
            inStock: true,
            stockCount: 100,
            createdAt: "2024-01-10"
          },
          {
            id: 4,
            name: "Sony WH-1000XM5",
            price: 349,
            originalPrice: 399,
            discount: 13,
            brand: "Sony",
            category: "electronics",
            rating: 4.9,
            reviewCount: 342,
            description: "Industry-leading noise canceling headphones with exceptional sound quality.",
            images: [
              "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500",
              "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500"
            ],
            variants: [
              { name: "Color", options: ["Black", "Silver"] }
            ],
            features: ["30-hour battery", "Quick charge", "Multipoint connection", "Touch controls"],
            inStock: true,
            stockCount: 25,
            createdAt: "2024-01-05"
          },
          {
            id: 5,
            name: "Adidas Ultraboost 22",
            price: 180,
            originalPrice: 200,
            discount: 10,
            brand: "Adidas",
            category: "fashion",
            rating: 4.5,
            reviewCount: 298,
            description: "Running shoes with responsive cushioning and energy return.",
            images: [
              "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
              "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500"
            ],
            variants: [
              { name: "Size", options: ["7", "8", "9", "10", "11", "12"] },
              { name: "Color", options: ["White", "Black", "Blue", "Gray"] }
            ],
            features: ["Boost midsole", "Primeknit upper", "Continental rubber", "Energy return"],
            inStock: true,
            stockCount: 75,
            createdAt: "2024-01-12"
          },
          {
            id: 6,
            name: "MacBook Pro 16\"",
            price: 2499,
            originalPrice: 2699,
            discount: 7,
            brand: "Apple",
            category: "electronics",
            rating: 4.8,
            reviewCount: 156,
            description: "Powerful laptop for professionals with M3 Pro chip and stunning display.",
            images: [
              "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500",
              "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500"
            ],
            variants: [
              { name: "Color", options: ["Space Gray", "Silver"] },
              { name: "Memory", options: ["18GB", "36GB"] },
              { name: "Storage", options: ["512GB", "1TB", "2TB"] }
            ],
            features: ["M3 Pro chip", "Liquid Retina XDR display", "22-hour battery", "Studio-quality mics"],
            inStock: true,
            stockCount: 15,
            createdAt: "2024-01-08"
          }
        ]

        this.categories = [
          { id: 'electronics', name: 'Electronics', count: 4 },
          { id: 'fashion', name: 'Fashion', count: 2 },
          { id: 'home', name: 'Home & Garden', count: 0 },
          { id: 'books', name: 'Books', count: 0 },
          { id: 'sports', name: 'Sports & Outdoors', count: 0 }
        ]
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        this.loading = false
      }
    },

    setFilters(filters) {
      this.filters = { ...this.filters, ...filters }
    },

    setSearchQuery(query) {
      this.searchQuery = query
    },

    resetFilters() {
      this.filters = {
        category: '',
        priceRange: [0, 1000],
        brand: '',
        rating: 0,
        sortBy: 'name'
      }
      this.searchQuery = ''
    }
  }
})