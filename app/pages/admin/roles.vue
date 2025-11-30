<script setup lang="ts">
import { ref } from 'vue'
import { SparklesIcon, LogOutIcon, ShieldIcon, KeyIcon, UsersIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { useUserStore } from '@/stores/user'
import RoleManagement from '@/components/admin/RoleManagement.vue'
import PermissionManagement from '@/components/admin/PermissionManagement.vue'
import UserRoleAssignment from '@/components/admin/UserRoleAssignment.vue'

definePageMeta({
  middleware: 'auth'
})

const userStore = useUserStore()
const activeTab = ref<'roles' | 'permissions' | 'users'>('roles')

const handleLogout = () => {
  userStore.clearUser()
  navigateTo('/auth/signin')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <NuxtLink to="/dashboard" class="flex items-center gap-2">
            <SparklesIcon class="w-8 h-8 text-gray-900" />
            <span class="text-2xl font-bold text-gray-900">ThriftSpot</span>
          </NuxtLink>

          <div class="flex items-center gap-4">
            <Button variant="ghost" size="sm" @click="navigateTo('/dashboard')">
              Back to Dashboard
            </Button>
            <div class="text-right">
              <p class="text-sm font-medium text-gray-900">{{ userStore.username || 'User' }}</p>
              <p class="text-xs text-gray-600">{{ userStore.email }}</p>
            </div>
            <Button variant="outline" size="sm" @click="handleLogout">
              <LogOutIcon class="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <ShieldIcon class="w-8 h-8" />
          Roles & Permissions Management
        </h1>
        <p class="text-gray-600">Manage user roles, permissions, and access control</p>
      </div>

      <!-- Tabs -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div class="border-b border-gray-200">
          <nav class="flex -mb-px">
            <button
              @click="activeTab = 'roles'"
              :class="[
                'flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors',
                activeTab === 'roles'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              <ShieldIcon class="w-4 h-4" />
              Roles
            </button>
            <button
              @click="activeTab = 'permissions'"
              :class="[
                'flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors',
                activeTab === 'permissions'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              <KeyIcon class="w-4 h-4" />
              Permissions
            </button>
            <button
              @click="activeTab = 'users'"
              :class="[
                'flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors',
                activeTab === 'users'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              <UsersIcon class="w-4 h-4" />
              User Assignments
            </button>
          </nav>
        </div>

        <!-- Tab Content -->
        <div class="p-6">
          <RoleManagement v-if="activeTab === 'roles'" />
          <PermissionManagement v-if="activeTab === 'permissions'" />
          <UserRoleAssignment v-if="activeTab === 'users'" />
        </div>
      </div>
    </main>
  </div>
</template>
