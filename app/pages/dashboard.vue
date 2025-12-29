<script setup lang="ts">
import { PackageIcon, StoreIcon, TrendingUpIcon, UsersIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { useUserStore } from '@/stores/user'

definePageMeta({
  middleware: 'auth',
  layout: 'auth'
})

const userStore = useUserStore()

// Sample stats data
const stats = [
  { label: 'Total Items', value: '156', icon: PackageIcon, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Active Shops', value: '23', icon: StoreIcon, color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Total Views', value: '1,234', icon: TrendingUpIcon, color: 'text-purple-600', bg: 'bg-purple-50' },
  { label: 'Users', value: '89', icon: UsersIcon, color: 'text-orange-600', bg: 'bg-orange-50' },
]

// Sample recent items
const recentItems = [
  { id: 1, name: 'Vintage Denim Jacket', category: 'Fashion', price: 'RM 45', status: 'Active' },
  { id: 2, name: 'Retro Gaming Console', category: 'Electronics', price: 'RM 120', status: 'Active' },
  { id: 3, name: 'Antique Table Lamp', category: 'Home & Living', price: 'RM 35', status: 'Sold' },
  { id: 4, name: 'Classic Vinyl Records', category: 'Entertainment', price: 'RM 25', status: 'Active' },
]
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
      <ClientOnly>
        <p class="text-gray-600 mt-1">Welcome back, {{ userStore.username }}! Here's what's happening today.</p>
        <template #fallback>
          <p class="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
        </template>
      </ClientOnly>
    </div>

    <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div class="flex items-center justify-between mb-4">
            <div :class="[stat.bg, 'p-3 rounded-lg']">
              <component :is="stat.icon" :class="[stat.color, 'w-6 h-6']" />
            </div>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-1">{{ stat.value }}</h3>
          <p class="text-sm text-gray-600">{{ stat.label }}</p>
        </div>
      </div>

      <!-- Recent Items Section -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold text-gray-900">Recent Items</h2>
            <Button variant="link" size="sm">View All →</Button>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item Name
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="item in recentItems" :key="item.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ item.name }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-600">{{ item.category }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-semibold text-gray-900">{{ item.price }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      item.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800',
                      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                    ]"
                  >
                    {{ item.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <Button variant="ghost" size="sm">View</Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
  </div>
</template>
