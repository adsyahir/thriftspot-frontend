<script setup lang="ts">
import { ref } from 'vue'
import { SearchIcon, PackageIcon, ShirtIcon, LaptopIcon, HomeIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ItemCard from '~/components/item/ItemCard.vue'
import { useApi } from '~/services'
import type { Item } from '~/types/item'

definePageMeta({
  layout: 'guest',
})

const categories = [
  { name: 'Electronics', icon: LaptopIcon, href: '/browse?category=electronics' },
  { name: 'Fashion', icon: ShirtIcon, href: '/browse?category=fashion' },
  { name: 'Home & Living', icon: HomeIcon, href: '/browse?category=home' },
  { name: 'Sports', icon: PackageIcon, href: '/browse?category=sports' },
]

const api = useApi()
const search = ref('')

const goSearch = () => {
  const term = search.value.trim()
  navigateTo(term ? { path: '/browse', query: { search: term } } : '/browse')
}

const { data: featured, status, error } = await useAsyncData(
  'home-featured',
  async () => (await api.items.browse({ sort: 'newest', per_page: 6 })).data as Item[],
  { server: false },
)
</script>

<template>
  <!-- Hero Section -->
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
    <div class="text-center max-w-3xl mx-auto">
      <h1 class="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
        Discover Hidden Treasures
        <br />
        <span class="text-gray-600">At Thrift Shops Near You</span>
      </h1>
      <p class="text-lg md:text-xl text-gray-600 mb-8">
        Browse thrift items from local shops across Malaysia
      </p>

      <form class="relative max-w-2xl mx-auto" role="search" @submit.prevent="goSearch">
        <Input
          v-model="search"
          type="search"
          aria-label="Search items or shops"
          placeholder="Search for items or shops..."
          class="h-14 pl-12 pr-4 text-lg rounded-full border-2 border-gray-200 focus:border-gray-400"
        />
        <SearchIcon class="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" aria-hidden="true" />
      </form>
    </div>
  </section>

  <!-- Categories Grid -->
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <h2 class="text-3xl font-bold text-gray-900 mb-8">Browse by Category</h2>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
      <NuxtLink
        v-for="category in categories"
        :key="category.name"
        :to="category.href"
        class="group p-8 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all duration-200 hover:shadow-md"
      >
        <component :is="category.icon" class="w-12 h-12 text-gray-700 mb-4 group-hover:scale-110 transition-transform" />
        <h3 class="text-lg font-semibold text-gray-900">{{ category.name }}</h3>
      </NuxtLink>
    </div>
  </section>

  <!-- Newest items -->
  <section class="bg-gray-50 py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-3xl font-bold text-gray-900">Newest Items</h2>
        <NuxtLink to="/browse"><Button variant="link" class="text-gray-600 hover:text-gray-900">View All →</Button></NuxtLink>
      </div>

      <p v-if="status === 'pending' || status === 'idle'" class="text-gray-600">Loading items...</p>
      <p v-else-if="error" class="text-red-600">Could not load items right now.</p>
      <p v-else-if="!featured?.length" class="text-gray-600">No items have been listed yet.</p>
      <div v-else class="grid grid-cols-2 md:grid-cols-3 gap-6">
        <ItemCard v-for="item in featured" :key="item.id" :item="item" />
      </div>
    </div>
  </section>

  <!-- CTA Section -->
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div class="bg-gray-900 rounded-3xl p-12 text-center">
      <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
        Own a thrift shop or sell secondhand items?
      </h2>
      <p class="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
        List your shop and items on ThriftSpot so more people can find you.
      </p>
      <NuxtLink to="/auth/signup">
        <Button size="lg" variant="secondary" class="text-lg px-8">Promote Your Shop</Button>
      </NuxtLink>
    </div>
  </section>
</template>
