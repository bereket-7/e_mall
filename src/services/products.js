import { supabase, useMockData } from '../lib/supabase'
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '../data/mockCatalog'
import { PAGE_SIZE } from '../lib/config'

function mapProduct(row) {
  if (!row) return null
  if (row.images && row.variants) return row
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    price: Number(row.price),
    originalPrice: Number(row.compare_at_price || row.price),
    discount: row.compare_at_price
      ? Math.round((1 - row.price / row.compare_at_price) * 100)
      : 0,
    brand: row.brand,
    category: row.category_slug || row.categories?.slug || row.category,
    rating: Number(row.rating_avg || row.rating || 0),
    reviewCount: row.review_count || 0,
    description: row.description,
    images: row.product_images?.map((i) => i.url) || row.images || [],
    variants: row.product_variants || row.variants || [],
    features: row.features || [],
    inStock: row.in_stock ?? row.inStock ?? true,
    stockCount: row.stock_count ?? row.stockCount ?? 0,
    createdAt: row.created_at || row.createdAt
  }
}

export async function fetchProducts({
  page = 1,
  pageSize = PAGE_SIZE,
  category,
  search,
  brand,
  rating,
  priceMin = 0,
  priceMax = 100000,
  inStockOnly = false,
  sortBy = 'name'
} = {}) {
  if (useMockData()) {
    let filtered = [...MOCK_PRODUCTS]

    if (search) {
      const q = search.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q)
      )
    }
    if (category) filtered = filtered.filter((p) => p.category === category)
    if (brand) filtered = filtered.filter((p) => p.brand === brand)
    if (rating > 0) filtered = filtered.filter((p) => p.rating >= rating)
    if (inStockOnly) filtered = filtered.filter((p) => p.inStock)
    filtered = filtered.filter((p) => p.price >= priceMin && p.price <= priceMax)

    filtered.sort((a, b) => {
      switch (sortBy) {
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

    const total = filtered.length
    const from = (page - 1) * pageSize
    return {
      products: filtered.slice(from, from + pageSize),
      total,
      maxPrice: Math.max(...MOCK_PRODUCTS.map((p) => p.price), 1000)
    }
  }

  let query = supabase
    .from('products')
    .select('*, categories(slug, name), product_images(url), product_variants(*)', {
      count: 'exact'
    })
    .gte('price', priceMin)
    .lte('price', priceMax)

  if (category) query = query.eq('categories.slug', category)
  if (brand) query = query.eq('brand', brand)
  if (rating > 0) query = query.gte('rating_avg', rating)
  if (inStockOnly) query = query.eq('in_stock', true)
  if (search) query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,brand.ilike.%${search}%`)

  switch (sortBy) {
    case 'price-low':
      query = query.order('price', { ascending: true })
      break
    case 'price-high':
      query = query.order('price', { ascending: false })
      break
    case 'rating':
      query = query.order('rating_avg', { ascending: false })
      break
    case 'newest':
      query = query.order('created_at', { ascending: false })
      break
    default:
      query = query.order('name', { ascending: true })
  }

  const from = (page - 1) * pageSize
  const { data, error, count } = await query.range(from, from + pageSize - 1)
  if (error) throw error

  const { data: maxRow } = await supabase
    .from('products')
    .select('price')
    .order('price', { ascending: false })
    .limit(1)
    .maybeSingle()

  return {
    products: (data || []).map(mapProduct),
    total: count || 0,
    maxPrice: Number(maxRow?.price || 3000)
  }
}

export async function fetchProductById(id) {
  if (useMockData()) {
    return MOCK_PRODUCTS.find((p) => p.id === parseInt(id) || p.slug === id) || null
  }

  let query = supabase
    .from('products')
    .select('*, categories(slug, name), product_images(url), product_variants(*)')

  if (isNaN(Number(id))) {
    query = query.eq('slug', id)
  } else {
    query = query.eq('id', id)
  }

  const { data, error } = await query.maybeSingle()
  if (error) throw error
  return mapProduct(data)
}

export async function fetchCategories() {
  if (useMockData()) {
    const counts = MOCK_CATEGORIES.map((c) => ({
      ...c,
      count: MOCK_PRODUCTS.filter((p) => p.category === c.id).length
    }))
    return counts
  }

  const { data, error } = await supabase.from('categories').select('*').order('name')
  if (error) throw error

  const { data: products } = await supabase.from('products').select('category_id')
  return (data || []).map((c) => ({
    id: c.slug,
    name: c.name,
    count: (products || []).filter((p) => p.category_id === c.id).length
  }))
}

export async function fetchRelatedProducts(product) {
  if (!product) return []
  if (useMockData()) {
    return MOCK_PRODUCTS.filter((p) => p.id !== product.id && p.category === product.category).slice(
      0,
      4
    )
  }
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(slug), product_images(url)')
    .neq('id', product.id)
    .limit(4)
  if (error) throw error
  return (data || [])
    .map(mapProduct)
    .filter((p) => p.category === product.category)
    .slice(0, 4)
}

export async function createProduct(payload) {
  if (useMockData()) {
    const product = { ...payload, id: Date.now(), createdAt: new Date().toISOString() }
    MOCK_PRODUCTS.push(product)
    return product
  }
  const { data, error } = await supabase.from('products').insert(payload).select().single()
  if (error) throw error
  return mapProduct(data)
}

export async function updateProduct(id, payload) {
  if (useMockData()) {
    const idx = MOCK_PRODUCTS.findIndex((p) => p.id === id)
    if (idx >= 0) {
      MOCK_PRODUCTS[idx] = { ...MOCK_PRODUCTS[idx], ...payload }
      return MOCK_PRODUCTS[idx]
    }
    throw new Error('Product not found')
  }
  const { data, error } = await supabase.from('products').update(payload).eq('id', id).select().single()
  if (error) throw error
  return mapProduct(data)
}

export async function deleteProduct(id) {
  if (useMockData()) {
    const idx = MOCK_PRODUCTS.findIndex((p) => p.id === id)
    if (idx >= 0) MOCK_PRODUCTS.splice(idx, 1)
    return
  }
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw error
}

export function getBrands(products) {
  return [...new Set(products.map((p) => p.brand))].sort()
}
