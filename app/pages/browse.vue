<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { Input } from '@/components/ui/input'
import ItemCard from '~/components/item/ItemCard.vue'
import Pager from '~/components/Pager.vue'
import { useApi } from '~/services'
import { CATEGORIES, STATES } from '~/lib/options'
import type { Item, PageMeta } from '~/types/item'

definePageMeta({ layout: 'guest' })

const route = useRoute()
const router = useRouter()
const api = useApi()

const query = (key: string) => {
  const value = route.query[key]
  return typeof value === 'string' ? value : ''
}

const search = ref(query('search'))

const params = computed(() => ({
  search: query('search') || undefined,
  category: query('category') || undefined,
  state: query('state') || undefined,
  sort: (query('sort') || undefined) as 'newest' | 'price_asc' | 'price_desc' | undefined,
  page: Number(query('page')) || 1,
}))

const { data, status, error, refresh } = await useAsyncData(
  'browse-items',
  async () => {
    const response = await api.items.browse(params.value)
    return { items: response.data as Item[], meta: response.meta as PageMeta | null }
  },
  { server: false, watch: [params] },
)

function setQuery(patch: Record<string, string | number | undefined>) {
  const next: Record<string, string> = {}
  for (const [key, value] of Object.entries({ ...route.query, ...patch })) {
    if (value !== undefined && value !== '' && value !== null) next[key] = String(value)
  }
  router.push({ path: '/browse', query: next })
}

const applySearch = useDebounceFn((value: string) => setQuery({ search: value, page: undefined }), 300)
watch(search, (value) => applySearch(value))

const selectClass = 'px-3 py-2 border border-gray-300 rounded-md text-sm bg-white'
</script>

<template>
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <h1 class="text-3xl font-bold text-gray-900 mb-6">Browse items</h1>

    <div class="flex flex-wrap gap-3 mb-8">
      <Input v-model="search" type="search" placeholder="Search items or shops" aria-label="Search items or shops" class="max-w-xs" />
      <select :value="query('category')" aria-label="Category" :class="selectClass" @change="setQuery({ category: ($event.target as HTMLSelectElement).value, page: undefined })">
        <option value="">All categories</option>
        <option v-for="c in CATEGORIES" :key="c.value" :value="c.value">{{ c.label }}</option>
      </select>
      <select :value="query('state')" aria-label="State" :class="selectClass" @change="setQuery({ state: ($event.target as HTMLSelectElement).value, page: undefined })">
        <option value="">All states</option>
        <option v-for="s in STATES" :key="s.value" :value="s.value">{{ s.label }}</option>
      </select>
      <select :value="query('sort') || 'newest'" aria-label="Sort" :class="selectClass" @change="setQuery({ sort: ($event.target as HTMLSelectElement).value, page: undefined })">
        <option value="newest">Newest</option>
        <option value="price_asc">Price: low to high</option>
        <option value="price_desc">Price: high to low</option>
      </select>
    </div>

    <p v-if="status === 'pending' || status === 'idle'" class="text-gray-600">Loading items...</p>
    <div v-else-if="error" class="text-red-600">
      Could not load items. <button class="underline" @click="refresh()">Try again</button>
    </div>
    <p v-else-if="!data?.items.length" class="bg-gray-50 rounded-lg p-10 text-center text-gray-600">
      No items match your filters.
    </p>
    <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <ItemCard v-for="item in data.items" :key="item.id" :item="item" />
    </div>

    <Pager :meta="data?.meta ?? null" @change="setQuery({ page: $event })" />
  </section>
</template>
