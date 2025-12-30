<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import Sidebar from '@/components/layout/Sidebar.vue'
import UserProfileMenu from '@/components/layout/UserProfileMenu.vue'

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
            <UserProfileMenu />
          </ClientOnly>
        </template>
      </Sidebar>

      <!-- Main content -->
      <div class="lg:pl-64 min-h-screen bg-gray-50">
        <!-- Page content -->
        <main class="p-4 sm:p-6 lg:p-8">
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>
