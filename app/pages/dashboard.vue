<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { PackageIcon, CheckCircleIcon, TagIcon, EyeIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useUserStore } from '@/stores/user'
import { useApi } from '~/services'
import { CATEGORIES, STATUSES, labelFor } from '~/lib/options'
import { formatPrice } from '~/lib/format'
import type { Analytics } from '~/types/analytics'
import type { Item } from '~/types/item'

definePageMeta({
  middleware: 'auth',
  layout: 'auth'
})

const userStore = useUserStore()
const api = useApi()

const analytics = ref<Analytics | null>(null)
const recentItems = ref<Item[]>([])
const loading = ref(true)
const loadError = ref<string | null>(null)

async function load() {
  loading.value = true
  loadError.value = null
  try {
    const [stats, items] = await Promise.all([api.analytics.mine(30), api.items.mine({ per_page: 5 })])
    analytics.value = stats.data
    recentItems.value = items.data
  } catch (error: any) {
    loadError.value = error.message || 'Could not load your dashboard.'
  } finally {
    loading.value = false
  }
}

onMounted(load)

const stats = computed(() => [
  { label: 'Items', value: analytics.value?.totals.items ?? 0, icon: PackageIcon, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Active', value: analytics.value?.totals.active_items ?? 0, icon: CheckCircleIcon, color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Sold', value: analytics.value?.totals.sold_items ?? 0, icon: TagIcon, color: 'text-orange-600', bg: 'bg-orange-50' },
  { label: 'Views', value: (analytics.value?.totals.views ?? 0).toLocaleString('en-US'), icon: EyeIcon, color: 'text-purple-600', bg: 'bg-purple-50' },
])
</script>

<template>
  <div class="space-y-6">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
      <ClientOnly>
        <p class="text-gray-600 mt-1">Welcome back, {{ userStore.username }}! Here's your shop at a glance.</p>
        <template #fallback>
          <p class="text-gray-600 mt-1">Welcome back! Here's your shop at a glance.</p>
        </template>
      </ClientOnly>
    </div>

    <p v-if="loading" class="text-gray-600">Loading...</p>
    <div v-else-if="loadError" class="text-red-600">
      {{ loadError }} <button class="underline" @click="load">Try again</button>
    </div>
    <template v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="stat in stats" :key="stat.label" class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div :class="[stat.bg, 'p-3 rounded-lg w-fit mb-4']">
            <component :is="stat.icon" :class="[stat.color, 'w-6 h-6']" />
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-1">{{ stat.value }}</h3>
          <p class="text-sm text-gray-600">{{ stat.label }}</p>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200">
        <div class="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 class="text-xl font-bold text-gray-900">Recent Items</h2>
          <NuxtLink to="/items"><Button variant="link" size="sm">View All →</Button></NuxtLink>
        </div>

        <p v-if="!recentItems.length" class="p-6 text-gray-600">
          No items yet. <NuxtLink to="/items/new" class="underline">Add your first item</NuxtLink>.
        </p>
        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="item in recentItems" :key="item.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ item.name }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ labelFor(CATEGORIES, item.category) }}</td>
                <td class="px-6 py-4 text-sm font-semibold text-gray-900">{{ formatPrice(item.price) }}</td>
                <td class="px-6 py-4">
                  <Badge :variant="item.status === 'active' ? 'default' : 'secondary'">{{ labelFor(STATUSES, item.status) }}</Badge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>
