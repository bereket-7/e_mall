<template>
  <div
    v-if="notification.show"
    :class="[
      'fixed top-4 right-4 z-50 max-w-sm bg-white rounded-lg shadow-lg border-l-4 p-4 transform transition-all duration-300',
      notification.type === 'success' ? 'border-green-500' : '',
      notification.type === 'error' ? 'border-red-500' : '',
      notification.type === 'warning' ? 'border-yellow-500' : '',
      notification.type === 'info' ? 'border-blue-500' : ''
    ]"
  >
    <div class="flex items-start">
      <!-- Icon -->
      <div class="flex-shrink-0">
        <!-- Success Icon -->
        <svg
          v-if="notification.type === 'success'"
          class="w-5 h-5 text-green-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
        </svg>
        
        <!-- Error Icon -->
        <svg
          v-else-if="notification.type === 'error'"
          class="w-5 h-5 text-red-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
        </svg>
        
        <!-- Warning Icon -->
        <svg
          v-else-if="notification.type === 'warning'"
          class="w-5 h-5 text-yellow-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
        </svg>
        
        <!-- Info Icon -->
        <svg
          v-else
          class="w-5 h-5 text-blue-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
        </svg>
      </div>
      
      <!-- Content -->
      <div class="ml-3 w-0 flex-1">
        <p class="text-sm font-medium text-gray-900">
          {{ notification.title }}
        </p>
        <p v-if="notification.message" class="mt-1 text-sm text-gray-500">
          {{ notification.message }}
        </p>
      </div>
      
      <!-- Close Button -->
      <div class="ml-4 flex-shrink-0 flex">
        <button
          @click="hideNotification"
          class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

const notification = reactive({
  show: false,
  type: 'info', // success, error, warning, info
  title: '',
  message: '',
  duration: 5000
})

let timeoutId = null

const showNotification = (config) => {
  // Clear existing timeout
  if (timeoutId) {
    clearTimeout(timeoutId)
  }

  // Update notification
  Object.assign(notification, {
    show: true,
    type: config.type || 'info',
    title: config.title || '',
    message: config.message || '',
    duration: config.duration || 5000
  })

  // Auto hide after duration
  if (notification.duration > 0) {
    timeoutId = setTimeout(() => {
      hideNotification()
    }, notification.duration)
  }
}

const hideNotification = () => {
  notification.show = false
  if (timeoutId) {
    clearTimeout(timeoutId)
    timeoutId = null
  }
}

// Global notification service
onMounted(() => {
  window.showNotification = showNotification
})

// Example usage:
// window.showNotification({
//   type: 'success',
//   title: 'Success!',
//   message: 'Product added to cart successfully'
// })
</script>