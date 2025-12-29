<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  layout: 'auth'
})
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-900">Shop Management</h1>
    <p class="text-gray-600 mt-2">Manage your shop settings and information.</p>
  </div>
</template>
