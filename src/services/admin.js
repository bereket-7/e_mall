import { supabase, useMockData } from '../lib/supabase'
import { MOCK_PRODUCTS } from '../data/mockCatalog'
import { getLocalOrders } from './orders'
import { MOCK_COUPONS } from '../data/mockCatalog'

export async function fetchDashboardStats() {
  if (useMockData()) {
    const orders = getLocalOrders()
    const sales = orders.reduce((s, o) => s + (o.total || 0), 0)
    return {
      totalSales: sales || 12345,
      totalOrders: orders.length || 156,
      totalProducts: MOCK_PRODUCTS.length,
      totalCustomers: 89,
      recentOrders: orders.slice(-5).reverse().map((o) => ({
        id: o.id,
        customer: o.shippingAddress
          ? `${o.shippingAddress.firstName || ''} ${o.shippingAddress.lastName || ''}`.trim()
          : 'Customer',
        total: o.total,
        status: o.status
      }))
    }
  }

  const [{ count: productCount }, { count: customerCount }, { data: orders }] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase
      .from('orders')
      .select('id, total, status, created_at, profiles(full_name)')
      .order('created_at', { ascending: false })
      .limit(50)
  ])

  const list = orders || []
  return {
    totalSales: list.reduce((s, o) => s + Number(o.total || 0), 0),
    totalOrders: list.length,
    totalProducts: productCount || 0,
    totalCustomers: customerCount || 0,
    recentOrders: list.slice(0, 5).map((o) => ({
      id: o.id,
      customer: o.profiles?.full_name || 'Customer',
      total: Number(o.total),
      status: o.status
    }))
  }
}

export async function fetchCustomers() {
  if (useMockData()) {
    return [
      {
        id: 'admin-1',
        name: 'Admin User',
        email: 'admin@emall.com',
        role: 'admin',
        orderCount: 0
      },
      {
        id: 'user-demo',
        name: 'John Doe',
        email: 'user@emall.com',
        role: 'customer',
        orderCount: getLocalOrders().length
      }
    ]
  }
  const { data, error } = await supabase.from('profiles').select('*').order('full_name')
  if (error) throw error
  return (data || []).map((p) => ({
    id: p.id,
    name: p.full_name,
    email: p.email || '',
    role: p.role,
    orderCount: 0
  }))
}

export async function updateCustomerRole(userId, role) {
  if (useMockData()) return { id: userId, role }
  const { data, error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function fetchCoupons() {
  if (useMockData()) {
    return Object.values(MOCK_COUPONS).map((c) => ({
      ...c,
      active: true
    }))
  }
  const { data, error } = await supabase.from('coupons').select('*').order('code')
  if (error) throw error
  return data || []
}

export async function upsertCoupon(coupon) {
  if (useMockData()) {
    MOCK_COUPONS[coupon.code] = {
      code: coupon.code,
      type: coupon.type,
      discount: coupon.value,
      value: coupon.value
    }
    return MOCK_COUPONS[coupon.code]
  }
  const { data, error } = await supabase.from('coupons').upsert(coupon).select().single()
  if (error) throw error
  return data
}

export async function fetchSalesReport() {
  if (useMockData()) {
    const orders = getLocalOrders()
    const byDay = {}
    orders.forEach((o) => {
      const day = (o.date || '').slice(0, 10) || new Date().toISOString().slice(0, 10)
      byDay[day] = (byDay[day] || 0) + (o.total || 0)
    })
    if (!Object.keys(byDay).length) {
      const today = new Date().toISOString().slice(0, 10)
      byDay[today] = 1200
      byDay[new Date(Date.now() - 86400000).toISOString().slice(0, 10)] = 890
    }
    const lowStock = MOCK_PRODUCTS.filter((p) => p.stockCount <= 20)
    const topProducts = [...MOCK_PRODUCTS].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 5)
    return { byDay, lowStock, topProducts }
  }

  const { data: orders } = await supabase.from('orders').select('total, created_at')
  const byDay = {}
  ;(orders || []).forEach((o) => {
    const day = o.created_at.slice(0, 10)
    byDay[day] = (byDay[day] || 0) + Number(o.total)
  })
  const { data: lowStock } = await supabase
    .from('products')
    .select('*')
    .lte('stock_count', 20)
    .order('stock_count')
  const { data: topProducts } = await supabase
    .from('products')
    .select('*')
    .order('review_count', { ascending: false })
    .limit(5)
  return { byDay, lowStock: lowStock || [], topProducts: topProducts || [] }
}
