<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="max-w-md w-full bg-white shadow-md rounded-lg p-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-2">Reset password</h1>
      <p class="text-gray-600 mb-6">Choose a new password for your account.</p>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <input
          v-model="password"
          type="password"
          required
          minlength="8"
          placeholder="New password"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <input
          v-model="confirm"
          type="password"
          required
          minlength="8"
          placeholder="Confirm password"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {{ loading ? 'Updating…' : 'Update password' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useNotification } from '../composables/useNotification'

const authStore = useAuthStore()
const router = useRouter()
const { notify } = useNotification()
const password = ref('')
const confirm = ref('')
const loading = ref(false)

const handleSubmit = async () => {
  if (password.value !== confirm.value) {
    notify({ type: 'error', title: 'Passwords do not match' })
    return
  }
  loading.value = true
  const result = await authStore.updatePassword(password.value)
  loading.value = false
  if (result.success) {
    notify({ type: 'success', title: 'Password updated' })
    router.push('/login')
  } else {
    notify({ type: 'error', title: 'Error', message: result.message })
  }
}
</script>
