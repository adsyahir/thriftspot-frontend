<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ItemForm from '~/components/item/ItemForm.vue'
import { useApi } from '~/services'
import type { Item } from '~/types/item'

definePageMeta({
  middleware: 'auth',
  layout: 'auth'
})

const route = useRoute()
const api = useApi()

const item = ref<Item | null>(null)
const loading = ref(true)
const loadError = ref<string | null>(null)

onMounted(async () => {
  try {
    const response = await api.items.showMine(String(route.params.id))
    item.value = response.data
  } catch (error: any) {
    loadError.value = error.statusCode === 403 || error.statusCode === 404
      ? 'This item was not found or is not yours.'
      : error.message || 'Could not load the item.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-900">Edit Item</h1>
    <p class="text-gray-600 mt-2 mb-6">Update your item listing.</p>
    <p v-if="loading" class="text-gray-600">Loading item...</p>
    <p v-else-if="loadError" class="text-red-600">
      {{ loadError }} <NuxtLink to="/items" class="underline">Back to items</NuxtLink>
    </p>
    <ItemForm v-else-if="item" :item="item" @saved="navigateTo('/items')" />
  </div>
</template>
