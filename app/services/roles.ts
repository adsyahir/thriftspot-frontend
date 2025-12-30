import { BaseService } from './base'
import type {
  CreateRoleRequest,
  UpdateRoleRequest,
  CreatePermissionRequest,
  UpdatePermissionRequest,
  AssignRoleRequest,
  RemoveRoleRequest
} from '@/types/roles'

export class RoleService extends BaseService {
  // Role Management
  async getRoles() {
    return await this.get('/roles')
  }

  async createRole(data: CreateRoleRequest) {
    return await this.post('/roles', data)
  }

  async updateRole(id: number, data: UpdateRoleRequest) {
    return await this.put(`/roles/${id}`, data)
  }

  async deleteRole(id: number) {
    return await this.delete(`/roles/${id}`)
  }

  // Permission Management
  async getPermissions() {
    return await this.get('/permissions')
  }

  async createPermission(data: CreatePermissionRequest) {
    return await this.post('/permissions', data)
  }

  async updatePermission(id: number, data: UpdatePermissionRequest) {
    return await this.put(`/permissions/${id}`, data)
  }

  async deletePermission(id: number) {
    return await this.delete(`/permissions/${id}`)
  }

  // User Role Management
  async getUsersWithRoles(page: number = 1, search: string = '', userSearch: string = '', emailSearch: string = '') {
    const params: Record<string, any> = { page }

    if (search) params.search = search
    if (userSearch) params.name = userSearch
    if (emailSearch) params.email = emailSearch

    return await this.get('/users/roles', params)
  }

  async assignRoleToUser(userId: number, data: AssignRoleRequest) {
    return await this.post(`/users/${userId}/roles`, data)
  }

  async removeRoleFromUser(userId: number, _data: RemoveRoleRequest) {
    return await this.delete(`/users/${userId}/roles`)
  }
}

/**
 * Composable to get RoleService instance
 * Use this in components: const roleService = useRoleService()
 */
export const useRoleService = () => {
  const nuxtApp = useNuxtApp()
  const service = new RoleService()
  service.init(nuxtApp)
  return service
}
