<script setup lang="ts">
import { ref } from 'vue'
import {
  LayoutDashboard,
  Package,
  Store,
  TrendingUp,
  Shield,
  Menu,
  X,
  Plus,
  ChevronRight
} from 'lucide-vue-next'

const userStore = useUserStore()

const isSidebarOpen = ref(false)

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Items',
    icon: Package,
    children: [
      { name: 'All Items', href: '/items' },
      { name: 'Add New Item', href: '/items/new', icon: Plus },
    ],
  },
  {
    name: 'Shop Management',
    href: '/shop',
    icon: Store,
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: TrendingUp,
  },
  {
    name: 'Roles & Permissions',
    href: '/admin/roles',
    icon: Shield,
  },
]

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const closeSidebar = () => {
  isSidebarOpen.value = false
}
</script>

<template>
  <div>
    <!-- Mobile menu button -->
    <button
      @click="toggleSidebar"
      class="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md border border-gray-200 hover:bg-gray-50"
    >
      <Menu v-if="!isSidebarOpen" class="w-6 h-6 text-gray-900" />
      <X v-else class="w-6 h-6 text-gray-900" />
    </button>

    <!-- Overlay for mobile -->
    <div
      v-if="isSidebarOpen"
      @click="closeSidebar"
      class="lg:hidden fixed inset-0 bg-black/50 z-40"
    />

    <!-- Sidebar -->
    <aside
      :class="[
        'fixed top-0 left-0 z-50 h-screen transition-transform duration-300',
        'bg-white border-r border-gray-200',
        'w-64',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      ]"
    >
      <div class="h-full flex flex-col">
        <!-- Logo -->
        <div class="h-16 flex items-center px-6 border-b border-gray-200">
          <NuxtLink to="/dashboard" class="flex items-center gap-2" @click="closeSidebar">
            <div class="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
              <span class="text-white text-sm font-bold">TS</span>
            </div>
            <span class="text-xl font-bold text-gray-900">ThriftSpot</span>
          </NuxtLink>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 overflow-y-auto py-4 px-3">
          <div class="space-y-1">
            <template v-for="item in navigation" :key="item.name">
              <!-- Items with children -->
              <div v-if="item.children">
                <div class="px-3 py-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  <div class="flex items-center gap-2">
                    <component :is="item.icon" class="w-4 h-4" />
                    <span>{{ item.name }}</span>
                  </div>
                </div>
                <div class="ml-4 space-y-1">
                  <NuxtLink
                    v-for="child in item.children"
                    :key="child.name"
                    :to="child.href"
                    @click="closeSidebar"
                    class="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors"
                    active-class="bg-gray-900 text-white"
                    exact-active-class="bg-gray-900 text-white"
                    :class="[
                      $route.path === child.href
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-700 hover:bg-gray-100',
                    ]"
                  >
                    <component v-if="child.icon" :is="child.icon" class="w-4 h-4" />
                    <ChevronRight v-else class="w-3 h-3" />
                    <span>{{ child.name }}</span>
                  </NuxtLink>
                </div>
              </div>

              <!-- Items without children -->
              <NuxtLink
                v-else
                :to="item.href"
                @click="closeSidebar"
                class="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors"
                active-class="bg-gray-900 text-white"
                exact-active-class="bg-gray-900 text-white"
                :class="[
                  $route.path === item.href
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-700 hover:bg-gray-100',
                ]"
              >
                <component :is="item.icon" class="w-5 h-5" />
                <span>{{ item.name }}</span>
              </NuxtLink>
            </template>
          </div>
        </nav>

        <!-- User info at bottom -->
        <div class="border-t border-gray-200 p-4">
          <slot name="user-info" />
        </div>
      </div>
    </aside>
  </div>
</template>
