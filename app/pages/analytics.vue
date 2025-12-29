<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  layout: 'auth'
})
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-900">Analytics</h1>
    <p class="text-gray-600 mt-2">View your shop analytics and performance metrics.</p>
  </div>
</template>
