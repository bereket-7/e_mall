import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { computeTotals, validateCouponCode } from '../lib/pricing.js'

const COUPONS = {
  SAVE10: { type: 'percentage', discount: 0.1, value: 0.1 },
  FREESHIP: { type: 'free_shipping', discount: 0, value: 0 }
}

describe('pricing', () => {
  it('computes subtotal tax and free shipping over 50', () => {
    const totals = computeTotals([{ price: 40, quantity: 2 }], null, 'standard')
    assert.equal(totals.subtotal, 80)
    assert.equal(totals.shipping, 0)
    assert.ok(Math.abs(totals.tax - 6.4) < 0.001)
    assert.ok(Math.abs(totals.grandTotal - 86.4) < 0.001)
  })

  it('applies SAVE10 percentage coupon', () => {
    const coupon = validateCouponCode('SAVE10', COUPONS)
    const totals = computeTotals([{ price: 100, quantity: 1 }], coupon, 'standard')
    assert.ok(Math.abs(totals.discountAmount - 10) < 0.001)
    assert.ok(Math.abs(totals.grandTotal - 97.2) < 0.001)
  })

  it('applies FREESHIP coupon', () => {
    const coupon = validateCouponCode('FREESHIP', COUPONS)
    const totals = computeTotals([{ price: 20, quantity: 1 }], coupon, 'standard')
    assert.equal(totals.shipping, 0)
  })
})
