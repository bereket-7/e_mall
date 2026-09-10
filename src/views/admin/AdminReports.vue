<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-8">Reports & Analytics</h1>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-lg font-semibold mb-4">Sales by day</h2>
        <Bar v-if="chartData" :data="chartData" :options="{ responsive: true }" />
      </div>
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-lg font-semibold mb-4">Low stock</h2>
        <ul class="space-y-2 text-sm">
          <li v-for="p in report.lowStock" :key="p.id" class="flex justify-between border-b py-2">
            <span>{{ p.name }}</span>
            <span class="text-red-600">{{ p.stockCount ?? p.stock_count }} left</span>
          </li>
        </ul>
      </div>
      <div class="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
        <h2 class="text-lg font-semibold mb-4">Top products</h2>
        <ul class="grid md:grid-cols-2 gap-2 text-sm">
          <li v-for="p in report.topProducts" :key="p.id" class="border rounded p-3">
            {{ p.name }} — {{ p.reviewCount ?? p.review_count }} reviews
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
import { fetchSalesReport } from '../../services/admin'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const report = ref({ byDay: {}, lowStock: [], topProducts: [] })

const chartData = computed(() => {
  const labels = Object.keys(report.value.byDay).sort()
  if (!labels.length) return null
  return {
    labels,
    datasets: [
      {
        label: 'Sales ($)',
        backgroundColor: '#2563eb',
        data: labels.map((d) => report.value.byDay[d])
      }
    ]
  }
})

onMounted(async () => {
  report.value = await fetchSalesReport()
})
</script>
