export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  roles: string[];
  permissions: string[];
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  remember?: boolean;
}

export interface LoginResponse {
  message: string;
  user: User;
  access_token?: string;
  refresh_token?: string;
  token_type?: string;
  expires_in?: number;
}

export interface RefreshTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}
