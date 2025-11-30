<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus, Pencil, Trash2, Key } from 'lucide-vue-next'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { roleService } from '@/services/roles'
import type { Permission } from '@/types/roles'

const permissions = ref<Permission[]>([])
const loading = ref(false)
const isDialogOpen = ref(false)
const isEditMode = ref(false)
const currentPermission = ref<Permission | null>(null)

const formData = ref({
  name: '',
})

const loadPermissions = async () => {
  try {
    loading.value = true
    const response = await roleService.getPermissions()
    permissions.value = response.data
  } catch (error) {
    console.error('Failed to load permissions:', error)
    alert('Failed to load permissions. Please try again.')
  } finally {
    loading.value = false
  }
}

const openCreateDialog = () => {
  isEditMode.value = false
  currentPermission.value = null
  formData.value = {
    name: '',
  }
  isDialogOpen.value = true
}

const openEditDialog = (permission: Permission) => {
  isEditMode.value = true
  currentPermission.value = permission
  formData.value = {
    name: permission.name,
  }
  isDialogOpen.value = true
}

const handleSubmit = async () => {
  try {
    loading.value = true
    if (isEditMode.value && currentPermission.value) {
      await roleService.updatePermission(currentPermission.value.id, {
        name: formData.value.name,
      })
    } else {
      await roleService.createPermission({
        name: formData.value.name,
      })
    }
    isDialogOpen.value = false
    await loadPermissions()
  } catch (error) {
    console.error('Failed to save permission:', error)
    alert('Failed to save permission. Please try again.')
  } finally {
    loading.value = false
  }
}

const handleDelete = async (id: number) => {
  if (!confirm('Are you sure you want to delete this permission? This may affect existing roles.')) return

  try {
    loading.value = true
    await roleService.deletePermission(id)
    await loadPermissions()
  } catch (error) {
    console.error('Failed to delete permission:', error)
    alert('Failed to delete permission. Please try again.')
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
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Permissions</h2>
        <p class="text-sm text-gray-600 mt-1">Manage system permissions</p>
      </div>
      <Dialog v-model:open="isDialogOpen">
        <DialogTrigger as-child>
          <Button @click="openCreateDialog">
            <Plus class="w-4 h-4 mr-2" />
            Create Permission
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{{ isEditMode ? 'Edit Permission' : 'Create New Permission' }}</DialogTitle>
            <DialogDescription>
              {{ isEditMode ? 'Update permission details' : 'Add a new permission to the system' }}
            </DialogDescription>
          </DialogHeader>

          <div class="space-y-4 py-4">
            <div class="space-y-2">
              <Label for="permission-name">Permission Name</Label>
              <Input
                id="permission-name"
                v-model="formData.name"
                placeholder="e.g., create-items, edit-users"
              />
              <p class="text-xs text-gray-500">
                Use kebab-case naming convention (e.g., create-items, delete-posts)
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" @click="isDialogOpen = false">Cancel</Button>
            <Button @click="handleSubmit" :disabled="loading || !formData.name">
              {{ isEditMode ? 'Update' : 'Create' }} Permission
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
            <TableHead class="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-if="loading">
            <TableCell colspan="5" class="text-center py-8">
              <div class="flex items-center justify-center gap-2">
                <div class="w-4 h-4 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
                Loading permissions...
              </div>
            </TableCell>
          </TableRow>
          <TableRow v-else-if="permissions.length === 0">
            <TableCell colspan="5" class="text-center py-8 text-gray-500">
              No permissions found. Create your first permission to get started.
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
            <TableCell class="text-right">
              <div class="flex items-center justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  @click="openEditDialog(permission)"
                >
                  <Pencil class="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  @click="handleDelete(permission.id)"
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
