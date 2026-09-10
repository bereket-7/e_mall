import { TAX_RATE, SHIPPING_METHODS } from './config.js'

export function validateCouponCode(code, coupons) {
  const key = (code || '').toUpperCase()
  return coupons[key] ? { ...coupons[key], code: key } : null
}

export function computeTotals(items, coupon, shippingMethodId = 'standard') {
  const subtotal = items.reduce((t, i) => t + i.price * i.quantity, 0)
  const method = SHIPPING_METHODS.find((m) => m.id === shippingMethodId) || SHIPPING_METHODS[0]
  let shipping = subtotal > 50 && method.id === 'standard' ? 0 : method.price
  let discountAmount = 0

  if (coupon) {
    if (coupon.type === 'percentage') {
      discountAmount = subtotal * (coupon.discount ?? coupon.value)
    } else if (coupon.type === 'fixed') {
      discountAmount = coupon.discount ?? coupon.value
    } else if (coupon.type === 'free_shipping') {
      shipping = 0
    }
  }

  const taxable = Math.max(0, subtotal - discountAmount)
  const tax = taxable * TAX_RATE
  const grandTotal = taxable + tax + shipping

  return { subtotal, tax, shipping, discountAmount, grandTotal, shippingMethodId: method.id }
}
