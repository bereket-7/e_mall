import { supabase, useMockData } from '../lib/supabase'

const NEWS_KEY = 'emall_newsletter'

export async function subscribeNewsletter(email) {
  if (!email || !email.includes('@')) {
    throw new Error('Please enter a valid email address')
  }

  if (useMockData()) {
    const list = JSON.parse(localStorage.getItem(NEWS_KEY) || '[]')
    if (!list.includes(email.toLowerCase())) {
      list.push(email.toLowerCase())
      localStorage.setItem(NEWS_KEY, JSON.stringify(list))
    }
    return { email }
  }

  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .upsert({ email: email.toLowerCase() }, { onConflict: 'email' })
    .select()
    .single()
  if (error) throw error
  return data
}
