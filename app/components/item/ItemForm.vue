<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useApi } from '~/services'
import { CATEGORIES, CONDITIONS, STATUSES } from '~/lib/options'
import type { Item } from '~/types/item'
import type { Shop } from '~/types/shop'

const props = defineProps<{ item?: Item }>()

const emit = defineEmits<{ saved: [] }>()

const api = useApi()

const shops = ref<Shop[]>([])
const shopsLoading = ref(true)
const shopsFailed = ref(false)
const saving = ref(false)
const formError = ref<string | null>(null)
const fieldErrors = ref<Record<string, string[]>>({})
const err = (field: string) => fieldErrors.value[field]?.[0]

const form = reactive({
  shop_id: props.item?.shop?.id ?? ('' as number | ''),
  name: props.item?.name ?? '',
  description: props.item?.description ?? '',
  category: props.item?.category ?? '',
  condition: props.item?.condition ?? '',
  status: props.item?.status ?? 'active',
  price: props.item?.price ?? '',
})

const imageFile = ref<File | null>(null)
const previewUrl = ref<string | null>(props.item?.image_url ?? null)
let objectUrl: string | null = null

function revoke() {
  if (objectUrl) URL.revokeObjectURL(objectUrl)
  objectUrl = null
}

function onFile(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0] ?? null
  imageFile.value = file
  revoke()
  if (file) {
    objectUrl = URL.createObjectURL(file)
    previewUrl.value = objectUrl
  } else {
    previewUrl.value = props.item?.image_url ?? null
  }
}

onBeforeUnmount(revoke)

async function loadShops() {
  shopsLoading.value = true
  shopsFailed.value = false
  formError.value = null
  try {
    const response = await api.shops.mine({ per_page: 50 })
    shops.value = response.data
    if (!props.item && shops.value.length === 1) form.shop_id = shops.value[0]!.id
  } catch (error: any) {
    shopsFailed.value = true
    formError.value = error.message || 'Could not load your shops.'
  } finally {
    shopsLoading.value = false
  }
}

onMounted(loadShops)

async function submit() {
  saving.value = true
  formError.value = null
  fieldErrors.value = {}

  const data = new FormData()
  data.append('shop_id', String(form.shop_id))
  data.append('name', form.name)
  data.append('description', form.description)
  data.append('category', form.category)
  data.append('condition', form.condition)
  data.append('status', form.status)
  data.append('price', String(form.price))
  if (imageFile.value) data.append('image', imageFile.value)

  try {
    if (props.item) {
      await api.items.update(props.item.id, data)
    } else {
      await api.items.create(data)
    }
    emit('saved')
  } catch (error: any) {
    if (error.errors) {
      fieldErrors.value = error.errors
      formError.value = 'Please fix the highlighted fields.'
    } else {
      formError.value = error.message || 'Could not save the item.'
    }
  } finally {
    saving.value = false
  }
}

const selectClass = 'w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900'
</script>

<template>
  <p v-if="shopsLoading" class="text-gray-600">Loading...</p>
  <p v-else-if="shopsFailed" class="text-red-600">
    {{ formError }} <button type="button" class="underline" @click="loadShops">Try again</button>
  </p>
  <div v-else-if="shops.length === 0" class="bg-white border border-dashed border-gray-300 rounded-lg p-8 text-gray-600">
    Create a shop before adding items.
    <NuxtLink to="/shop" class="text-gray-900 underline">Go to Shop Management</NuxtLink>
  </div>
  <form v-else class="max-w-2xl bg-white border border-gray-200 rounded-lg p-6 space-y-5" @submit.prevent="submit">
    <div>
      <label for="item-shop" class="block text-sm font-medium text-gray-700 mb-1">Shop *</label>
      <select id="item-shop" v-model="form.shop_id" required :class="selectClass">
        <option value="" disabled>Select a shop</option>
        <option v-for="shop in shops" :key="shop.id" :value="shop.id">{{ shop.name }}</option>
      </select>
      <p v-if="err('shop_id')" class="mt-1 text-sm text-red-600">{{ err('shop_id') }}</p>
    </div>

    <div>
      <label for="item-name" class="block text-sm font-medium text-gray-700 mb-1">Name *</label>
      <Input id="item-name" v-model="form.name" required maxlength="255" />
      <p v-if="err('name')" class="mt-1 text-sm text-red-600">{{ err('name') }}</p>
    </div>

    <div>
      <label for="item-description" class="block text-sm font-medium text-gray-700 mb-1">Description *</label>
      <textarea id="item-description" v-model="form.description" rows="4" required maxlength="5000" :class="selectClass" />
      <p v-if="err('description')" class="mt-1 text-sm text-red-600">{{ err('description') }}</p>
    </div>

    <div class="grid sm:grid-cols-3 gap-4">
      <div>
        <label for="item-category" class="block text-sm font-medium text-gray-700 mb-1">Category *</label>
        <select id="item-category" v-model="form.category" required :class="selectClass">
          <option value="" disabled>Select</option>
          <option v-for="o in CATEGORIES" :key="o.value" :value="o.value">{{ o.label }}</option>
        </select>
        <p v-if="err('category')" class="mt-1 text-sm text-red-600">{{ err('category') }}</p>
      </div>
      <div>
        <label for="item-condition" class="block text-sm font-medium text-gray-700 mb-1">Condition *</label>
        <select id="item-condition" v-model="form.condition" required :class="selectClass">
          <option value="" disabled>Select</option>
          <option v-for="o in CONDITIONS" :key="o.value" :value="o.value">{{ o.label }}</option>
        </select>
        <p v-if="err('condition')" class="mt-1 text-sm text-red-600">{{ err('condition') }}</p>
      </div>
      <div>
        <label for="item-status" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select id="item-status" v-model="form.status" :class="selectClass">
          <option v-for="o in STATUSES" :key="o.value" :value="o.value">{{ o.label }}</option>
        </select>
        <p v-if="err('status')" class="mt-1 text-sm text-red-600">{{ err('status') }}</p>
      </div>
    </div>

    <div>
      <label for="item-price" class="block text-sm font-medium text-gray-700 mb-1">Price (RM) *</label>
      <Input id="item-price" v-model="form.price" type="number" min="0" step="0.01" required />
      <p v-if="err('price')" class="mt-1 text-sm text-red-600">{{ err('price') }}</p>
    </div>

    <div>
      <label for="item-image" class="block text-sm font-medium text-gray-700 mb-1">Photo</label>
      <div class="flex items-center gap-4">
        <img v-if="previewUrl" :src="previewUrl" alt="Item preview" class="w-24 h-24 rounded-lg object-cover border border-gray-200" />
        <input id="item-image" type="file" accept="image/jpeg,image/png,image/webp" class="text-sm" @change="onFile" />
      </div>
      <p class="mt-1 text-xs text-gray-500">JPG, PNG or WebP, up to 4 MB.</p>
      <p v-if="err('image')" class="mt-1 text-sm text-red-600">{{ err('image') }}</p>
    </div>

    <p v-if="formError" class="text-sm text-red-600">{{ formError }}</p>

    <div class="flex gap-3">
      <Button type="submit" :disabled="saving">{{ saving ? 'Saving...' : item ? 'Save changes' : 'Create item' }}</Button>
      <NuxtLink to="/items"><Button type="button" variant="outline" :disabled="saving">Cancel</Button></NuxtLink>
    </div>
  </form>
</template>
