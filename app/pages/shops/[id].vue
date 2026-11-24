<script setup lang="ts">
import { computed, watch } from 'vue'
import { Mail, MapPin, Phone } from 'lucide-vue-next'
import ItemCard from '~/components/item/ItemCard.vue'
import { useApi } from '~/services'
import { STATES, labelFor } from '~/lib/options'
import { DAYS, mapsUrl } from '~/lib/shopForm'
import type { Item } from '~/types/item'
import type { Shop } from '~/types/shop'

definePageMeta({ layout: 'guest' })

const route = useRoute()
const api = useApi()

const { data, status, error } = await useAsyncData(
  `shop-${route.params.id}`,
  async () => {
    const shop = (await api.shops.show(String(route.params.id))).data as Shop
    const items = (await api.items.browse({ shop_id: shop.id, per_page: 50 })).data as Item[]
    return { shop, items }
  },
  { server: false },
)

const notFound = computed(() => (error.value as any)?.statusCode === 404 || (error.value as any)?.data?.statusCode === 404)

const socials = computed(() => {
  const links = data.value?.shop.social_links ?? {}
  const entries: { label: string; href: string }[] = []
  for (const key of ['instagram', 'facebook', 'twitter', 'tiktok'] as const) {
    if (links[key]) entries.push({ label: key, href: links[key]! })
  }
  if (links.whatsapp) entries.push({ label: 'whatsapp', href: `https://wa.me/${links.whatsapp.replace(/\D/g, '')}` })
  return entries
})

watch(notFound, (missing) => {
  if (missing) showError(createError({ statusCode: 404, statusMessage: 'Shop not found' }))
}, { immediate: true })
</script>

<template>
  <section class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <p v-if="status === 'pending' || status === 'idle'" class="text-gray-600">Loading shop...</p>
    <p v-else-if="error" class="text-red-600">Could not load this shop. Please try again later.</p>
    <template v-else-if="data">
      <h1 class="text-3xl font-bold text-gray-900">{{ data.shop.name }}</h1>
      <p class="text-gray-500 mb-4">{{ labelFor(STATES, data.shop.state) }}</p>
      <p class="text-gray-700 mb-6">{{ data.shop.description }}</p>

      <div class="grid md:grid-cols-2 gap-8 mb-10">
        <div class="space-y-2 text-sm text-gray-700">
          <p class="flex items-center gap-2"><MapPin class="w-4 h-4" />
            <span v-if="data.shop.location_type === 'google_maps'">{{ data.shop.address }}</span>
            <span v-else>{{ data.shop.latitude }}, {{ data.shop.longitude }}</span>
          </p>
          <a :href="mapsUrl(data.shop)" target="_blank" rel="noopener noreferrer" class="underline">Open in Google Maps</a>
          <p class="flex items-center gap-2"><Phone class="w-4 h-4" />{{ data.shop.phone_number }}</p>
          <p class="flex items-center gap-2"><Mail class="w-4 h-4" />{{ data.shop.email }}</p>
          <ul v-if="socials.length" class="flex flex-wrap gap-3 pt-2">
            <li v-for="s in socials" :key="s.label">
              <a :href="s.href" target="_blank" rel="noopener noreferrer" class="underline capitalize">{{ s.label }}</a>
            </li>
          </ul>
        </div>
        <div>
          <h2 class="font-semibold text-gray-900 mb-2">Opening hours</h2>
          <table class="text-sm w-full">
            <tbody>
              <tr v-for="day in DAYS" :key="day.key">
                <th scope="row" class="text-left font-normal text-gray-600 py-1 pr-4">{{ day.label }}</th>
                <td class="text-gray-900">
                  {{ data.shop.operating_hours[day.key] === false ? 'Closed' : (data.shop.operating_hours[day.key] as [string, string]).join(' – ') }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <h2 class="text-2xl font-bold text-gray-900 mb-4">Items</h2>
      <p v-if="!data.items.length" class="bg-gray-50 rounded-lg p-8 text-center text-gray-600">This shop has no items listed right now.</p>
      <div v-else class="grid grid-cols-2 md:grid-cols-3 gap-6">
        <ItemCard v-for="item in data.items" :key="item.id" :item="item" />
      </div>
    </template>
  </section>
</template>
