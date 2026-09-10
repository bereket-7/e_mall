<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-8">Review Moderation</h1>
    <div class="space-y-4">
      <div v-for="r in reviews" :key="r.id" class="bg-white rounded-lg shadow-md p-4 flex justify-between">
        <div>
          <p class="font-medium">{{ r.name || r.profiles?.full_name || 'Customer' }} — {{ r.rating }}★</p>
          <p class="text-sm text-gray-600">{{ r.comment || r.body }}</p>
          <p class="text-xs text-gray-400 mt-1">{{ r.products?.name || '' }}</p>
        </div>
        <div class="space-x-2">
          <button class="text-green-600 text-sm" @click="moderate(r.id, true)">Approve</button>
          <button class="text-red-600 text-sm" @click="moderate(r.id, false)">Hide</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { fetchAllReviewsForModeration, setReviewModerated } from '../../services/reviews'
import { useNotification } from '../../composables/useNotification'

const { notify } = useNotification()
const reviews = ref([])

const load = async () => {
  reviews.value = await fetchAllReviewsForModeration()
}

const moderate = async (id, moderated) => {
  await setReviewModerated(id, moderated)
  notify({ type: 'success', title: moderated ? 'Approved' : 'Hidden' })
  await load()
}

onMounted(load)
</script>
