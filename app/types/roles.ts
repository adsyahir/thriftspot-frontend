export interface Permission {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: number;
  name: string;
  guard_name: string;
  permissions: string[];
  permissions_count: number;
  created_at: string;
  updated_at: string;
}

export interface UserWithRoles {
  id: number;
  name: string;
  email: string;
  username: string;
  roles: string[];
  permissions: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateRoleRequest {
  name: string;
  permissions?: string[];
}

export interface UpdateRoleRequest {
  name: string;
  permissions?: string[];
}

export interface CreatePermissionRequest {
  name: string;
}

export interface UpdatePermissionRequest {
  name: string;
}

export interface AssignRoleRequest {
  role: string;
}

export interface RemoveRoleRequest {
  role: string;
}

export interface RoleResponse {
  message: string;
  data: Role;
}

export interface RolesResponse {
  data: Role[];
}

export interface PermissionResponse {
  message: string;
  data: Permission;
}

export interface PermissionsResponse {
  data: Permission[];
}

export interface UsersWithRolesResponse {
  data: UserWithRoles[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface UserRoleResponse {
  message: string;
  data: {
    user_id: number;
    roles: string[];
  };
}

export interface UserRolesRequest {
  page?: number;
  per_page?: number;
  search?: string;
  name?: string;
  email?: string;
}

