<script setup lang="ts">
import { LogOut, User } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { useUserStore } from '@/stores/user'
import Sidebar from '@/components/layout/Sidebar.vue'

const userStore = useUserStore()
const showLoading = ref(true)

// Only check auth on client side
onMounted(() => {
  showLoading.value = userStore.isLoading || !userStore.isAuthenticated
})

// Watch for changes in auth state
watch(
  () => [userStore.isLoading, userStore.isAuthenticated],
  () => {
    showLoading.value = userStore.isLoading || !userStore.isAuthenticated
  }
)

const handleLogout = async () => {
  await userStore.logout()
  navigateTo('/auth/signin')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading state -->
    <div v-show="showLoading" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto"></div>
        <p class="text-gray-600 mt-4 text-lg">{{ userStore.isLoading ? 'Verifying authentication...' : 'Loading...' }}</p>
      </div>
    </div>

    <!-- Authenticated layout -->
    <div v-show="!showLoading">
      <!-- Sidebar -->
      <Sidebar>
        <template #user-info>
          <ClientOnly>
            <div class="flex items-center gap-3">
              <div class="shrink-0">
                <div class="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center">
                  <User class="w-5 h-5 text-white" />
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">
                  {{ userStore.username || 'User' }}
                </p>
                <p class="text-xs text-gray-600 truncate">
                  {{ userStore.email }}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              @click="handleLogout"
              class="w-full mt-3 justify-start"
            >
              <LogOut class="w-4 h-4 mr-2" />
              Logout
            </Button>
          </ClientOnly>
        </template>
      </Sidebar>

      <!-- Main content -->
      <div class="lg:pl-64">
        <!-- Page content -->
        <main class="p-4 sm:p-6 lg:p-8">
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>
