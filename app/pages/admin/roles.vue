<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ShieldIcon, KeyIcon, UsersIcon } from 'lucide-vue-next'
import RoleManagement from '@/components/admin/RoleManagement.vue'
import PermissionManagement from '@/components/admin/PermissionManagement.vue'
import UserRoleAssignment from '@/components/admin/UserRoleAssignment.vue'

/**
 * Permission Middleware Examples:
 *
 * Single permission (current):
 * definePageMeta({
 *   middleware: ['auth', 'permission'],
 *   permission: 'manage roles'
 * })
 *
 * Multiple permissions with AND (user needs ALL):
 * definePageMeta({
 *   middleware: ['auth', 'permission'],
 *   permissions: ['view roles', 'edit roles'],
 *   permissionOperator: 'AND'
 * })
 *
 * Multiple permissions with OR (user needs AT LEAST ONE):
 * definePageMeta({
 *   middleware: ['auth', 'permission'],
 *   permissions: ['manage roles', 'admin'],
 *   permissionOperator: 'OR'
 * })
 */
definePageMeta({
  middleware: ['auth'],
  permission: 'view-users',
  layout: 'auth'
})

const route = useRoute()
const router = useRouter()

const STORAGE_KEY = 'admin_roles_active_tab'

// Get initial tab: URL > localStorage > default
const getInitialTab = (): 'roles' | 'permissions' | 'users' => {
  // Priority 1: URL query param (for shareable links)
  const urlTab = route.query.tab as string
  if (urlTab && ['roles', 'permissions', 'users'].includes(urlTab)) {
    return urlTab as 'roles' | 'permissions' | 'users'
  }

  // Priority 2: localStorage (user's last preference)
  if (import.meta.client) {
    const savedTab = localStorage.getItem(STORAGE_KEY)
    if (savedTab && ['roles', 'permissions', 'users'].includes(savedTab)) {
      return savedTab as 'roles' | 'permissions' | 'users'
    }
  }

  // Priority 3: Default
  return 'roles'
}

const activeTab = ref<'roles' | 'permissions' | 'users'>(getInitialTab())

// Sync activeTab changes with URL and localStorage
watch(activeTab, (newTab) => {
  // Update URL
  const query = { ...route.query, tab: newTab }
  router.push({ query })

  // Save to localStorage for next visit
  if (import.meta.client) {
    localStorage.setItem(STORAGE_KEY, newTab)
  }
})

// Watch URL changes to update activeTab (for browser back/forward)
watch(() => route.query.tab, (newTab) => {
  if (newTab && ['roles', 'permissions', 'users'].includes(newTab as string)) {
    activeTab.value = newTab as 'roles' | 'permissions' | 'users'
  }
})

// On mount, sync URL if tab came from localStorage
onMounted(() => {
  // If URL doesn't have a tab but we loaded from localStorage, update the URL
  if (!route.query.tab && activeTab.value) {
    const query = { ...route.query, tab: activeTab.value }
    router.replace({ query }) // Use replace to avoid adding to history
  }
})
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900 flex items-center gap-2">
        <ShieldIcon class="w-8 h-8" />
        Roles & Permissions
      </h1>
      <p class="text-gray-600 mt-1">Manage user roles, permissions, and access control</p>
    </div>

    <!-- Tabs -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
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
  </div>
</template>
