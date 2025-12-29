<script setup lang="ts">
import { ref } from 'vue'
import { ShieldIcon, KeyIcon, UsersIcon } from 'lucide-vue-next'
import RoleManagement from '@/components/admin/RoleManagement.vue'
import PermissionManagement from '@/components/admin/PermissionManagement.vue'
import UserRoleAssignment from '@/components/admin/UserRoleAssignment.vue'

definePageMeta({
  middleware: 'auth',
  layout: 'auth'
})

const activeTab = ref<'roles' | 'permissions' | 'users'>('roles')
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
