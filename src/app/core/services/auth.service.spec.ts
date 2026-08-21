import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with unauthenticated state', () => {
    expect(service.currentUser()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
    expect(service.isAdmin()).toBe(false);
    expect(service.userName()).toBe('');
  });

  it('should login as admin user', () => {
    const success = service.login({
      email: 'admin@skytec.com.br',
      password: 'anyPassword123'
    });

    expect(success).toBe(true);
    expect(service.isAuthenticated()).toBe(true);
    expect(service.isAdmin()).toBe(true);
    expect(service.currentUser()?.role).toBe('admin');
    expect(service.currentUser()?.name).toBe('Administrador SKYTEC');
  });

  it('should login as existing client user', () => {
    const success = service.login({
      email: 'cliente@skytec.com.br',
      password: 'anyPassword123'
    });

    expect(success).toBe(true);
    expect(service.isAuthenticated()).toBe(true);
    expect(service.isAdmin()).toBe(false);
    expect(service.currentUser()?.role).toBe('client');
    expect(service.currentUser()?.name).toBe('Confecção Modelo');
  });

  it('should login with new email and create mock client user', () => {
    const success = service.login({
      email: 'custom@empresa.com.br',
      password: 'password123'
    });

    expect(success).toBe(true);
    expect(service.isAuthenticated()).toBe(true);
    expect(service.currentUser()?.email).toBe('custom@empresa.com.br');
    expect(service.currentUser()?.role).toBe('client');
  });

  it('should fail login with empty email or password', () => {
    expect(service.login({ email: '', password: '123' })).toBe(false);
    expect(service.login({ email: 'test@email.com', password: '' })).toBe(false);
    expect(service.isAuthenticated()).toBe(false);
  });

  it('should register new client user', () => {
    const newUser = service.register({
      name: 'Nova Confecção Têxtil',
      email: 'contato@novaconfeccao.com.br',
      cnpjCpf: '98.765.432/0001-10',
      phone: '(11) 98888-7777',
      password: 'securePassword123'
    });

    expect(newUser).toBeTruthy();
    expect(newUser.name).toBe('Nova Confecção Têxtil');
    expect(newUser.role).toBe('client');
    expect(service.isAuthenticated()).toBe(true);
    expect(service.currentUser()?.name).toBe('Nova Confecção Têxtil');
  });

  it('should logout and clear current user', () => {
    service.login({
      email: 'cliente@skytec.com.br',
      password: '123'
    });
    expect(service.isAuthenticated()).toBe(true);

    service.logout();
    expect(service.currentUser()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
  });

  it('should set custom user directly with setUser', () => {
    service.setUser({
      id: 'custom-id',
      name: 'Custom User',
      email: 'custom@user.com',
      role: 'client'
    });

    expect(service.currentUser()?.id).toBe('custom-id');
    expect(service.isAuthenticated()).toBe(true);
  });
});
