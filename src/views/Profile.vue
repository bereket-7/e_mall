<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Profile Navigation -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="text-center mb-6">
              <img
                :src="user.avatar || 'https://via.placeholder.com/100'"
                :alt="user.name"
                class="w-20 h-20 rounded-full mx-auto mb-4"
              >
              <h2 class="text-xl font-semibold text-gray-900">{{ user.name }}</h2>
              <p class="text-gray-600">{{ user.email }}</p>
            </div>
            
            <nav class="space-y-2">
              <button
                @click="activeTab = 'profile'"
                :class="[
                  'w-full text-left px-3 py-2 rounded-lg transition-colors',
                  activeTab === 'profile' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                ]"
              >
                Profile Information
              </button>
              <button
                @click="activeTab = 'orders'"
                :class="[
                  'w-full text-left px-3 py-2 rounded-lg transition-colors',
                  activeTab === 'orders' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                ]"
              >
                Order History
              </button>
              <button
                @click="activeTab = 'addresses'"
                :class="[
                  'w-full text-left px-3 py-2 rounded-lg transition-colors',
                  activeTab === 'addresses' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                ]"
              >
                Addresses
              </button>
            </nav>
          </div>
        </div>

        <!-- Profile Content -->
        <div class="lg:col-span-2">
          <!-- Profile Information Tab -->
          <div v-if="activeTab === 'profile'" class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-6">Profile Information</h3>
            <form @submit.prevent="updateProfile" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    v-model="profileForm.firstName"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    v-model="profileForm.lastName"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  v-model="profileForm.email"
                  type="email"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
              </div>
              
              <button
                type="submit"
                class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </form>
          </div>

          <!-- Order History Tab -->
          <div v-if="activeTab === 'orders'" class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-6">Order History</h3>
            <div class="space-y-4">
              <div
                v-for="order in orders"
                :key="order.id"
                class="border border-gray-200 rounded-lg p-4"
              >
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <h4 class="font-medium text-gray-900">Order {{ order.id }}</h4>
                    <p class="text-sm text-gray-600">{{ formatDate(order.date) }}</p>
                  </div>
                  <div class="text-right">
                    <p class="font-medium text-gray-900">${{ order.total.toFixed(2) }}</p>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {{ order.status }}
                    </span>
                  </div>
                </div>
                <p class="text-sm text-gray-600">{{ order.items.length }} items</p>
                <router-link
                  :to="`/track/${order.id}`"
                  class="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Track Order →
                </router-link>
              </div>
            </div>
          </div>

          <!-- Addresses Tab -->
          <div v-if="activeTab === 'addresses'" class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-6">Saved Addresses</h3>
            <p class="text-gray-600">No saved addresses yet.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const activeTab = ref('profile')
const orders = ref([])

const user = computed(() => authStore.user || {})

const profileForm = ref({
  firstName: '',
  lastName: '',
  email: ''
})

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}

const updateProfile = () => {
  window.showNotification({
    type: 'success',
    title: 'Profile updated',
    message: 'Your profile has been updated successfully.'
  })
}

onMounted(() => {
  // Load user data into form
  if (user.value) {
    const nameParts = user.value.name?.split(' ') || []
    profileForm.value.firstName = nameParts[0] || ''
    profileForm.value.lastName = nameParts.slice(1).join(' ') || ''
    profileForm.value.email = user.value.email || ''
  }
  
  // Load orders from localStorage
  orders.value = JSON.parse(localStorage.getItem('orders') || '[]')
})
</script>