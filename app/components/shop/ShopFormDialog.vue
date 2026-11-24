<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useApi } from '~/services'
import { STATES } from '~/lib/options'
import { DAYS, emptyShopForm, toShopPayload } from '~/lib/shopForm'
import type { Shop, ShopRequest } from '~/types/shop'

const props = defineProps<{ open: boolean; shop: Shop | null }>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  saved: []
}>()

const api = useApi()
const form = ref<ShopRequest>(emptyShopForm())
const saving = ref(false)
const formError = ref<string | null>(null)
const fieldErrors = ref<Record<string, string[]>>({})

const err = (field: string) => fieldErrors.value[field]?.[0]

function reset() {
  form.value = props.shop ? { ...emptyShopForm(), ...JSON.parse(JSON.stringify(props.shop)) } : emptyShopForm()
  form.value.social_links = { instagram: '', facebook: '', twitter: '', tiktok: '', whatsapp: '', ...(props.shop?.social_links ?? {}) }
  formError.value = null
  fieldErrors.value = {}
}

watch(() => [props.open, props.shop], () => {
  if (props.open) reset()
}, { immediate: true })

const isClosed = (day: keyof ShopRequest['operating_hours']) => form.value.operating_hours[day] === false

function setClosed(day: keyof ShopRequest['operating_hours'], closed: boolean) {
  form.value.operating_hours[day] = closed ? false : ['09:00', '18:00']
}

function setTime(day: keyof ShopRequest['operating_hours'], index: 0 | 1, value: string) {
  const current = form.value.operating_hours[day]
  if (current === false) return
  const next: [string, string] = [current[0], current[1]]
  next[index] = value
  form.value.operating_hours[day] = next
}

async function submit() {
  saving.value = true
  formError.value = null
  fieldErrors.value = {}

  try {
    const payload = toShopPayload(form.value)
    if (props.shop) {
      await api.shops.update(props.shop.id, payload)
    } else {
      await api.shops.create(payload)
    }
    emit('saved')
    emit('update:open', false)
  } catch (error: any) {
    if (error.errors) {
      fieldErrors.value = error.errors
      formError.value = 'Please fix the highlighted fields.'
    } else {
      formError.value = error.message || 'Could not save the shop.'
    }
  } finally {
    saving.value = false
  }
}

const social = computed(() => form.value.social_links as Record<string, string>)

const socialError = (key: string) => fieldErrors.value[`social_links.${key}`]?.[0]

const SOCIAL_KEYS = ['instagram', 'facebook', 'twitter', 'tiktok'] as const

const setCoordinate = (field: 'latitude' | 'longitude', value: string | number) => {
  form.value[field] = value === '' ? null : Number(value)
}

const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900'
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-3xl max-h-[90vh] flex flex-col">
      <DialogHeader>
        <DialogTitle>{{ shop ? 'Edit shop' : 'Add new shop' }}</DialogTitle>
        <DialogDescription>Fill in your shop details. Fields marked * are required.</DialogDescription>
      </DialogHeader>

      <form id="shop-form" class="overflow-y-auto flex-1 pr-2 space-y-5" @submit.prevent="submit">
        <div>
          <label for="shop-name" class="block text-sm font-medium text-gray-700 mb-1">Shop name *</label>
          <Input id="shop-name" v-model="form.name" required maxlength="255" />
          <p v-if="err('name')" class="mt-1 text-sm text-red-600">{{ err('name') }}</p>
        </div>

        <div>
          <label for="shop-description" class="block text-sm font-medium text-gray-700 mb-1">Description *</label>
          <textarea id="shop-description" v-model="form.description" rows="3" required maxlength="2000" :class="inputClass" />
          <p v-if="err('description')" class="mt-1 text-sm text-red-600">{{ err('description') }}</p>
        </div>

        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <label for="shop-state" class="block text-sm font-medium text-gray-700 mb-1">State *</label>
            <select id="shop-state" v-model="form.state" required :class="inputClass">
              <option value="" disabled>Select a state</option>
              <option v-for="s in STATES" :key="s.value" :value="s.value">{{ s.label }}</option>
            </select>
            <p v-if="err('state')" class="mt-1 text-sm text-red-600">{{ err('state') }}</p>
          </div>
          <div>
            <label for="shop-location-type" class="block text-sm font-medium text-gray-700 mb-1">Location type *</label>
            <select id="shop-location-type" v-model="form.location_type" :class="inputClass">
              <option value="google_maps">Street address</option>
              <option value="coordinates">Coordinates</option>
            </select>
          </div>
        </div>

        <div v-if="form.location_type === 'google_maps'" class="grid sm:grid-cols-2 gap-4">
          <div>
            <label for="shop-address" class="block text-sm font-medium text-gray-700 mb-1">Address *</label>
            <Input id="shop-address" v-model="form.address" maxlength="255" />
            <p v-if="err('address')" class="mt-1 text-sm text-red-600">{{ err('address') }}</p>
          </div>
          <div>
            <label for="shop-place-id" class="block text-sm font-medium text-gray-700 mb-1">Google place ID</label>
            <Input id="shop-place-id" v-model="form.place_id" maxlength="255" />
          </div>
        </div>
        <div v-else class="grid sm:grid-cols-2 gap-4">
          <div>
            <label for="shop-lat" class="block text-sm font-medium text-gray-700 mb-1">Latitude *</label>
            <Input id="shop-lat" :model-value="form.latitude ?? ''" type="number" step="any" @update:model-value="setCoordinate('latitude', $event)" />
            <p v-if="err('latitude')" class="mt-1 text-sm text-red-600">{{ err('latitude') }}</p>
          </div>
          <div>
            <label for="shop-lng" class="block text-sm font-medium text-gray-700 mb-1">Longitude *</label>
            <Input id="shop-lng" :model-value="form.longitude ?? ''" type="number" step="any" @update:model-value="setCoordinate('longitude', $event)" />
            <p v-if="err('longitude')" class="mt-1 text-sm text-red-600">{{ err('longitude') }}</p>
          </div>
        </div>

        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <label for="shop-phone" class="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
            <Input id="shop-phone" v-model="form.phone_number" type="tel" required />
            <p v-if="err('phone_number')" class="mt-1 text-sm text-red-600">{{ err('phone_number') }}</p>
          </div>
          <div>
            <label for="shop-email" class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <Input id="shop-email" v-model="form.email" type="email" required />
            <p v-if="err('email')" class="mt-1 text-sm text-red-600">{{ err('email') }}</p>
          </div>
        </div>

        <fieldset>
          <legend class="text-sm font-medium text-gray-700 mb-2">Social links</legend>
          <div class="grid sm:grid-cols-2 gap-4">
            <div v-for="network in SOCIAL_KEYS" :key="network">
              <label :for="`shop-${network}`" class="block text-xs text-gray-500 mb-1 capitalize">{{ network }} URL</label>
              <input :id="`shop-${network}`" :value="social[network]" type="url" placeholder="https://" :class="inputClass" @input="social[network] = ($event.target as HTMLInputElement).value" />
              <p v-if="socialError(network)" class="mt-1 text-sm text-red-600">{{ socialError(network) }}</p>
            </div>
            <div>
              <label for="shop-whatsapp" class="block text-xs text-gray-500 mb-1">WhatsApp number</label>
              <Input id="shop-whatsapp" v-model="social.whatsapp" placeholder="+60123456789" />
              <p v-if="err('social_links.whatsapp')" class="mt-1 text-sm text-red-600">{{ err('social_links.whatsapp') }}</p>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend class="text-sm font-medium text-gray-700 mb-2">Operating hours</legend>
          <div class="space-y-2">
            <div v-for="day in DAYS" :key="day.key" class="flex flex-wrap items-center gap-3">
              <span class="w-24 text-sm text-gray-700">{{ day.label }}</span>
              <label class="flex items-center gap-1 text-sm text-gray-600">
                <input type="checkbox" :checked="isClosed(day.key)" @change="setClosed(day.key, ($event.target as HTMLInputElement).checked)" />
                Closed
              </label>
              <template v-if="!isClosed(day.key)">
                <input
                  type="time"
                  :aria-label="`${day.label} opens`"
                  :value="(form.operating_hours[day.key] as [string, string])[0]"
                  class="px-2 py-1 border border-gray-300 rounded-md text-sm"
                  @input="setTime(day.key, 0, ($event.target as HTMLInputElement).value)"
                />
                <span class="text-gray-400">to</span>
                <input
                  type="time"
                  :aria-label="`${day.label} closes`"
                  :value="(form.operating_hours[day.key] as [string, string])[1]"
                  class="px-2 py-1 border border-gray-300 rounded-md text-sm"
                  @input="setTime(day.key, 1, ($event.target as HTMLInputElement).value)"
                />
              </template>
              <p v-if="err(`operating_hours.${day.key}`)" class="text-sm text-red-600">{{ err(`operating_hours.${day.key}`) }}</p>
            </div>
          </div>
        </fieldset>

        <p v-if="formError" class="text-sm text-red-600">{{ formError }}</p>
      </form>

      <DialogFooter>
        <Button type="button" variant="outline" :disabled="saving" @click="emit('update:open', false)">Cancel</Button>
        <Button type="submit" form="shop-form" :disabled="saving">{{ saving ? 'Saving...' : shop ? 'Save changes' : 'Create shop' }}</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
