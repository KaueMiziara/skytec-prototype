import { Injectable, computed, signal } from '@angular/core';
import {
  AuthState,
  LoginCredentials,
  RegisterData,
  User,
  UserRole
} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly defaultUsers: User[] = [
    {
      id: 'usr-admin-1',
      name: 'Administrador SKYTEC',
      email: 'admin@skytec.com.br',
      cnpjCpf: '00.000.000/0001-91',
      phone: '(11) 99999-0000',
      role: 'admin'
    },
    {
      id: 'usr-client-1',
      name: 'Confecção Modelo',
      email: 'cliente@skytec.com.br',
      cnpjCpf: '12.345.678/0001-90',
      phone: '(11) 98765-4321',
      role: 'client'
    }
  ];

  private readonly currentUserSignal = signal<User | null>(null);

  readonly currentUser = this.currentUserSignal.asReadonly();

  readonly isAuthenticated = computed<boolean>(() => this.currentUserSignal() !== null);

  readonly isAdmin = computed<boolean>(() => this.currentUserSignal()?.role === 'admin');

  readonly userName = computed<string>(() => this.currentUserSignal()?.name ?? '');

  login(credentials: LoginCredentials): boolean {
    const trimmedEmail = credentials.email.trim().toLowerCase();
    const trimmedPassword = credentials.password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      return false;
    }

    const existingUser = this.defaultUsers.find(
      (user) => user.email.toLowerCase() === trimmedEmail
    );

    if (existingUser) {
      this.currentUserSignal.set(existingUser);
      return true;
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: trimmedEmail.split('@')[0],
      email: trimmedEmail,
      role: 'client'
    };

    this.currentUserSignal.set(newUser);
    return true;
  }

  register(data: RegisterData): User {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      cnpjCpf: data.cnpjCpf.trim(),
      phone: data.phone.trim(),
      role: 'client'
    };

    this.currentUserSignal.set(newUser);
    return newUser;
  }

  logout(): void {
    this.currentUserSignal.set(null);
  }

  setUser(user: User | null): void {
    this.currentUserSignal.set(user);
  }
}
