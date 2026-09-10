import { supabase, useMockData } from '../lib/supabase'
import { MOCK_COUPONS } from '../data/mockCatalog'
import { computeTotals as computePricingTotals, validateCouponCode } from '../lib/pricing'

const ORDERS_KEY = 'orders'

export function getLocalOrders() {
  return JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]')
}

function saveLocalOrders(orders) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
}

export function validateCoupon(code) {
  return validateCouponCode(code, MOCK_COUPONS)
}

export function computeTotals(items, coupon, shippingMethodId = 'standard') {
  return computePricingTotals(items, coupon, shippingMethodId)
}

export async function validateCouponAsync(code) {
  const key = (code || '').toUpperCase()
  if (useMockData()) {
    return validateCoupon(key)
  }
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', key)
    .eq('active', true)
    .maybeSingle()
  if (error || !data) return null
  return {
    code: data.code,
    type: data.type,
    discount: data.type === 'percentage' ? Number(data.value) : Number(data.value),
    value: Number(data.value)
  }
}

export async function createOrder(orderPayload) {
  if (useMockData()) {
    const order = {
      id: 'ORD' + Date.now(),
      ...orderPayload,
      status: 'confirmed',
      date: new Date().toISOString(),
      events: [
        {
          status: 'confirmed',
          title: 'Order Confirmed',
          date: new Date().toISOString(),
          note: 'Payment received'
        }
      ]
    }
    const orders = getLocalOrders()
    orders.push(order)
    saveLocalOrders(orders)
    return order
  }

  const { data, error } = await supabase
    .from('orders')
    .insert({
      user_id: orderPayload.userId,
      status: 'confirmed',
      subtotal: orderPayload.subtotal,
      tax: orderPayload.tax,
      shipping: orderPayload.shipping,
      discount: orderPayload.discount,
      total: orderPayload.total,
      currency: orderPayload.currency || 'USD',
      shipping_address: orderPayload.shippingAddress,
      stripe_payment_intent_id: orderPayload.stripePaymentIntentId || null
    })
    .select()
    .single()
  if (error) throw error

  const items = orderPayload.items.map((item) => ({
    order_id: data.id,
    product_id: item.id,
    variant_snapshot: item.selectedVariant || {},
    quantity: item.quantity,
    unit_price: item.price
  }))
  await supabase.from('order_items').insert(items)
  await supabase.from('order_status_events').insert({
    order_id: data.id,
    status: 'confirmed',
    note: 'Order placed'
  })

  return {
    id: data.id,
    ...orderPayload,
    status: data.status,
    date: data.created_at
  }
}

export async function fetchOrdersForUser(userId) {
  if (useMockData()) {
    return getLocalOrders().filter((o) => !userId || o.userId === userId || !o.userId)
  }
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*), order_status_events(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data || []).map(mapOrder)
}

export async function fetchOrderById(orderId) {
  if (useMockData()) {
    return getLocalOrders().find((o) => o.id === orderId) || null
  }
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*), order_status_events(*)')
    .eq('id', orderId)
    .maybeSingle()
  if (error) throw error
  return data ? mapOrder(data) : null
}

export async function updateOrderStatus(orderId, status, note = '') {
  if (useMockData()) {
    const orders = getLocalOrders()
    const order = orders.find((o) => o.id === orderId)
    if (!order) throw new Error('Order not found')
    order.status = status
    order.events = order.events || []
    order.events.push({ status, date: new Date().toISOString(), note })
    saveLocalOrders(orders)
    return order
  }
  const { error } = await supabase.from('orders').update({ status }).eq('id', orderId)
  if (error) throw error
  await supabase.from('order_status_events').insert({ order_id: orderId, status, note })
  return fetchOrderById(orderId)
}

export async function cancelOrder(orderId, userId) {
  const order = await fetchOrderById(orderId)
  if (!order) throw new Error('Order not found')
  if (!['confirmed', 'processing'].includes(order.status)) {
    throw new Error('Order cannot be cancelled')
  }
  return updateOrderStatus(orderId, 'cancelled', 'Cancelled by customer')
}

export async function fetchAllOrders() {
  if (useMockData()) return getLocalOrders()
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*), profiles(full_name, email)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data || []).map(mapOrder)
}

export async function createPaymentIntent(payload) {
  if (useMockData()) {
    return {
      clientSecret: 'mock_secret_' + Date.now(),
      paymentIntentId: 'pi_mock_' + Date.now(),
      amount: Math.round(payload.amount * 100)
    }
  }
  const { data, error } = await supabase.functions.invoke('create-payment-intent', {
    body: payload
  })
  if (error) throw error
  return data
}

function mapOrder(row) {
  return {
    id: row.id,
    userId: row.user_id,
    items: (row.order_items || row.items || []).map((i) => ({
      id: i.product_id || i.id,
      name: i.name,
      price: Number(i.unit_price || i.price),
      quantity: i.quantity,
      images: i.images || [],
      selectedVariant: i.variant_snapshot || i.selectedVariant
    })),
    total: Number(row.total),
    subtotal: Number(row.subtotal),
    tax: Number(row.tax),
    shipping: Number(row.shipping),
    discount: Number(row.discount || 0),
    shippingAddress: row.shipping_address || row.shippingAddress,
    status: row.status,
    date: row.created_at || row.date,
    events: row.order_status_events || row.events || [],
    customerName: row.profiles?.full_name,
    customerEmail: row.profiles?.email
  }
}
