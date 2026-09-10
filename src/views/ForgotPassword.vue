<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="max-w-md w-full bg-white shadow-md rounded-lg p-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-2">Forgot password</h1>
      <p class="text-gray-600 mb-6">Enter your email and we'll send a reset link.</p>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <input
          v-model="email"
          type="email"
          required
          placeholder="you@example.com"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {{ loading ? 'Sending…' : 'Send reset link' }}
        </button>
      </form>
      <router-link to="/login" class="block mt-4 text-sm text-blue-600">Back to login</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useNotification } from '../composables/useNotification'

const authStore = useAuthStore()
const { notify } = useNotification()
const email = ref('')
const loading = ref(false)

const handleSubmit = async () => {
  loading.value = true
  const result = await authStore.requestPasswordReset(email.value)
  loading.value = false
  notify({
    type: result.success ? 'success' : 'error',
    title: result.success ? 'Check your email' : 'Error',
    message: result.success
      ? 'If an account exists, a reset link was sent.'
      : result.message || 'Failed to send reset email'
  })
}
</script>
