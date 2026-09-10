<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="text-center mb-6">
              <img
                :src="user.avatar || 'https://via.placeholder.com/100'"
                :alt="user.name"
                class="w-20 h-20 rounded-full mx-auto mb-4"
              />
              <h2 class="text-xl font-semibold">{{ user.name }}</h2>
              <p class="text-gray-600">{{ user.email }}</p>
            </div>
            <nav class="space-y-2">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="[
                  'w-full text-left px-3 py-2 rounded-lg',
                  activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                ]"
              >
                {{ tab.label }}
              </button>
            </nav>
          </div>
        </div>

        <div class="lg:col-span-2">
          <div v-if="activeTab === 'profile'" class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold mb-6">Profile Information</h3>
            <form @submit.prevent="updateProfile" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input v-model="profileForm.firstName" placeholder="First name" class="px-3 py-2 border rounded-lg" />
                <input v-model="profileForm.lastName" placeholder="Last name" class="px-3 py-2 border rounded-lg" />
              </div>
              <input v-model="profileForm.email" type="email" class="w-full px-3 py-2 border rounded-lg" />
              <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded-lg">Save Changes</button>
            </form>
          </div>

          <div v-if="activeTab === 'orders'" class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold mb-6">Order History</h3>
            <div v-if="!orders.length" class="text-gray-600">No orders yet.</div>
            <div v-for="order in orders" :key="order.id" class="border rounded-lg p-4 mb-3">
              <div class="flex justify-between">
                <div>
                  <h4 class="font-medium">Order {{ order.id }}</h4>
                  <p class="text-sm text-gray-600">{{ formatDate(order.date) }}</p>
                </div>
                <div class="text-right">
                  <p class="font-medium">${{ Number(order.total).toFixed(2) }}</p>
                  <span class="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">{{
                    order.status
                  }}</span>
                </div>
              </div>
              <router-link :to="`/track/${order.id}`" class="text-blue-600 text-sm">Track Order →</router-link>
            </div>
          </div>

          <div v-if="activeTab === 'addresses'" class="bg-white rounded-lg shadow-md p-6">
            <div class="flex justify-between mb-6">
              <h3 class="text-lg font-semibold">Saved Addresses</h3>
              <button class="text-blue-600 text-sm" @click="editing = {}">Add address</button>
            </div>
            <div v-if="editing" class="border rounded-lg p-4 mb-4 space-y-2">
              <input v-model="editing.label" placeholder="Label" class="w-full border rounded px-3 py-2" />
              <input v-model="editing.line1" placeholder="Address" class="w-full border rounded px-3 py-2" />
              <div class="grid grid-cols-2 gap-2">
                <input v-model="editing.city" placeholder="City" class="border rounded px-3 py-2" />
                <input v-model="editing.postal" placeholder="Postal" class="border rounded px-3 py-2" />
              </div>
              <input v-model="editing.country" placeholder="Country" class="w-full border rounded px-3 py-2" />
              <label class="flex items-center text-sm">
                <input v-model="editing.isDefault" type="checkbox" class="mr-2" /> Default
              </label>
              <div class="flex gap-2">
                <button class="bg-blue-600 text-white px-4 py-2 rounded" @click="saveAddress">Save</button>
                <button class="px-4 py-2" @click="editing = null">Cancel</button>
              </div>
            </div>
            <div v-if="!addresses.length && !editing" class="text-gray-600">No saved addresses yet.</div>
            <div v-for="a in addresses" :key="a.id" class="border rounded-lg p-4 mb-2 flex justify-between">
              <div>
                <p class="font-medium">{{ a.label }} <span v-if="a.isDefault" class="text-xs text-blue-600">Default</span></p>
                <p class="text-sm text-gray-600">{{ a.line1 }}, {{ a.city }} {{ a.postal }}</p>
              </div>
              <div class="space-x-2 text-sm">
                <button class="text-blue-600" @click="editing = { ...a }">Edit</button>
                <button class="text-red-600" @click="removeAddress(a.id)">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useNotification } from '../composables/useNotification'
import { fetchOrdersForUser } from '../services/orders'
import { fetchAddresses, saveAddress as saveAddressService, deleteAddress } from '../services/addresses'

const authStore = useAuthStore()
const { notify } = useNotification()
const activeTab = ref('profile')
const orders = ref([])
const addresses = ref([])
const editing = ref(null)

const tabs = [
  { id: 'profile', label: 'Profile Information' },
  { id: 'orders', label: 'Order History' },
  { id: 'addresses', label: 'Addresses' }
]

const user = computed(() => authStore.user || {})
const profileForm = ref({ firstName: '', lastName: '', email: '' })

const formatDate = (date) => new Date(date).toLocaleDateString()

const updateProfile = async () => {
  const result = await authStore.updateProfile({
    firstName: profileForm.value.firstName,
    lastName: profileForm.value.lastName,
    name: `${profileForm.value.firstName} ${profileForm.value.lastName}`.trim(),
    email: profileForm.value.email
  })
  notify({
    type: result.success ? 'success' : 'error',
    title: result.success ? 'Profile updated' : 'Update failed',
    message: result.message || (result.success ? 'Your profile has been updated successfully.' : '')
  })
}

const saveAddress = async () => {
  await saveAddressService(authStore.user?.id, editing.value)
  addresses.value = await fetchAddresses(authStore.user?.id)
  editing.value = null
  notify({ type: 'success', title: 'Address saved' })
}

const removeAddress = async (id) => {
  await deleteAddress(authStore.user?.id, id)
  addresses.value = await fetchAddresses(authStore.user?.id)
}

onMounted(async () => {
  if (user.value) {
    const nameParts = user.value.name?.split(' ') || []
    profileForm.value.firstName = nameParts[0] || ''
    profileForm.value.lastName = nameParts.slice(1).join(' ') || ''
    profileForm.value.email = user.value.email || ''
  }
  orders.value = await fetchOrdersForUser(authStore.user?.id)
  addresses.value = await fetchAddresses(authStore.user?.id)
})
</script>
