<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-8">Customers</h1>
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <table class="min-w-full text-sm">
        <thead class="bg-gray-50 text-left">
          <tr>
            <th class="px-4 py-3">Name</th>
            <th class="px-4 py-3">Email</th>
            <th class="px-4 py-3">Role</th>
            <th class="px-4 py-3">Orders</th>
            <th class="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in customers" :key="c.id" class="border-t">
            <td class="px-4 py-3">{{ c.name }}</td>
            <td class="px-4 py-3">{{ c.email }}</td>
            <td class="px-4 py-3">
              <select
                :value="c.role"
                class="border rounded px-2 py-1"
                @change="setRole(c.id, $event.target.value)"
              >
                <option value="customer">customer</option>
                <option value="admin">admin</option>
              </select>
            </td>
            <td class="px-4 py-3">{{ c.orderCount }}</td>
            <td class="px-4 py-3">—</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { fetchCustomers, updateCustomerRole } from '../../services/admin'
import { useNotification } from '../../composables/useNotification'

const { notify } = useNotification()
const customers = ref([])

const load = async () => {
  customers.value = await fetchCustomers()
}

const setRole = async (id, role) => {
  await updateCustomerRole(id, role)
  notify({ type: 'success', title: 'Role updated' })
  await load()
}

onMounted(load)
</script>
