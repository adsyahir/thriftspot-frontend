import type {
  RolesResponse,
  PermissionsResponse,
  RoleResponse,
  PermissionResponse,
  UsersWithRolesResponse,
  UserRoleResponse,
  CreateRoleRequest,
  UpdateRoleRequest,
  CreatePermissionRequest,
  UpdatePermissionRequest,
  AssignRoleRequest,
  RemoveRoleRequest,
} from '@/types/roles'

export class RoleService {
  private api: any

  constructor() {
    // Get the axios instance from the plugin
    const { $api } = useNuxtApp()
    this.api = $api
  }

  // Role Management
  async getRoles(): Promise<RolesResponse> {
    return await this.api.get('/roles')
  }

  async createRole(data: CreateRoleRequest): Promise<RoleResponse> {
    return await this.api.post('/roles', data)
  }

  async updateRole(id: number, data: UpdateRoleRequest): Promise<RoleResponse> {
    return await this.api.put(`/roles/${id}`, data)
  }

  async deleteRole(id: number): Promise<{ message: string }> {
    return await this.api.delete(`/roles/${id}`)
  }

  // Permission Management
  async getPermissions(): Promise<PermissionsResponse> {
    return await this.api.get('/permissions')
  }

  async createPermission(data: CreatePermissionRequest): Promise<PermissionResponse> {
    return await this.api.post('/permissions', data)
  }

  async updatePermission(id: number, data: UpdatePermissionRequest): Promise<PermissionResponse> {
    return await this.api.put(`/permissions/${id}`, data)
  }

  async deletePermission(id: number): Promise<{ message: string }> {
    return await this.api.delete(`/permissions/${id}`)
  }

  // User Role Management
  async getUsersWithRoles(): Promise<UsersWithRolesResponse> {
    return await this.api.get('/users/roles')
  }

  async assignRoleToUser(userId: number, data: AssignRoleRequest): Promise<UserRoleResponse> {
    return await this.api.post(`/users/${userId}/roles`, data)
  }

  async removeRoleFromUser(userId: number, data: RemoveRoleRequest): Promise<UserRoleResponse> {
    return await this.api.delete(`/users/${userId}/roles`, { data })
  }
}

export const roleService = new RoleService()
