export type UserRole = 'DJ' | 'FAN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}