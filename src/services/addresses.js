import { supabase, useMockData } from '../lib/supabase'

const ADDR_KEY = 'emall_addresses'

export async function fetchAddresses(userId) {
  if (useMockData() || !userId) {
    return JSON.parse(localStorage.getItem(ADDR_KEY) || '[]').filter(
      (a) => !userId || a.userId === userId
    )
  }
  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', userId)
    .order('is_default', { ascending: false })
  if (error) throw error
  return (data || []).map(mapAddress)
}

export async function saveAddress(userId, address) {
  if (useMockData() || !userId) {
    const list = JSON.parse(localStorage.getItem(ADDR_KEY) || '[]')
    const item = {
      ...address,
      id: address.id || Date.now(),
      userId
    }
    const idx = list.findIndex((a) => a.id === item.id)
    if (idx >= 0) list[idx] = item
    else list.push(item)
    if (item.isDefault) {
      list.forEach((a) => {
        if (a.id !== item.id) a.isDefault = false
      })
    }
    localStorage.setItem(ADDR_KEY, JSON.stringify(list))
    return item
  }

  const payload = {
    user_id: userId,
    label: address.label || 'Home',
    line1: address.line1 || address.address,
    city: address.city,
    state: address.state || '',
    postal: address.postal || address.zipCode,
    country: address.country || 'US',
    phone: address.phone || '',
    is_default: Boolean(address.isDefault)
  }

  if (address.id) {
    const { data, error } = await supabase
      .from('addresses')
      .update(payload)
      .eq('id', address.id)
      .select()
      .single()
    if (error) throw error
    return mapAddress(data)
  }

  const { data, error } = await supabase.from('addresses').insert(payload).select().single()
  if (error) throw error
  return mapAddress(data)
}

export async function deleteAddress(userId, addressId) {
  if (useMockData() || !userId) {
    const list = JSON.parse(localStorage.getItem(ADDR_KEY) || '[]').filter((a) => a.id !== addressId)
    localStorage.setItem(ADDR_KEY, JSON.stringify(list))
    return
  }
  const { error } = await supabase.from('addresses').delete().eq('id', addressId).eq('user_id', userId)
  if (error) throw error
}

function mapAddress(row) {
  return {
    id: row.id,
    userId: row.user_id,
    label: row.label,
    line1: row.line1,
    address: row.line1,
    city: row.city,
    state: row.state,
    postal: row.postal,
    zipCode: row.postal,
    country: row.country,
    phone: row.phone,
    isDefault: row.is_default
  }
}
