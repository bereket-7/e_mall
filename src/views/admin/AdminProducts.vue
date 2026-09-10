<template>
  <div class="p-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold">Products Management</h1>
      <button class="bg-blue-600 text-white px-4 py-2 rounded-lg" @click="openCreate">Add Product</button>
    </div>

    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <input
        v-model="search"
        placeholder="Search products…"
        class="m-4 px-3 py-2 border rounded-lg w-64"
        @input="load"
      />
      <table class="min-w-full text-sm">
        <thead class="bg-gray-50 text-left">
          <tr>
            <th class="px-4 py-3">Name</th>
            <th class="px-4 py-3">Brand</th>
            <th class="px-4 py-3">Price</th>
            <th class="px-4 py-3">Stock</th>
            <th class="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in filtered" :key="p.id" class="border-t">
            <td class="px-4 py-3">{{ p.name }}</td>
            <td class="px-4 py-3">{{ p.brand }}</td>
            <td class="px-4 py-3">${{ p.price }}</td>
            <td class="px-4 py-3">{{ p.stockCount }}</td>
            <td class="px-4 py-3 space-x-2">
              <button class="text-blue-600" @click="edit(p)">Edit</button>
              <button class="text-red-600" @click="remove(p.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="form" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-lg space-y-3">
        <h2 class="text-xl font-semibold">{{ form.id ? 'Edit' : 'Add' }} Product</h2>
        <input v-model="form.name" placeholder="Name" class="w-full border rounded px-3 py-2" />
        <input v-model="form.brand" placeholder="Brand" class="w-full border rounded px-3 py-2" />
        <input v-model.number="form.price" type="number" placeholder="Price" class="w-full border rounded px-3 py-2" />
        <input v-model.number="form.stockCount" type="number" placeholder="Stock" class="w-full border rounded px-3 py-2" />
        <select v-model="form.category" class="w-full border rounded px-3 py-2">
          <option value="electronics">Electronics</option>
          <option value="fashion">Fashion</option>
          <option value="home">Home</option>
          <option value="books">Books</option>
          <option value="sports">Sports</option>
        </select>
        <textarea v-model="form.description" class="w-full border rounded px-3 py-2" rows="3" />
        <input v-model="form.imageUrl" placeholder="Image URL" class="w-full border rounded px-3 py-2" />
        <div class="flex justify-end gap-2">
          <button @click="form = null">Cancel</button>
          <button class="bg-blue-600 text-white px-4 py-2 rounded" @click="save">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../../services/products'
import { useNotification } from '../../composables/useNotification'

const { notify } = useNotification()
const products = ref([])
const search = ref('')
const form = ref(null)

const filtered = computed(() => {
  const q = search.value.toLowerCase()
  return products.value.filter(
    (p) => !q || p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
  )
})

const load = async () => {
  const res = await fetchProducts({ page: 1, pageSize: 100, priceMax: 100000 })
  products.value = res.products
}

const openCreate = () => {
  form.value = {
    name: '',
    brand: '',
    price: 0,
    stockCount: 0,
    category: 'electronics',
    description: '',
    imageUrl: '',
    inStock: true,
    images: [],
    variants: [],
    features: [],
    rating: 0,
    reviewCount: 0,
    discount: 0,
    originalPrice: 0
  }
}

const edit = (p) => {
  form.value = {
    ...p,
    imageUrl: p.images?.[0] || ''
  }
}

const save = async () => {
  const payload = {
    ...form.value,
    images: form.value.imageUrl ? [form.value.imageUrl] : form.value.images || [],
    originalPrice: form.value.originalPrice || form.value.price,
    inStock: form.value.stockCount > 0,
    slug: (form.value.slug || form.value.name || '').toLowerCase().replace(/\s+/g, '-')
  }
  if (form.value.id) await updateProduct(form.value.id, payload)
  else await createProduct(payload)
  form.value = null
  await load()
  notify({ type: 'success', title: 'Product saved' })
}

const remove = async (id) => {
  await deleteProduct(id)
  await load()
  notify({ type: 'success', title: 'Product deleted' })
}

onMounted(load)
</script>
