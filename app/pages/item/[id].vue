<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { ImageIcon } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { useApi } from '~/services'
import { CATEGORIES, CONDITIONS, STATES, labelFor } from '~/lib/options'
import { formatPrice } from '~/lib/format'
import type { Item } from '~/types/item'

definePageMeta({ layout: 'guest' })

const route = useRoute()
const api = useApi()

const { data: item, status, error } = await useAsyncData(
  `item-${route.params.id}`,
  async () => (await api.items.show(String(route.params.id))).data as Item,
  { server: false },
)

onMounted(() => {
  api.items.recordView(String(route.params.id)).catch(() => {})
})

const notFound = computed(() => (error.value as any)?.statusCode === 404 || (error.value as any)?.data?.statusCode === 404)

watch(notFound, (missing) => {
  if (missing) showError(createError({ statusCode: 404, statusMessage: 'Item not found' }))
}, { immediate: true })
</script>

<template>
  <section class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <p v-if="status === 'pending' || status === 'idle'" class="text-gray-600">Loading item...</p>
    <p v-else-if="error" class="text-red-600">Could not load this item. Please try again later.</p>
    <div v-else-if="item" class="grid md:grid-cols-2 gap-10">
      <div class="aspect-square bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
        <img v-if="item.image_url" :src="item.image_url" :alt="item.name" class="w-full h-full object-cover" />
        <ImageIcon v-else class="w-16 h-16 text-gray-300" aria-hidden="true" />
      </div>
      <div>
        <div class="flex items-center gap-3 mb-2">
          <h1 class="text-3xl font-bold text-gray-900">{{ item.name }}</h1>
          <Badge v-if="item.status === 'sold'" variant="secondary">Sold</Badge>
        </div>
        <p class="text-2xl font-bold text-gray-900 mb-4">{{ formatPrice(item.price) }}</p>
        <dl class="grid grid-cols-2 gap-2 text-sm mb-6">
          <dt class="text-gray-500">Category</dt>
          <dd class="text-gray-900">{{ labelFor(CATEGORIES, item.category) }}</dd>
          <dt class="text-gray-500">Condition</dt>
          <dd class="text-gray-900">{{ labelFor(CONDITIONS, item.condition) }}</dd>
        </dl>
        <p class="text-gray-700 whitespace-pre-line mb-8">{{ item.description }}</p>
        <div v-if="item.shop" class="border border-gray-200 rounded-lg p-4">
          <p class="text-sm text-gray-500">Sold by</p>
          <NuxtLink :to="`/shops/${item.shop.id}`" class="text-lg font-semibold text-gray-900 underline">{{ item.shop.name }}</NuxtLink>
          <p class="text-sm text-gray-600">{{ labelFor(STATES, item.shop.state) }}</p>
          <p class="text-sm text-gray-600 mt-2">Open the shop page for its address, hours and contact details.</p>
        </div>
      </div>
    </div>
  </section>
</template>
