<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { MapPin } from 'lucide-vue-next'
import { Input } from '@/components/ui/input'
import Pager from '~/components/Pager.vue'
import { useApi } from '~/services'
import { STATES, labelFor } from '~/lib/options'
import type { PageMeta } from '~/types/item'
import type { Shop } from '~/types/shop'

definePageMeta({ layout: 'guest' })

const route = useRoute()
const router = useRouter()
const api = useApi()

const query = (key: string) => (typeof route.query[key] === 'string' ? (route.query[key] as string) : '')
const search = ref(query('search'))

const params = computed(() => ({
  search: query('search') || undefined,
  state: query('state') || undefined,
  page: Number(query('page')) || 1,
}))

const { data, status, error, refresh } = await useAsyncData(
  'shops-list',
  async () => {
    const response = await api.shops.list(params.value)
    return { shops: response.data as Shop[], meta: response.meta as PageMeta | null }
  },
  { server: false, watch: [params] },
)

function setQuery(patch: Record<string, string | number | undefined>) {
  const next: Record<string, string> = {}
  for (const [key, value] of Object.entries({ ...route.query, ...patch })) {
    if (value !== undefined && value !== '' && value !== null) next[key] = String(value)
  }
  router.push({ path: '/shops', query: next })
}

const applySearch = useDebounceFn((value: string) => setQuery({ search: value, page: undefined }), 300)
watch(search, (value) => applySearch(value))
</script>

<template>
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <h1 class="text-3xl font-bold text-gray-900 mb-6">Shops</h1>

    <div class="flex flex-wrap gap-3 mb-8">
      <Input v-model="search" type="search" placeholder="Search shops" aria-label="Search shops" class="max-w-xs" />
      <select :value="query('state')" aria-label="State" class="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white" @change="setQuery({ state: ($event.target as HTMLSelectElement).value, page: undefined })">
        <option value="">All states</option>
        <option v-for="s in STATES" :key="s.value" :value="s.value">{{ s.label }}</option>
      </select>
    </div>

    <p v-if="status === 'pending' || status === 'idle'" class="text-gray-600">Loading shops...</p>
    <div v-else-if="error" class="text-red-600">
      Could not load shops. <button class="underline" @click="refresh()">Try again</button>
    </div>
    <p v-else-if="!data?.shops.length" class="bg-gray-50 rounded-lg p-10 text-center text-gray-600">No shops found.</p>
    <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <NuxtLink
        v-for="shop in data.shops"
        :key="shop.id"
        :to="`/shops/${shop.id}`"
        class="block bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
      >
        <h2 class="text-lg font-semibold text-gray-900">{{ shop.name }}</h2>
        <p class="text-sm text-gray-500 flex items-center gap-1 mb-2"><MapPin class="w-4 h-4" />{{ labelFor(STATES, shop.state) }}</p>
        <p class="text-sm text-gray-600 line-clamp-3">{{ shop.description }}</p>
      </NuxtLink>
    </div>

    <Pager :meta="data?.meta ?? null" @change="setQuery({ page: $event })" />
  </section>
</template>
