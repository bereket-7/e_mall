<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-3xl mx-auto px-4 py-16">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">{{ title }}</h1>
      <div class="prose max-w-none text-gray-700 space-y-4">
        <p v-for="(para, i) in paragraphs" :key="i">{{ para }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  page: { type: String, required: true }
})

const content = {
  shipping: {
    title: 'Shipping Policy',
    paragraphs: [
      'Orders over $50 qualify for free standard shipping within the contiguous US.',
      'Standard shipping typically arrives in 5–7 business days. Express shipping arrives in 2–3 business days.',
      'You will receive tracking information once your order ships.'
    ]
  },
  returns: {
    title: 'Returns & Refunds',
    paragraphs: [
      'We offer a 30-day money-back guarantee on unused items in original packaging.',
      'Start a return from your order history. Refunds are issued to the original payment method within 5–10 business days after we receive the return.'
    ]
  },
  privacy: {
    title: 'Privacy Policy',
    paragraphs: [
      'We collect account, order, and device information to operate E-Mall.',
      'We do not sell personal data. Payment details are processed by Stripe and never stored on our servers.',
      'Contact support@emall.com for privacy requests.'
    ]
  },
  terms: {
    title: 'Terms of Service',
    paragraphs: [
      'By using E-Mall you agree to these terms and our acceptable use policies.',
      'Prices and availability may change without notice. Orders are subject to acceptance and stock confirmation.'
    ]
  }
}

const title = computed(() => content[props.page]?.title || 'Page')
const paragraphs = computed(() => content[props.page]?.paragraphs || [])
</script>
