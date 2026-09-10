import { supabase, useMockData } from '../lib/supabase'

const MOCK_USERS_KEY = 'emall_mock_users'

function getMockUsers() {
  return JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || '[]')
}

function saveMockUsers(users) {
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users))
}

export async function signInWithPassword(email, password) {
  if (useMockData()) {
    const users = getMockUsers()
    let user = users.find((u) => u.email === email)
    if (!user) {
      // Auto-provision for demo: admin@emall.com is admin
      user = {
        id: email === 'admin@emall.com' ? 'admin-1' : `user-${Date.now()}`,
        email,
        password,
        name: email === 'admin@emall.com' ? 'Admin User' : email.split('@')[0],
        role: email === 'admin@emall.com' ? 'admin' : 'customer',
        avatar: 'https://via.placeholder.com/40'
      }
      users.push(user)
      saveMockUsers(users)
    } else if (user.password && user.password !== password) {
      // Allow any password if not set historically
      if (password !== 'password123' && user.password !== password) {
        throw new Error('Invalid login credentials')
      }
    }
    const profile = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar
    }
    return { user: profile, session: { access_token: 'mock-token' } }
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  const profile = await fetchProfile(data.user.id)
  return { user: mapProfile(data.user, profile), session: data.session }
}

export async function signUp({ name, email, password }) {
  if (useMockData()) {
    const users = getMockUsers()
    if (users.some((u) => u.email === email)) {
      throw new Error('User already registered')
    }
    const user = {
      id: `user-${Date.now()}`,
      email,
      password,
      name,
      role: 'customer',
      avatar: 'https://via.placeholder.com/40'
    }
    users.push(user)
    saveMockUsers(users)
    return {
      user: { id: user.id, name, email, role: 'customer', avatar: user.avatar },
      session: { access_token: 'mock-token' }
    }
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name } }
  })
  if (error) throw error
  return {
    user: mapProfile(data.user, { full_name: name, role: 'customer' }),
    session: data.session
  }
}

export async function signOut() {
  if (useMockData()) return
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function signInWithOAuth(provider) {
  if (useMockData()) {
    throw new Error('OAuth requires Supabase configuration. Set VITE_USE_MOCK_DATA=false.')
  }
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: `${window.location.origin}/` }
  })
  if (error) throw error
}

export async function resetPassword(email) {
  if (useMockData()) {
    return { message: 'Password reset email sent (mock)' }
  }
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`
  })
  if (error) throw error
  return { message: 'Password reset email sent' }
}

export async function updatePassword(password) {
  if (useMockData()) return
  const { error } = await supabase.auth.updateUser({ password })
  if (error) throw error
}

export async function fetchProfile(userId) {
  if (useMockData() || !supabase) return null
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()
  if (error) return null
  return data
}

export async function updateProfile(userId, updates) {
  if (useMockData()) {
    return updates
  }
  const { data, error } = await supabase
    .from('profiles')
    .update({
      full_name: updates.name || updates.full_name,
      avatar_url: updates.avatar
    })
    .eq('id', userId)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getSession() {
  if (useMockData()) return null
  const { data } = await supabase.auth.getSession()
  return data.session
}

export function onAuthStateChange(callback) {
  if (useMockData() || !supabase) return { data: { subscription: { unsubscribe() {} } } }
  return supabase.auth.onAuthStateChange(callback)
}

function mapProfile(authUser, profile) {
  return {
    id: authUser.id,
    email: authUser.email,
    name: profile?.full_name || authUser.user_metadata?.full_name || 'User',
    role: profile?.role || 'customer',
    avatar: profile?.avatar_url || 'https://via.placeholder.com/40'
  }
}
