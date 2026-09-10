<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-8">Orders Management</h1>
    <div class="mb-4">
      <select v-model="statusFilter" class="border rounded px-3 py-2" @change="load">
        <option value="">All statuses</option>
        <option value="confirmed">Confirmed</option>
        <option value="processing">Processing</option>
        <option value="shipped">Shipped</option>
        <option value="delivered">Delivered</option>
        <option value="cancelled">Cancelled</option>
      </select>
    </div>
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <table class="min-w-full text-sm">
        <thead class="bg-gray-50 text-left">
          <tr>
            <th class="px-4 py-3">Order</th>
            <th class="px-4 py-3">Customer</th>
            <th class="px-4 py-3">Total</th>
            <th class="px-4 py-3">Status</th>
            <th class="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="o in filtered" :key="o.id" class="border-t">
            <td class="px-4 py-3">{{ o.id }}</td>
            <td class="px-4 py-3">
              {{
                o.customerName ||
                `${o.shippingAddress?.firstName || ''} ${o.shippingAddress?.lastName || ''}`.trim() ||
                '—'
              }}
            </td>
            <td class="px-4 py-3">${{ Number(o.total || 0).toFixed(2) }}</td>
            <td class="px-4 py-3">
              <select
                :value="o.status"
                class="border rounded px-2 py-1"
                @change="changeStatus(o.id, $event.target.value)"
              >
                <option value="confirmed">confirmed</option>
                <option value="processing">processing</option>
                <option value="shipped">shipped</option>
                <option value="delivered">delivered</option>
                <option value="cancelled">cancelled</option>
              </select>
            </td>
            <td class="px-4 py-3">
              <button class="text-blue-600" @click="selected = o">Details</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="selected" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-lg">
        <h2 class="text-xl font-semibold mb-4">Order {{ selected.id }}</h2>
        <p class="text-sm mb-2">Status: {{ selected.status }}</p>
        <ul class="text-sm space-y-1 mb-4">
          <li v-for="(item, i) in selected.items" :key="i">
            {{ item.name || item.id }} × {{ item.quantity }} — ${{ Number(item.price || item.unit_price || 0).toFixed(2) }}
          </li>
        </ul>
        <input
          v-model="tracking"
          placeholder="Tracking number"
          class="w-full border rounded px-3 py-2 mb-3"
        />
        <div class="flex justify-end gap-2">
          <button @click="selected = null">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { fetchAllOrders, updateOrderStatus } from '../../services/orders'
import { useNotification } from '../../composables/useNotification'

const { notify } = useNotification()
const orders = ref([])
const statusFilter = ref('')
const selected = ref(null)
const tracking = ref('')

const filtered = computed(() =>
  orders.value.filter((o) => !statusFilter.value || o.status === statusFilter.value)
)

const load = async () => {
  orders.value = await fetchAllOrders()
}

const changeStatus = async (id, status) => {
  await updateOrderStatus(id, status, `Status changed to ${status}`)
  notify({ type: 'success', title: 'Order updated' })
  await load()
}

onMounted(load)
</script>
