<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { UserPlus, Shield, Trash2, Users } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
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
import { roleService } from '@/services/roles'
import type { UserWithRoles, Role } from '@/types/roles'

const users = ref<UserWithRoles[]>([])
const roles = ref<Role[]>([])
const loading = ref(false)
const isDialogOpen = ref(false)
const currentUser = ref<UserWithRoles | null>(null)

const formData = ref({
  selectedRole: '',
})

const loadUsers = async () => {
  try {
    loading.value = true
    const response = await roleService.getUsersWithRoles()
    users.value = response.data
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

onMounted(() => {
  loadUsers()
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
          <TableRow v-else-if="users.length === 0">
            <TableCell colspan="6" class="text-center py-8 text-gray-500">
              No users found.
            </TableCell>
          </TableRow>
          <TableRow v-for="user in users" :key="user.id" v-else>
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
  </div>
</template>
