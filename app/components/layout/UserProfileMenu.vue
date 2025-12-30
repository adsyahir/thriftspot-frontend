<script setup lang="ts">
import { ref } from 'vue'
import { User, Sparkles, UserCircle, CreditCard, Bell, LogOut, ChevronUp } from 'lucide-vue-next'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const isOpen = ref(false)

const handleLogout = async () => {
  await userStore.logout()
  navigateTo('/auth/signin')
}

const menuItems = [
  { icon: Sparkles, label: 'Upgrade to Pro', action: () => navigateTo('/upgrade') },
  { icon: UserCircle, label: 'Account', action: () => navigateTo('/account') },
  { icon: CreditCard, label: 'Billing', action: () => navigateTo('/billing') },
  { icon: Bell, label: 'Notifications', action: () => navigateTo('/notifications') },
]
</script>

<template>
  <div class="relative">
    <!-- Trigger Button -->
    <button
      @click="isOpen = !isOpen"
      class="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors group"
      :class="isOpen ? 'bg-gray-100' : ''"
    >
      <!-- Avatar -->
      <div class="shrink-0">
        <div class="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center">
          <User class="w-5 h-5 text-white" />
        </div>
      </div>

      <!-- User Info -->
      <div class="flex-1 min-w-0 text-left">
        <p class="text-sm font-semibold text-gray-900 truncate">
          {{ userStore.username || 'User' }}
        </p>
        <p class="text-xs text-gray-600 truncate">
          {{ userStore.email }}
        </p>
      </div>

      <!-- Expand Icon -->
      <ChevronUp
        class="w-4 h-4 text-gray-500 shrink-0 transition-transform"
        :class="isOpen ? 'rotate-180' : ''"
      />
    </button>

    <!-- Dropdown Menu -->
    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
      >
        <!-- User Header in Dropdown -->
        <div class="px-4 py-3 border-b border-gray-200">
          <div class="flex items-center gap-3">
            <div class="shrink-0">
              <div class="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center">
                <User class="w-5 h-5 text-white" />
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-gray-900 truncate">
                {{ userStore.username || 'User' }}
              </p>
              <p class="text-xs text-gray-600 truncate">
                {{ userStore.email }}
              </p>
            </div>
          </div>
        </div>

        <!-- Menu Items -->
        <div class="py-2">
          <button
            v-for="item in menuItems"
            :key="item.label"
            @click="item.action(); isOpen = false"
            class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <component :is="item.icon" class="w-4 h-4 text-gray-600" />
            <span class="font-medium">{{ item.label }}</span>
          </button>
        </div>

        <!-- Logout (Separate) -->
        <div class="border-t border-gray-200 py-2">
          <button
            @click="handleLogout(); isOpen = false"
            class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut class="w-4 h-4" />
            <span class="font-medium">Log out</span>
          </button>
        </div>
      </div>
    </Transition>

    <!-- Click Outside Handler -->
    <div
      v-if="isOpen"
      @click="isOpen = false"
      class="fixed inset-0 z-[-1]"
    />
  </div>
</template>
