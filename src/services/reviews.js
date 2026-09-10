import { supabase, useMockData } from '../lib/supabase'
import { MOCK_REVIEWS } from '../data/mockCatalog'

export async function fetchReviews(productId) {
  if (useMockData()) {
    return MOCK_REVIEWS.map((r) => ({ ...r, productId }))
  }
  const { data, error } = await supabase
    .from('reviews')
    .select('*, profiles(full_name, avatar_url)')
    .eq('product_id', productId)
    .eq('moderated', true)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data || []).map((r) => ({
    id: r.id,
    name: r.profiles?.full_name || 'Customer',
    rating: r.rating,
    date: new Date(r.created_at).toLocaleDateString(),
    avatar: r.profiles?.avatar_url || 'https://via.placeholder.com/40',
    comment: r.body,
    moderated: r.moderated
  }))
}

export async function createReview({ productId, userId, rating, body }) {
  if (useMockData()) {
    const review = {
      id: Date.now(),
      name: 'You',
      rating,
      date: 'Just now',
      avatar: 'https://via.placeholder.com/40',
      comment: body,
      moderated: true,
      productId
    }
    MOCK_REVIEWS.unshift(review)
    return review
  }
  const { data, error } = await supabase
    .from('reviews')
    .insert({
      product_id: productId,
      user_id: userId,
      rating,
      body,
      moderated: true
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function fetchAllReviewsForModeration() {
  if (useMockData()) return MOCK_REVIEWS
  const { data, error } = await supabase
    .from('reviews')
    .select('*, profiles(full_name), products(name)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function setReviewModerated(id, moderated) {
  if (useMockData()) {
    const r = MOCK_REVIEWS.find((x) => x.id === id)
    if (r) r.moderated = moderated
    return r
  }
  const { error } = await supabase.from('reviews').update({ moderated }).eq('id', id)
  if (error) throw error
}
