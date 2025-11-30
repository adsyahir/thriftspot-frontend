<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus, Pencil, Trash2, Shield } from 'lucide-vue-next'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
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
import type { Role, Permission } from '@/types/roles'

const roles = ref<Role[]>([])
const permissions = ref<Permission[]>([])
const loading = ref(false)
const isDialogOpen = ref(false)
const isEditMode = ref(false)
const currentRole = ref<Role | null>(null)

const formData = ref({
  name: '',
  selectedPermissions: [] as string[],
})

const loadRoles = async () => {
  try {
    loading.value = true
    const response = await roleService.getRoles()
    roles.value = response.data
  } catch (error) {
    console.error('Failed to load roles:', error)
    alert('Failed to load roles. Please try again.')
  } finally {
    loading.value = false
  }
}

const loadPermissions = async () => {
  try {
    const response = await roleService.getPermissions()
    permissions.value = response.data
  } catch (error) {
    console.error('Failed to load permissions:', error)
  }
}

const openCreateDialog = () => {
  isEditMode.value = false
  currentRole.value = null
  formData.value = {
    name: '',
    selectedPermissions: [],
  }
  isDialogOpen.value = true
}

const openEditDialog = (role: Role) => {
  isEditMode.value = true
  currentRole.value = role
  formData.value = {
    name: role.name,
    selectedPermissions: [...role.permissions],
  }
  isDialogOpen.value = true
}

const handleSubmit = async () => {
  try {
    loading.value = true
    if (isEditMode.value && currentRole.value) {
      await roleService.updateRole(currentRole.value.id, {
        name: formData.value.name,
        permissions: formData.value.selectedPermissions,
      })
    } else {
      await roleService.createRole({
        name: formData.value.name,
        permissions: formData.value.selectedPermissions,
      })
    }
    isDialogOpen.value = false
    await loadRoles()
  } catch (error) {
    console.error('Failed to save role:', error)
    alert('Failed to save role. Please try again.')
  } finally {
    loading.value = false
  }
}

const handleDelete = async (id: number) => {
  if (!confirm('Are you sure you want to delete this role?')) return

  try {
    loading.value = true
    await roleService.deleteRole(id)
    await loadRoles()
  } catch (error) {
    console.error('Failed to delete role:', error)
    alert('Failed to delete role. Please try again.')
  } finally {
    loading.value = false
  }
}

const togglePermission = (permissionName: string) => {
  const index = formData.value.selectedPermissions.indexOf(permissionName)
  if (index > -1) {
    formData.value.selectedPermissions.splice(index, 1)
  } else {
    formData.value.selectedPermissions.push(permissionName)
  }
}

onMounted(() => {
  loadRoles()
  loadPermissions()
})
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Roles</h2>
        <p class="text-sm text-gray-600 mt-1">Manage user roles and their permissions</p>
      </div>
      <Dialog v-model:open="isDialogOpen">
        <DialogTrigger as-child>
          <Button @click="openCreateDialog">
            <Plus class="w-4 h-4 mr-2" />
            Create Role
          </Button>
        </DialogTrigger>
        <DialogContent class="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{{ isEditMode ? 'Edit Role' : 'Create New Role' }}</DialogTitle>
            <DialogDescription>
              {{ isEditMode ? 'Update role details and permissions' : 'Add a new role with specific permissions' }}
            </DialogDescription>
          </DialogHeader>

          <div class="space-y-4 py-4">
            <div class="space-y-2">
              <Label for="role-name">Role Name</Label>
              <Input
                id="role-name"
                v-model="formData.name"
                placeholder="e.g., editor, moderator"
              />
            </div>

            <div class="space-y-2">
              <Label>Permissions</Label>
              <div class="border rounded-lg p-4 max-h-64 overflow-y-auto">
                <div
                  v-for="permission in permissions"
                  :key="permission.id"
                  class="flex items-center space-x-2 py-2"
                >
                  <Checkbox
                    :id="`permission-${permission.id}`"
                    :checked="formData.selectedPermissions.includes(permission.name)"
                    @update:checked="togglePermission(permission.name)"
                  />
                  <Label
                    :for="`permission-${permission.id}`"
                    class="text-sm font-normal cursor-pointer"
                  >
                    {{ permission.name }}
                  </Label>
                </div>
                <div v-if="permissions.length === 0" class="text-sm text-gray-500 text-center py-4">
                  No permissions available
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" @click="isDialogOpen = false">Cancel</Button>
            <Button @click="handleSubmit" :disabled="loading || !formData.name">
              {{ isEditMode ? 'Update' : 'Create' }} Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>

    <!-- Roles Table -->
    <div class="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Role Name</TableHead>
            <TableHead>Permissions</TableHead>
            <TableHead>Guard</TableHead>
            <TableHead>Created</TableHead>
            <TableHead class="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-if="loading">
            <TableCell colspan="5" class="text-center py-8">
              <div class="flex items-center justify-center gap-2">
                <div class="w-4 h-4 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
                Loading roles...
              </div>
            </TableCell>
          </TableRow>
          <TableRow v-else-if="roles.length === 0">
            <TableCell colspan="5" class="text-center py-8 text-gray-500">
              No roles found. Create your first role to get started.
            </TableCell>
          </TableRow>
          <TableRow v-for="role in roles" :key="role.id" v-else>
            <TableCell>
              <div class="flex items-center gap-2">
                <Shield class="w-4 h-4 text-gray-500" />
                <span class="font-medium">{{ role.name }}</span>
              </div>
            </TableCell>
            <TableCell>
              <div class="flex flex-wrap gap-1">
                <Badge
                  v-for="permission in role.permissions.slice(0, 3)"
                  :key="permission"
                  variant="secondary"
                  class="text-xs"
                >
                  {{ permission }}
                </Badge>
                <Badge v-if="role.permissions.length > 3" variant="outline" class="text-xs">
                  +{{ role.permissions.length - 3 }} more
                </Badge>
              </div>
              <div v-if="role.permissions.length === 0" class="text-sm text-gray-400">
                No permissions
              </div>
            </TableCell>
            <TableCell>
              <span class="text-sm text-gray-600">{{ role.guard_name }}</span>
            </TableCell>
            <TableCell>
              <span class="text-sm text-gray-600">
                {{ new Date(role.created_at).toLocaleDateString() }}
              </span>
            </TableCell>
            <TableCell class="text-right">
              <div class="flex items-center justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  @click="openEditDialog(role)"
                >
                  <Pencil class="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  @click="handleDelete(role.id)"
                  class="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 class="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
</template>
