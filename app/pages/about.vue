<script setup lang="ts">
definePageMeta({ layout: 'guest' })
</script>

<template>
  <section class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <h1 class="text-4xl font-bold text-gray-900 mb-6">About ThriftSpot</h1>
    <p class="text-lg text-gray-600 mb-4">
      ThriftSpot is a directory of thrift shops and secondhand items across Malaysia. Browse what local shops have in
      stock, then visit the shop or contact them directly.
    </p>
    <p class="text-lg text-gray-600 mb-8">
      ThriftSpot does not handle payments or deliveries. Each listing shows the shop's address, hours and contact
      details so you can arrange the purchase with them.
    </p>
    <div class="flex gap-3">
      <NuxtLink to="/browse" class="px-4 py-2 rounded-md bg-gray-900 text-white text-sm font-medium">Browse items</NuxtLink>
      <NuxtLink to="/auth/signup" class="px-4 py-2 rounded-md border border-gray-300 text-sm font-medium text-gray-700">List your shop</NuxtLink>
    </div>
  </section>
</template>
