import { supabase, useMockData } from '../lib/supabase'
import { MOCK_PRODUCTS } from '../data/mockCatalog'

const WISHLIST_KEY = 'wishlist'

export async function fetchWishlist(userId) {
  if (useMockData() || !userId) {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]')
  }
  const { data, error } = await supabase
    .from('wishlists')
    .select('product_id, products(*, product_images(url), categories(slug))')
    .eq('user_id', userId)
  if (error) throw error
  return (data || []).map((row) => {
    const p = row.products
    return {
      id: p.id,
      name: p.name,
      price: Number(p.price),
      brand: p.brand,
      category: p.categories?.slug,
      images: p.product_images?.map((i) => i.url) || [],
      rating: Number(p.rating_avg || 0),
      reviewCount: p.review_count || 0,
      discount: 0,
      inStock: p.in_stock,
      stockCount: p.stock_count
    }
  })
}

export async function addToWishlist(userId, product) {
  if (useMockData() || !userId) {
    const items = JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]')
    if (!items.some((i) => i.id === product.id)) {
      items.push(product)
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(items))
    }
    return items
  }
  const { error } = await supabase.from('wishlists').upsert({
    user_id: userId,
    product_id: product.id
  })
  if (error) throw error
  return fetchWishlist(userId)
}

export async function removeFromWishlist(userId, productId) {
  if (useMockData() || !userId) {
    const items = JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]').filter(
      (i) => i.id !== productId
    )
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(items))
    return items
  }
  const { error } = await supabase
    .from('wishlists')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId)
  if (error) throw error
  return fetchWishlist(userId)
}

export async function mergeWishlistOnLogin(userId) {
  const local = JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]')
  if (!local.length || useMockData()) return fetchWishlist(userId)
  for (const product of local) {
    await addToWishlist(userId, product)
  }
  localStorage.removeItem(WISHLIST_KEY)
  return fetchWishlist(userId)
}

export function resolveProduct(id) {
  return MOCK_PRODUCTS.find((p) => p.id === id)
}
