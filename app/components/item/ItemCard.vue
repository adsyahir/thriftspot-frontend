<script setup lang="ts">
import { ImageIcon } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { STATES, labelFor } from '~/lib/options'
import { formatPrice } from '~/lib/format'
import type { Item } from '~/types/item'

defineProps<{ item: Item }>()
</script>

<template>
  <NuxtLink
    :to="`/item/${item.id}`"
    class="block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100"
  >
    <div class="aspect-square bg-gray-100 flex items-center justify-center">
      <img v-if="item.image_url" :src="item.image_url" :alt="item.name" class="w-full h-full object-cover" loading="lazy" />
      <ImageIcon v-else class="w-10 h-10 text-gray-300" aria-hidden="true" />
    </div>
    <div class="p-4">
      <h3 class="font-semibold text-gray-900 mb-1 truncate">{{ item.name }}</h3>
      <p v-if="item.shop" class="text-sm text-gray-600 mb-2 truncate">{{ item.shop.name }} · {{ labelFor(STATES, item.shop.state) }}</p>
      <div class="flex items-center justify-between">
        <span class="text-lg font-bold text-gray-900">{{ formatPrice(item.price) }}</span>
        <Badge v-if="item.status === 'sold'" variant="secondary">Sold</Badge>
      </div>
    </div>
  </NuxtLink>
</template>
