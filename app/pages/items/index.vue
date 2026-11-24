<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { Edit, Plus, Trash2 } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import ConfirmDialog from '~/components/ConfirmDialog.vue'
import Pager from '~/components/Pager.vue'
import { useApi } from '~/services'
import { CATEGORIES, STATUSES, labelFor } from '~/lib/options'
import { formatPrice } from '~/lib/format'
import type { Item, PageMeta } from '~/types/item'

definePageMeta({
  middleware: 'auth',
  layout: 'auth'
})

const api = useApi()

const items = ref<Item[]>([])
const meta = ref<PageMeta | null>(null)
const loading = ref(true)
const loadError = ref<string | null>(null)
const hasShop = ref(true)

const status = ref('')
const search = ref('')
const debouncedSearch = ref('')
const page = ref(1)

const deleting = ref<Item | null>(null)
const deleteOpen = ref(false)
const deleteLoading = ref(false)
const deleteError = ref<string | null>(null)

async function load() {
  loading.value = true
  loadError.value = null
  try {
    const response = await api.items.mine({
      status: status.value || undefined,
      search: debouncedSearch.value || undefined,
      page: page.value,
      per_page: 10,
    })
    items.value = response.data
    meta.value = response.meta
  } catch (error: any) {
    loadError.value = error.message || 'Could not load your items.'
  } finally {
    loading.value = false
  }
}

const applySearch = useDebounceFn(() => {
  debouncedSearch.value = search.value
}, 300)

watch(search, applySearch)
watch([status, debouncedSearch], () => {
  page.value = 1
  load()
})

function goTo(next: number) {
  page.value = next
  load()
}

function askDelete(item: Item) {
  deleting.value = item
  deleteError.value = null
  deleteOpen.value = true
}

async function confirmDelete() {
  if (!deleting.value) return
  deleteLoading.value = true
  try {
    await api.items.remove(deleting.value.id)
    deleteOpen.value = false
    await load()
  } catch (error: any) {
    deleteError.value = error.message || 'Could not delete the item.'
  } finally {
    deleteLoading.value = false
  }
}

onMounted(async () => {
  try {
    const shops = await api.shops.mine({ per_page: 1 })
    hasShop.value = shops.data.length > 0
  } catch {
    hasShop.value = true
  }
  await load()
})
</script>

<template>
  <div class="max-w-6xl">
    <div class="mb-6 flex items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">All Items</h1>
        <p class="text-gray-600 mt-2">Manage your items here.</p>
      </div>
      <NuxtLink v-if="hasShop" to="/items/new"><Button><Plus /> Add Item</Button></NuxtLink>
    </div>

    <p v-if="!hasShop" class="bg-white border border-dashed border-gray-300 rounded-lg p-6 text-gray-600">
      Create a shop before adding items.
      <NuxtLink to="/shop" class="text-gray-900 underline">Go to Shop Management</NuxtLink>
    </p>

    <template v-else>
      <div class="flex flex-wrap gap-3 mb-4">
        <Input v-model="search" type="search" placeholder="Search by name" aria-label="Search items" class="max-w-xs" />
        <select v-model="status" aria-label="Filter by status" class="px-3 py-2 border border-gray-300 rounded-md text-sm">
          <option value="">All statuses</option>
          <option v-for="s in STATUSES" :key="s.value" :value="s.value">{{ s.label }}</option>
        </select>
      </div>

      <p v-if="loading" class="text-gray-600">Loading items...</p>
      <div v-else-if="loadError" class="text-red-600">
        {{ loadError }} <button class="underline" @click="load">Try again</button>
      </div>
      <p v-else-if="items.length === 0" class="bg-white border border-dashed border-gray-300 rounded-lg p-10 text-center text-gray-600">
        No items found.
      </p>
      <div v-else class="bg-white border border-gray-200 rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Shop</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead class="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="item in items" :key="item.id">
              <TableCell class="font-medium">{{ item.name }}</TableCell>
              <TableCell>{{ item.shop?.name }}</TableCell>
              <TableCell>{{ labelFor(CATEGORIES, item.category) }}</TableCell>
              <TableCell>{{ formatPrice(item.price) }}</TableCell>
              <TableCell>
                <Badge :variant="item.status === 'active' ? 'default' : 'secondary'">{{ labelFor(STATUSES, item.status) }}</Badge>
              </TableCell>
              <TableCell class="text-right">
                <NuxtLink :to="`/items/${item.id}/edit`">
                  <Button variant="outline" size="icon-sm" :aria-label="`Edit ${item.name}`"><Edit /></Button>
                </NuxtLink>
                <Button variant="outline" size="icon-sm" class="ml-1" :aria-label="`Delete ${item.name}`" @click="askDelete(item)">
                  <Trash2 />
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <Pager :meta="meta" @change="goTo" />
    </template>

    <ConfirmDialog
      v-model:open="deleteOpen"
      title="Delete item?"
      :message="deleteError ?? 'This permanently deletes the item and its photo.'"
      :loading="deleteLoading"
      @confirm="confirmDelete"
    />
  </div>
</template>
