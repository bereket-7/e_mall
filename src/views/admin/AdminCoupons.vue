<template>
  <div class="p-8">
    <div class="flex justify-between mb-8">
      <h1 class="text-3xl font-bold">Coupons</h1>
      <button class="bg-blue-600 text-white px-4 py-2 rounded-lg" @click="openNew">Add Coupon</button>
    </div>
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <table class="min-w-full text-sm">
        <thead class="bg-gray-50 text-left">
          <tr>
            <th class="px-4 py-3">Code</th>
            <th class="px-4 py-3">Type</th>
            <th class="px-4 py-3">Value</th>
            <th class="px-4 py-3">Active</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in coupons" :key="c.code" class="border-t">
            <td class="px-4 py-3 font-mono">{{ c.code }}</td>
            <td class="px-4 py-3">{{ c.type }}</td>
            <td class="px-4 py-3">{{ c.value ?? c.discount }}</td>
            <td class="px-4 py-3">{{ c.active !== false ? 'Yes' : 'No' }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="form" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md space-y-3">
        <h2 class="text-xl font-semibold">Coupon</h2>
        <input v-model="form.code" placeholder="CODE" class="w-full border rounded px-3 py-2 uppercase" />
        <select v-model="form.type" class="w-full border rounded px-3 py-2">
          <option value="percentage">percentage</option>
          <option value="fixed">fixed</option>
          <option value="free_shipping">free_shipping</option>
        </select>
        <input v-model.number="form.value" type="number" step="0.01" class="w-full border rounded px-3 py-2" />
        <div class="flex justify-end gap-2">
          <button @click="form = null">Cancel</button>
          <button class="bg-blue-600 text-white px-4 py-2 rounded" @click="save">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { fetchCoupons, upsertCoupon } from '../../services/admin'
import { useNotification } from '../../composables/useNotification'

const { notify } = useNotification()
const coupons = ref([])
const form = ref(null)

const load = async () => {
  coupons.value = await fetchCoupons()
}

const openNew = () => {
  form.value = { code: '', type: 'percentage', value: 0.1, active: true }
}

const save = async () => {
  form.value.code = form.value.code.toUpperCase()
  await upsertCoupon(form.value)
  form.value = null
  await load()
  notify({ type: 'success', title: 'Coupon saved' })
}

onMounted(load)
</script>
