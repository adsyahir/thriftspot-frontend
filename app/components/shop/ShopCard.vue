<script setup lang="ts">
import { Edit, Mail, MapPin, Phone, Trash2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { STATES, labelFor } from '~/lib/options'
import type { Shop } from '~/types/shop'

defineProps<{ shop: Shop }>()

const emit = defineEmits<{ edit: [shop: Shop]; delete: [shop: Shop] }>()
</script>

<template>
  <div class="bg-white rounded-lg border border-gray-200 p-5 flex flex-col gap-3">
    <div class="flex items-start justify-between gap-2">
      <div>
        <h3 class="text-lg font-semibold text-gray-900">{{ shop.name }}</h3>
        <p class="text-sm text-gray-500">{{ labelFor(STATES, shop.state) }}</p>
      </div>
      <div class="flex gap-1">
        <Button variant="outline" size="icon-sm" aria-label="Edit shop" @click="emit('edit', shop)">
          <Edit />
        </Button>
        <Button variant="outline" size="icon-sm" aria-label="Delete shop" @click="emit('delete', shop)">
          <Trash2 />
        </Button>
      </div>
    </div>
    <p class="text-sm text-gray-600 line-clamp-3">{{ shop.description }}</p>
    <ul class="text-sm text-gray-600 space-y-1">
      <li class="flex items-center gap-2">
        <MapPin class="w-4 h-4 shrink-0" />
        <span>{{ shop.location_type === 'coordinates' ? `${shop.latitude}, ${shop.longitude}` : shop.address }}</span>
      </li>
      <li class="flex items-center gap-2"><Phone class="w-4 h-4 shrink-0" />{{ shop.phone_number }}</li>
      <li class="flex items-center gap-2"><Mail class="w-4 h-4 shrink-0" />{{ shop.email }}</li>
    </ul>
  </div>
</template>
