<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useApi } from '~/services'
import type { Analytics } from '~/types/analytics'

definePageMeta({
  middleware: 'auth',
  layout: 'auth'
})

const api = useApi()

const days = ref(30)
const analytics = ref<Analytics | null>(null)
const loading = ref(true)
const loadError = ref<string | null>(null)

async function load() {
  loading.value = true
  loadError.value = null
  try {
    analytics.value = (await api.analytics.mine(days.value)).data
  } catch (error: any) {
    loadError.value = error.message || 'Could not load analytics.'
  } finally {
    loading.value = false
  }
}

onMounted(load)
watch(days, load)

// Inline-SVG bar chart geometry
const W = 640
const H = 200
const chart = computed(() => {
  const daily = analytics.value?.daily ?? []
  const max = Math.max(1, ...daily.map((d) => d.views))
  const step = daily.length ? W / daily.length : W
  return daily.map((d, i) => {
    const h = Math.round((d.views / max) * (H - 20))
    return { ...d, x: i * step + step * 0.15, y: H - h, w: step * 0.7, h }
  })
})

const totals = computed(() => [
  { label: 'Shops', value: analytics.value?.totals.shops ?? 0 },
  { label: 'Items', value: analytics.value?.totals.items ?? 0 },
  { label: 'Active items', value: analytics.value?.totals.active_items ?? 0 },
  { label: 'Sold items', value: analytics.value?.totals.sold_items ?? 0 },
  { label: 'All-time views', value: (analytics.value?.totals.views ?? 0).toLocaleString('en-US') },
])

const periodViews = computed(() => (analytics.value?.daily ?? []).reduce((sum, d) => sum + d.views, 0))
</script>

<template>
  <div class="max-w-5xl space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Analytics</h1>
        <p class="text-gray-600 mt-2">View your shop analytics and performance metrics.</p>
      </div>
      <label class="text-sm text-gray-700">
        Period
        <select v-model.number="days" class="ml-2 px-3 py-2 border border-gray-300 rounded-md text-sm bg-white">
          <option :value="7">Last 7 days</option>
          <option :value="30">Last 30 days</option>
          <option :value="90">Last 90 days</option>
        </select>
      </label>
    </div>

    <p v-if="loading" class="text-gray-600">Loading analytics...</p>
    <div v-else-if="loadError" class="text-red-600">
      {{ loadError }} <button class="underline" @click="load">Try again</button>
    </div>
    <template v-else-if="analytics">
      <dl class="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div v-for="t in totals" :key="t.label" class="bg-white border border-gray-200 rounded-xl p-4">
          <dd class="text-2xl font-bold text-gray-900">{{ t.value }}</dd>
          <dt class="text-sm text-gray-600">{{ t.label }}</dt>
        </div>
      </dl>

      <section class="bg-white border border-gray-200 rounded-xl p-6">
        <h2 class="text-lg font-bold text-gray-900 mb-1">Daily views</h2>
        <p class="text-sm text-gray-600 mb-4">{{ periodViews.toLocaleString('en-US') }} views in the last {{ days }} days</p>
        <svg :viewBox="`0 0 ${W} ${H}`" role="img" :aria-label="`Bar chart of daily views over the last ${days} days`" class="w-full h-auto">
          <rect v-for="bar in chart" :key="bar.date" :x="bar.x" :y="bar.y" :width="bar.w" :height="bar.h" rx="2" fill="#111827">
            <title>{{ bar.date }}: {{ bar.views }} views</title>
          </rect>
          <line :x1="0" :y1="H" :x2="W" :y2="H" stroke="#d1d5db" />
        </svg>
        <details class="mt-4">
          <summary class="text-sm text-gray-700 cursor-pointer">View as table</summary>
          <table class="mt-2 text-sm w-full max-w-sm">
            <thead>
              <tr><th scope="col" class="text-left font-medium text-gray-700 py-1">Date</th><th scope="col" class="text-right font-medium text-gray-700 py-1">Views</th></tr>
            </thead>
            <tbody>
              <tr v-for="d in analytics.daily" :key="d.date">
                <td class="py-0.5 text-gray-600">{{ d.date }}</td>
                <td class="py-0.5 text-right text-gray-900">{{ d.views }}</td>
              </tr>
            </tbody>
          </table>
        </details>
      </section>

      <section class="bg-white border border-gray-200 rounded-xl p-6">
        <h2 class="text-lg font-bold text-gray-900 mb-3">Top items</h2>
        <p v-if="!analytics.top_items.length" class="text-gray-600">No views recorded in this period yet.</p>
        <ol v-else class="divide-y divide-gray-100">
          <li v-for="item in analytics.top_items" :key="item.id" class="flex justify-between py-2 text-sm">
            <NuxtLink :to="`/item/${item.id}`" class="text-gray-900 underline">{{ item.name }}</NuxtLink>
            <span class="text-gray-600">{{ item.views.toLocaleString('en-US') }} views</span>
          </li>
        </ol>
      </section>
    </template>
  </div>
</template>
