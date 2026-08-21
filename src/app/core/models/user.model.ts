export type UserRole = 'client' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  cnpjCpf?: string;
  phone?: string;
  role: UserRole;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  cnpjCpf: string;
  phone: string;
}
