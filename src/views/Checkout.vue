<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Checkout</h1>
        <div class="flex items-center space-x-2 text-sm text-gray-500 mt-2">
          <router-link to="/cart" class="hover:text-blue-600">Cart</router-link>
          <span>→</span>
          <span class="text-gray-900">Checkout</span>
        </div>
      </div>

      <div v-if="cartStore.items.length === 0" class="text-center py-16">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
        <router-link
          to="/products"
          class="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700"
        >
          Continue Shopping
        </router-link>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="space-y-8">
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-semibold mb-6">Contact Information</h2>
            <input
              v-model="form.email"
              type="email"
              required
              class="w-full px-3 py-2 border rounded-lg"
              placeholder="john@example.com"
            />
            <label class="flex items-center mt-3 text-sm">
              <input v-model="form.subscribe" type="checkbox" class="mr-2" />
              Email me with news and offers
            </label>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-xl font-semibold">Shipping Address</h2>
              <select
                v-if="addresses.length"
                class="text-sm border rounded px-2 py-1"
                @change="applySavedAddress($event.target.value)"
              >
                <option value="">Saved addresses…</option>
                <option v-for="a in addresses" :key="a.id" :value="a.id">
                  {{ a.label }} — {{ a.line1 }}
                </option>
              </select>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input v-model="form.firstName" required placeholder="First name" class="px-3 py-2 border rounded-lg" />
              <input v-model="form.lastName" required placeholder="Last name" class="px-3 py-2 border rounded-lg" />
              <input
                v-model="form.address"
                required
                placeholder="Address"
                class="md:col-span-2 px-3 py-2 border rounded-lg"
              />
              <input v-model="form.city" required placeholder="City" class="px-3 py-2 border rounded-lg" />
              <input v-model="form.state" placeholder="State" class="px-3 py-2 border rounded-lg" />
              <input v-model="form.zipCode" required placeholder="ZIP" class="px-3 py-2 border rounded-lg" />
              <input v-model="form.country" required placeholder="Country" class="px-3 py-2 border rounded-lg" />
              <input v-model="form.phone" placeholder="Phone" class="md:col-span-2 px-3 py-2 border rounded-lg" />
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-semibold mb-4">Shipping Method</h2>
            <label
              v-for="method in shippingMethods"
              :key="method.id"
              class="flex items-center justify-between border rounded-lg p-3 mb-2 cursor-pointer"
              :class="cartStore.shippingMethodId === method.id ? 'border-blue-500 bg-blue-50' : ''"
            >
              <span class="flex items-center">
                <input
                  type="radio"
                  class="mr-3"
                  :value="method.id"
                  v-model="shippingMethod"
                />
                {{ method.name }} ({{ method.days }} days)
              </span>
              <span>${{ method.price.toFixed(2) }}</span>
            </label>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-semibold mb-4">Payment</h2>
            <p v-if="!stripeReady" class="text-sm text-gray-600 mb-4">
              Demo mode: payment will be simulated. Configure
              <code>VITE_STRIPE_PUBLISHABLE_KEY</code> for Stripe Payment Element.
            </p>
            <div ref="paymentElementRef" class="min-h-[120px]"></div>
          </div>
        </div>

        <div>
          <div class="bg-white rounded-lg shadow-md p-6 sticky top-8">
            <h2 class="text-xl font-semibold mb-4">Order Summary</h2>
            <div class="space-y-2 text-sm mb-4">
              <div v-for="item in cartStore.items" :key="item.cartId" class="flex justify-between">
                <span>{{ item.name }} × {{ item.quantity }}</span>
                <span>${{ (item.price * item.quantity).toFixed(2) }}</span>
              </div>
            </div>
            <div class="space-y-2 text-sm border-t pt-4">
              <div class="flex justify-between"><span>Subtotal</span><span>${{ cartStore.subtotal.toFixed(2) }}</span></div>
              <div v-if="cartStore.discountAmount" class="flex justify-between text-green-600">
                <span>Discount</span><span>-${{ cartStore.discountAmount.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between"><span>Tax</span><span>${{ cartStore.tax.toFixed(2) }}</span></div>
              <div class="flex justify-between"><span>Shipping</span><span>${{ cartStore.shipping.toFixed(2) }}</span></div>
              <div class="flex justify-between text-lg font-semibold border-t pt-2">
                <span>Total</span><span>${{ cartStore.grandTotal.toFixed(2) }}</span>
              </div>
            </div>
            <button
              type="submit"
              :disabled="loading"
              class="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {{ loading ? 'Processing…' : 'Place Order' }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'
import { useNotification } from '../composables/useNotification'
import { SHIPPING_METHODS } from '../lib/config'
import { getStripe, isStripeConfigured } from '../lib/stripe'
import { createOrder, createPaymentIntent } from '../services/orders'
import { fetchAddresses } from '../services/addresses'
import { subscribeNewsletter } from '../services/newsletter'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()
const { notify } = useNotification()

const loading = ref(false)
const addresses = ref([])
const shippingMethods = SHIPPING_METHODS
const shippingMethod = ref(cartStore.shippingMethodId)
const paymentElementRef = ref(null)
const stripeReady = ref(false)
let stripe = null
let elements = null

const form = ref({
  email: authStore.user?.email || '',
  subscribe: false,
  firstName: '',
  lastName: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'US',
  phone: ''
})

watch(shippingMethod, (id) => cartStore.setShippingMethod(id))

const applySavedAddress = (id) => {
  const a = addresses.value.find((x) => String(x.id) === String(id))
  if (!a) return
  form.value.address = a.line1 || a.address
  form.value.city = a.city
  form.value.state = a.state || ''
  form.value.zipCode = a.postal || a.zipCode
  form.value.country = a.country || 'US'
  form.value.phone = a.phone || ''
}

onMounted(async () => {
  if (authStore.user?.name) {
    const parts = authStore.user.name.split(' ')
    form.value.firstName = parts[0] || ''
    form.value.lastName = parts.slice(1).join(' ') || ''
  }
  addresses.value = await fetchAddresses(authStore.user?.id)

  if (isStripeConfigured() && cartStore.items.length) {
    try {
      stripe = await getStripe()
      const intent = await createPaymentIntent({
        items: cartStore.items.map((i) => ({ id: i.id, quantity: i.quantity })),
        couponCode: cartStore.appliedCoupon?.code,
        shippingMethodId: cartStore.shippingMethodId,
        amount: cartStore.grandTotal
      })
      elements = stripe.elements({ clientSecret: intent.clientSecret })
      const paymentElement = elements.create('payment')
      paymentElement.mount(paymentElementRef.value)
      stripeReady.value = true
      window.__emallPaymentIntentId = intent.paymentIntentId
    } catch (e) {
      console.warn('Stripe init failed, using demo checkout', e)
    }
  }
})

onBeforeUnmount(() => {
  elements = null
})

const handleSubmit = async () => {
  loading.value = true
  try {
    let paymentIntentId = window.__emallPaymentIntentId || null

    if (stripeReady.value && stripe && elements) {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required'
      })
      if (error) throw new Error(error.message)
      paymentIntentId = paymentIntent?.id || paymentIntentId
    } else {
      await new Promise((r) => setTimeout(r, 800))
      paymentIntentId = 'pi_mock_' + Date.now()
    }

    if (form.value.subscribe) {
      try {
        await subscribeNewsletter(form.value.email)
      } catch {
        /* ignore */
      }
    }

    const order = await createOrder({
      userId: authStore.user?.id,
      items: cartStore.items,
      subtotal: cartStore.subtotal,
      tax: cartStore.tax,
      shipping: cartStore.shipping,
      discount: cartStore.discountAmount,
      total: cartStore.grandTotal,
      currency: 'USD',
      shippingAddress: {
        firstName: form.value.firstName,
        lastName: form.value.lastName,
        address: form.value.address,
        city: form.value.city,
        state: form.value.state,
        zipCode: form.value.zipCode,
        country: form.value.country,
        phone: form.value.phone
      },
      stripePaymentIntentId: paymentIntentId
    })

    cartStore.clearCart()
    notify({
      type: 'success',
      title: 'Order placed successfully!',
      message: `Order ${order.id} has been confirmed.`
    })
    router.push(`/track/${order.id}`)
  } catch (error) {
    notify({
      type: 'error',
      title: 'Order failed',
      message: error.message || 'There was an error processing your order.'
    })
  } finally {
    loading.value = false
  }
}
</script>
