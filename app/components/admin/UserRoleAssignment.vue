<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { UserPlus, Shield, Trash2, Users, ChevronLeft, ChevronRight, Search, X } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { useRoleService } from '@/services/roles'
import type { UserWithRoles, Role } from '@/types/roles'

const route = useRoute()
const router = useRouter()
const roleService = useRoleService()

const users = ref({
  data: [] as UserWithRoles[],
  pagination: {
    currentPage: 1,
    totalPages: 10,
    perPage: 10,
    total: 100
  }
})
const roles = ref<Role[]>([])
const loading = ref(false)
const isDialogOpen = ref(false)
const currentUser = ref<UserWithRoles | null>(null)

const formData = ref({
  selectedRole: '',
})

// Initialize search state from URL query params
const searchFilters = ref({
  global: (route.query.search as string) || '',
  user: (route.query.name as string) || '',
  email: (route.query.email as string) || '',
})

const loadUsers = async (page: number = 1) : Promise<void> => {
  try {
    loading.value = true
    const response = await roleService.getUsersWithRoles(
      page,
      searchFilters.value.global,
      searchFilters.value.user,
      searchFilters.value.email
    )
    users.value.data = response.data.data
    // Update pagination from API response
    users.value.pagination = {
      currentPage: response.data.current_page,
      totalPages: response.data.last_page,
      perPage: response.data.per_page,
      total: response.data.total
    }
  } catch (error) {
    console.error('Failed to load users:', error)
    alert('Failed to load users. Please try again.')
  } finally {
    loading.value = false
  }
}

const loadRoles = async () => {
  try {
    const response = await roleService.getRoles()
    roles.value = response.data
  } catch (error) {
    console.error('Failed to load roles:', error)
  }
}

const openAssignDialog = (user: UserWithRoles) => {
  currentUser.value = user
  formData.value = {
    selectedRole: '',
  }
  isDialogOpen.value = true
}

const handleAssignRole = async () => {
  if (!currentUser.value || !formData.value.selectedRole) return

  try {
    loading.value = true
    await roleService.assignRoleToUser(currentUser.value.id, {
      role: formData.value.selectedRole,
    })
    isDialogOpen.value = false
    await loadUsers()
  } catch (error) {
    console.error('Failed to assign role:', error)
    alert('Failed to assign role. Please try again.')
  } finally {
    loading.value = false
  }
}

const handleRemoveRole = async (userId: number, roleName: string) => {
  if (!confirm(`Are you sure you want to remove the "${roleName}" role from this user?`)) return

  try {
    loading.value = true
    await roleService.removeRoleFromUser(userId, {
      role: roleName,
    })
    await loadUsers()
  } catch (error) {
    console.error('Failed to remove role:', error)
    alert('Failed to remove role. Please try again.')
  } finally {
    loading.value = false
  }
}

const getAvailableRoles = (userRoles: string[]) => {
  return roles.value.filter(role => !userRoles.includes(role.name))
}

const changePage = async (page: number) => {
  if (page < 1 || page > users.value.pagination.totalPages) return

  // Save current scroll position
  const scrollY = window.scrollY

  // Update URL with page parameter
  const query: Record<string, string> = { ...route.query as Record<string, string>, page: String(page) }
  await router.replace({ query })

  // Load users data
  await loadUsers(page)

  // Wait for Vue to update the DOM, then restore scroll position
  await nextTick()
  requestAnimationFrame(() => {
    window.scrollTo(0, scrollY)
  })
}

const getPageNumbers = () => {
  const current = users.value.pagination.currentPage
  const total = users.value.pagination.totalPages
  const delta = 2 // Number of pages to show on each side of current page
  const pages: (number | string)[] = []

  if (total <= 7) {
    // Show all pages if total is small
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Always show first page
    pages.push(1)

    // Calculate range around current page
    const start = Math.max(2, current - delta)
    const end = Math.min(total - 1, current + delta)

    // Add ellipsis after first page if needed
    if (start > 2) {
      pages.push('...')
    }

    // Add pages around current
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    // Add ellipsis before last page if needed
    if (end < total - 1) {
      pages.push('...')
    }

    // Always show last page
    pages.push(total)
  }

  return pages
}

const clearSearch = () => {
  searchFilters.value.global = ''
  searchFilters.value.user = ''
  searchFilters.value.email = ''
  // Note: The watch on searchFilters will handle URL update and data reload with scroll preservation
}

// Sync search filters with URL query params
const updateUrlFromFilters = async () => {
  // Start with existing query params to preserve things like 'tab'
  const query: Record<string, string> = { ...route.query as Record<string, string> }

  // Update or remove search parameters
  if (searchFilters.value.global) {
    query.search = searchFilters.value.global
  } else {
    delete query.search
  }

  if (searchFilters.value.user) {
    query.name = searchFilters.value.user
  } else {
    delete query.name
  }

  if (searchFilters.value.email) {
    query.email = searchFilters.value.email
  } else {
    delete query.email
  }

  // Reset to page 1 when searching
  delete query.page

  await router.replace({ query })
}

// Debounced search - watch for changes and reload with delay
let searchTimeout: NodeJS.Timeout | null = null
watch(searchFilters, () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(async () => {
    // Save current scroll position
    const scrollY = window.scrollY

    users.value.pagination.currentPage = 1 // Reset to first page on new search
    await updateUrlFromFilters()
    await loadUsers(1)

    // Wait for Vue to update the DOM, then restore scroll position
    await nextTick()
    requestAnimationFrame(() => {
      window.scrollTo(0, scrollY)
    })
  }, 500) // 500ms debounce
}, { deep: true })

onMounted(() => {
  // Get initial page from URL or default to 1
  const initialPage = parseInt(route.query.page as string) || 1
  loadUsers(initialPage)
  loadRoles()
})
</script>

<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-900">User Role Assignments</h2>
      <p class="text-sm text-gray-600 mt-1">Manage user role assignments and permissions</p>
    </div>

    <!-- Search Filters -->
    <div class="mb-4 space-y-4">
      <!-- Global Search -->
      <div class="relative">
        <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          v-model="searchFilters.global"
          type="text"
          placeholder="Search all fields..."
          class="pl-10 pr-10"
        />
        <button
          v-if="searchFilters.global"
          @click="searchFilters.global = ''"
          class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Column Specific Search -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- User Search -->
        <div class="relative">
          <Users class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            v-model="searchFilters.user"
            type="text"
            placeholder="Search by user..."
            class="pl-10 pr-10"
          />
          <button
            v-if="searchFilters.user"
            @click="searchFilters.user = ''"
            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Email Search -->
        <div class="relative">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            v-model="searchFilters.email"
            type="text"
            placeholder="Search by email..."
            class="pl-10 pr-10"
          />
          <button
            v-if="searchFilters.email"
            @click="searchFilters.email = ''"
            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Clear All Button -->
        <div class="flex items-center">
          <Button
            variant="outline"
            size="sm"
            @click="clearSearch"
            :disabled="!searchFilters.global && !searchFilters.user && !searchFilters.email"
            class="w-full"
          >
            <X class="w-4 h-4 mr-2" />
            Clear All Filters
          </Button>
        </div>
      </div>
    </div>

    <!-- Users Table -->
    <div class="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Roles</TableHead>
            <TableHead>Permissions</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead class="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-if="loading">
            <TableCell colspan="6" class="text-center py-8">
              <div class="flex items-center justify-center gap-2">
                <div class="w-4 h-4 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
                Loading users...
              </div>
            </TableCell>
          </TableRow>
          <TableRow v-else-if="users.data.length === 0">
            <TableCell colspan="6" class="text-center py-8 text-gray-500">
              No users found.
            </TableCell>
          </TableRow>
          <TableRow v-for="user in users.data" :key="user.id" v-else>
            <TableCell>
              <div class="flex items-center gap-2">
                <Users class="w-4 h-4 text-gray-500" />
                <div>
                  <div class="font-medium">{{ user.name }}</div>
                  <div class="text-xs text-gray-500">@{{ user.username }}</div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <span class="text-sm text-gray-600">{{ user.email }}</span>
            </TableCell>
            <TableCell>
              <div class="flex flex-wrap gap-1">
                <div
                  v-for="(role, index) in user.roles"
                  :key="index"
                  class="flex items-center gap-1"
                >
                  <Badge variant="default" class="text-xs">
                    {{ role }}
                  </Badge>
                  <button
                    @click="handleRemoveRole(user.id, role)"
                    class="text-red-600 hover:text-red-700 p-0.5 rounded hover:bg-red-50"
                    title="Remove role"
                  >
                    <Trash2 class="w-3 h-3" />
                  </button>
                </div>
                <Badge v-if="user.roles.length === 0" variant="outline" class="text-xs text-gray-400">
                  No roles
                </Badge>
              </div>
            </TableCell>
            <TableCell>
              <div class="flex flex-wrap gap-1">
                <Badge
                  v-for="(permission, index) in user.permissions.slice(0, 2)"
                  :key="index"
                  variant="secondary"
                  class="text-xs"
                >
                  {{ permission }}
                </Badge>
                <Badge v-if="user.permissions.length > 2" variant="outline" class="text-xs">
                  +{{ user.permissions.length - 2 }} more
                </Badge>
                <span v-if="user.permissions.length === 0" class="text-xs text-gray-400">
                  No permissions
                </span>
              </div>
            </TableCell>
            <TableCell>
              <span class="text-sm text-gray-600">
                {{ new Date(user.created_at).toLocaleDateString() }}
              </span>
            </TableCell>
            <TableCell class="text-right">
              <Dialog v-model:open="isDialogOpen">
                <DialogTrigger as-child>
                  <Button
                    variant="ghost"
                    size="sm"
                    @click="openAssignDialog(user)"
                  >
                    <UserPlus class="w-4 h-4 mr-2" />
                    Assign Role
                  </Button>
                </DialogTrigger>
                <DialogContent v-if="currentUser?.id === user.id">
                  <DialogHeader>
                    <DialogTitle>Assign Role to {{ currentUser.name }}</DialogTitle>
                    <DialogDescription>
                      Select a role to assign to this user
                    </DialogDescription>
                  </DialogHeader>

                  <div class="space-y-4 py-4">
                    <div class="space-y-2">
                      <Label for="role-select">Select Role</Label>
                      <Select v-model="formData.selectedRole">
                        <SelectTrigger id="role-select">
                          <SelectValue placeholder="Choose a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem
                            v-for="role in getAvailableRoles(user.roles)"
                            :key="role.id"
                            :value="role.name"
                          >
                            <div class="flex items-center gap-2">
                              <Shield class="w-4 h-4" />
                              {{ role.name }}
                              <span class="text-xs text-gray-500">
                                ({{ role.permissions_count }} permissions)
                              </span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <div v-if="getAvailableRoles(user.roles).length === 0" class="text-sm text-gray-500">
                        This user already has all available roles assigned.
                      </div>
                    </div>

                    <!-- Show selected role permissions -->
                    <div v-if="formData.selectedRole" class="border rounded-lg p-4 bg-gray-50">
                      <p class="text-sm font-medium mb-2">Role Permissions:</p>
                      <div class="flex flex-wrap gap-1">
                        <Badge
                          v-for="permission in roles.find(r => r.name === formData.selectedRole)?.permissions || []"
                          :key="permission"
                          variant="secondary"
                          class="text-xs"
                        >
                          {{ permission }}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" @click="isDialogOpen = false">Cancel</Button>
                    <Button
                      @click="handleAssignRole"
                      :disabled="loading || !formData.selectedRole"
                    >
                      Assign Role
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6 rounded-b-lg mt-4">
      <!-- Mobile pagination -->
      <div class="flex-1 flex justify-between sm:hidden">
        <button
          @click="changePage(users.pagination.currentPage - 1)"
          class="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="users.pagination.currentPage === 1"
        >
          Previous
        </button>
        <button
          @click="changePage(users.pagination.currentPage + 1)"
          class="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="users.pagination.currentPage === users.pagination.totalPages"
        >
          Next
        </button>
      </div>

      <!-- Desktop pagination -->
      <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <!-- Results info -->
        <div>
          <p class="text-sm text-gray-700">
            Showing
            <span class="font-medium">{{ (users.pagination.currentPage - 1) * users.pagination.perPage + 1 }}</span>
            to
            <span class="font-medium">{{ Math.min(users.pagination.currentPage * users.pagination.perPage, users.pagination.total) }}</span>
            of
            <span class="font-medium">{{ users.pagination.total }}</span>
            results
          </p>
        </div>

        <!-- Pagination buttons -->
        <div>
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <!-- Previous button -->
            <button
              @click="changePage(users.pagination.currentPage - 1)"
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="users.pagination.currentPage === 1"
            >
              <span class="sr-only">Previous</span>
              <ChevronLeft class="h-5 w-5" />
            </button>

            <!-- Page numbers -->
            <template v-for="(page, index) in getPageNumbers()" :key="index">
              <button
                v-if="typeof page === 'number'"
                @click="changePage(page)"
                class="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                :class="[
                  page === users.pagination.currentPage
                    ? 'z-10 bg-gray-900 border-gray-900 text-white'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                ]"
              >
                {{ page }}
              </button>
              <span
                v-else
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
              >
                {{ page }}
              </span>
            </template>

            <!-- Next button -->
            <button
              @click="changePage(users.pagination.currentPage + 1)"
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="users.pagination.currentPage === users.pagination.totalPages"
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
