<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Key, Info, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useRoleService } from '@/services/index'
import type { Permission } from '@/types/roles'

const roleService = useRoleService()
const permissions = ref<Permission[]>([])
const loading = ref(false)

// Pagination state (you'll connect this to your logic)
const currentPage = ref(1)
const totalPages = ref(10) // Example: replace with your actual total pages
const perPage = ref(10)
const total = ref(100) // Example: replace with your actual total count

const loadPermissions = async () => {
  try {
    loading.value = true
    const response = await roleService.getPermissions()
    console.log(response.data);
    permissions.value = response.data
  } catch (error) {
    console.error('Failed to load permissions:', error)
    alert('Failed to load permissions. Please try again.')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadPermissions()
})
</script>

<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-start gap-3">
        <div class="flex-1">
          <h2 class="text-2xl font-bold text-gray-900">Permissions</h2>
          <p class="text-sm text-gray-600 mt-1">View all system permissions</p>
        </div>
        <div class="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
          <Info class="w-4 h-4 text-blue-600" />
          <span class="text-sm text-blue-700 font-medium">Read-only</span>
        </div>
      </div>
    </div>

    <!-- Permissions Table -->
    <div class="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Permission Name</TableHead>
            <TableHead>Guard</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Last Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-if="loading">
            <TableCell colspan="4" class="text-center py-8">
              <div class="flex items-center justify-center gap-2">
                <div class="w-4 h-4 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
                Loading permissions...
              </div>
            </TableCell>
          </TableRow>
          <TableRow v-else-if="permissions.length === 0">
            <TableCell colspan="4" class="text-center py-8 text-gray-500">
              No permissions found.
            </TableCell>
          </TableRow>
          <TableRow v-for="permission in permissions" :key="permission.id" v-else>
            <TableCell>
              <div class="flex items-center gap-2">
                <Key class="w-4 h-4 text-gray-500" />
                <span class="font-medium">{{ permission.name }}</span>
              </div>
            </TableCell>
            <TableCell>
              <span class="text-sm text-gray-600">{{ permission.guard_name }}</span>
            </TableCell>
            <TableCell>
              <span class="text-sm text-gray-600">
                {{ new Date(permission.created_at).toLocaleDateString() }}
              </span>
            </TableCell>
            <TableCell>
              <span class="text-sm text-gray-600">
                {{ new Date(permission.updated_at).toLocaleDateString() }}
              </span>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6 rounded-b-lg mt-4">
      <!-- Results info -->
      <div class="flex-1 flex justify-between sm:hidden">
        <button
          class="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="currentPage === 1"
        >
          Previous
        </button>
        <button
          class="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="currentPage === totalPages"
        >
          Next
        </button>
      </div>

      <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <!-- Showing X to Y of Z results -->
        <div>
          <p class="text-sm text-gray-700">
            Showing
            <span class="font-medium">{{ (currentPage - 1) * perPage + 1 }}</span>
            to
            <span class="font-medium">{{ Math.min(currentPage * perPage, total) }}</span>
            of
            <span class="font-medium">{{ total }}</span>
            results
          </p>
        </div>

        <!-- Pagination buttons -->
        <div>
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <!-- Previous button -->
            <button
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="currentPage === 1"
            >
              <span class="sr-only">Previous</span>
              <ChevronLeft class="h-5 w-5" />
            </button>

            <!-- Page numbers -->
            <button
              v-for="page in totalPages"
              :key="page"
              class="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
              :class="[
                page === currentPage
                  ? 'z-10 bg-gray-900 border-gray-900 text-white'
                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
              ]"
            >
              {{ page }}
            </button>

            <!-- Next button -->
            <button
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="currentPage === totalPages"
            >
              <span class="sr-only">Next</span>
              <ChevronRight class="h-5 w-5" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>
