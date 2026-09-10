import { loadStripe } from '@stripe/stripe-js'

let stripePromise = null

export function isStripeConfigured() {
  const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ''
  return Boolean(key && key.startsWith('pk_') && !key.includes('your_key'))
}

/** @returns {Promise<import('@stripe/stripe-js').Stripe | null>} */
export function getStripe() {
  if (!isStripeConfigured()) return Promise.resolve(null)
  if (!stripePromise) {
    stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
  }
  return stripePromise
}
