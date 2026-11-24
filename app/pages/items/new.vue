<script setup lang="ts">
import ItemForm from '~/components/item/ItemForm.vue'

definePageMeta({
  middleware: 'auth',
  layout: 'auth'
})
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-900">Add New Item</h1>
    <p class="text-gray-600 mt-2 mb-6">Create a new item listing.</p>
    <ItemForm @saved="navigateTo('/items')" />
  </div>
</template>
