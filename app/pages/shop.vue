<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Plus } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import ShopCard from '~/components/shop/ShopCard.vue'
import ShopFormDialog from '~/components/shop/ShopFormDialog.vue'
import ConfirmDialog from '~/components/ConfirmDialog.vue'
import { useApi } from '~/services'
import type { Shop } from '~/types/shop'

definePageMeta({
  middleware: 'auth',
  layout: 'auth'
})

const api = useApi()

const shops = ref<Shop[]>([])
const loading = ref(true)
const loadError = ref<string | null>(null)

const formOpen = ref(false)
const editing = ref<Shop | null>(null)

const deleting = ref<Shop | null>(null)
const deleteOpen = ref(false)
const deleteLoading = ref(false)
const deleteError = ref<string | null>(null)

async function load() {
  loading.value = true
  loadError.value = null
  try {
    const response = await api.shops.mine({ per_page: 50 })
    shops.value = response.data
  } catch (error: any) {
    loadError.value = error.message || 'Could not load your shops.'
  } finally {
    loading.value = false
  }
}

function openCreate() {
  editing.value = null
  formOpen.value = true
}

function openEdit(shop: Shop) {
  editing.value = shop
  formOpen.value = true
}

function askDelete(shop: Shop) {
  deleting.value = shop
  deleteError.value = null
  deleteOpen.value = true
}

async function confirmDelete() {
  if (!deleting.value) return
  deleteLoading.value = true
  try {
    await api.shops.remove(deleting.value.id)
    deleteOpen.value = false
    await load()
  } catch (error: any) {
    deleteError.value = error.message || 'Could not delete the shop.'
  } finally {
    deleteLoading.value = false
  }
}

onMounted(load)
</script>

<template>
  <div class="max-w-6xl">
    <div class="mb-8 flex items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Shop Management</h1>
        <p class="text-gray-600 mt-2">Manage all your shops in one place.</p>
      </div>
      <Button @click="openCreate"><Plus /> Add Shop</Button>
    </div>

    <p v-if="loading" class="text-gray-600">Loading shops...</p>
    <div v-else-if="loadError" class="text-red-600">
      {{ loadError }} <button class="underline" @click="load">Try again</button>
    </div>
    <div v-else-if="shops.length === 0" class="bg-white border border-dashed border-gray-300 rounded-lg p-10 text-center text-gray-600">
      You have no shops yet. Add your first shop to start listing items.
    </div>
    <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <ShopCard v-for="shop in shops" :key="shop.id" :shop="shop" @edit="openEdit" @delete="askDelete" />
    </div>

    <ShopFormDialog v-model:open="formOpen" :shop="editing" @saved="load" />

    <ConfirmDialog
      v-model:open="deleteOpen"
      title="Delete shop?"
      :message="deleteError ?? 'This also deletes all items in this shop.'"
      :loading="deleteLoading"
      @confirm="confirmDelete"
    />
  </div>
</template>
