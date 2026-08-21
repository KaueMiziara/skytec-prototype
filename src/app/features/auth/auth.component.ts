import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  signal
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LoginCredentials, RegisterData } from '../../core/models/user.model';
import { AuthService } from '../../core/services/auth.service';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { RegisterFormComponent } from './components/register-form/register-form.component';

export type AuthTab = 'login' | 'register';

@Component({
  selector: 'app-auth',
  imports: [RouterLink, ButtonComponent, LoginFormComponent, RegisterFormComponent],
  template: `
    <main class="min-h-screen bg-[#f5f5f7] text-neutral-900 pb-16 sm:pb-24">
      <nav aria-label="Navegação Estrutural" class="bg-white border-b border-neutral-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-xs text-neutral-500 flex items-center gap-2">
          <a
            routerLink="/"
            class="hover:text-neutral-900 transition-colors focus-visible:outline-none focus-visible:underline"
          >
            Início
          </a>
          <span class="text-neutral-400" aria-hidden="true">/</span>
          <span class="text-neutral-900 font-semibold" aria-current="page">Minha Conta</span>
        </div>
      </nav>

      <section class="max-w-md mx-auto px-4 pt-10 sm:pt-14" aria-label="Autenticação">
        <div class="text-center mb-6 sm:mb-8">
          <div
            class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#101010] text-[#0573cc] font-black text-xl mb-3 shadow-xs"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="w-6 h-6"
              aria-hidden="true"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h1 class="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
            Minha conta SKYTEC
          </h1>
          <p class="text-xs sm:text-sm text-neutral-500 mt-1.5">
            {{
              authService.isAuthenticated()
                ? 'Sessão ativa e gerenciamento de perfil.'
                : 'Acesse sua conta ou cadastre sua confecção para solicitar orçamentos.'
            }}
          </p>
        </div>

        @if (authService.isAuthenticated()) {
          <div class="bg-white border border-neutral-200 rounded-2xl shadow-xs p-6 sm:p-8 space-y-6">
            <div class="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div class="space-y-1">
                <span class="text-xs text-neutral-500 uppercase tracking-wider font-semibold">
                  Usuário Autenticado
                </span>
                <h2 class="text-xl font-black text-neutral-900">
                  {{ authService.currentUser()?.name }}
                </h2>
              </div>
              <span
                class="px-2.5 py-1 text-xs font-bold uppercase rounded-md"
                [class.bg-purple-100]="authService.isAdmin()"
                [class.text-purple-800]="authService.isAdmin()"
                [class.bg-blue-100]="!authService.isAdmin()"
                [class.text-blue-800]="!authService.isAdmin()"
              >
                {{ authService.isAdmin() ? 'Administrador' : 'Cliente B2B' }}
              </span>
            </div>

            <div class="space-y-3 text-xs">
              <div class="p-3 bg-[#f5f5f7] rounded-lg border border-neutral-200/70 space-y-1">
                <span class="text-neutral-500 block">E-mail:</span>
                <span class="font-semibold text-neutral-900 block font-mono text-sm">
                  {{ authService.currentUser()?.email }}
                </span>
              </div>

              @if (authService.currentUser()?.cnpjCpf) {
                <div class="p-3 bg-[#f5f5f7] rounded-lg border border-neutral-200/70 space-y-1">
                  <span class="text-neutral-500 block">CNPJ / CPF:</span>
                  <span class="font-semibold text-neutral-900 block font-mono text-sm">
                    {{ authService.currentUser()?.cnpjCpf }}
                  </span>
                </div>
              }

              @if (authService.currentUser()?.phone) {
                <div class="p-3 bg-[#f5f5f7] rounded-lg border border-neutral-200/70 space-y-1">
                  <span class="text-neutral-500 block">Telefone / WhatsApp:</span>
                  <span class="font-semibold text-neutral-900 block font-mono text-sm">
                    {{ authService.currentUser()?.phone }}
                  </span>
                </div>
              }
            </div>

            <div class="pt-2 space-y-2.5">
              @if (authService.isAdmin()) {
                <a
                  routerLink="/admin"
                  class="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#101010] hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
                  <span>Painel Administrativo</span>
                </a>
              }

              <a
                routerLink="/catalogo"
                class="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#077fbd] hover:bg-[#066a9e] text-white text-xs font-bold uppercase tracking-wider transition-colors"
              >
                <span>Explorar Catálogo de Máquinas</span>
              </a>

              <app-button
                variant="outline"
                size="md"
                [fullWidth]="true"
                (clicked)="handleLogout()"
                ariaLabel="Encerrar sessão"
              >
                <span>Encerrar Sessão</span>
              </app-button>
            </div>
          </div>
        } @else {
          <div class="bg-white border border-neutral-200 rounded-2xl shadow-xs p-6 sm:p-8">
            <div
              role="tablist"
              aria-label="Opções de autenticação"
              class="grid grid-cols-2 p-1 bg-neutral-100 rounded-xl border border-neutral-200/80 mb-6"
            >
              <button
                type="button"
                role="tab"
                id="tab-login"
                [attr.aria-selected]="activeTab() === 'login'"
                [attr.tabindex]="activeTab() === 'login' ? 0 : -1"
                aria-controls="panel-login"
                (click)="setTab('login')"
                (keydown)="handleTabKeydown($event, 'login')"
                class="py-2.5 px-3 text-xs sm:text-sm font-bold rounded-lg transition-all text-center cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#077fbd]"
                [class.bg-white]="activeTab() === 'login'"
                [class.text-neutral-900]="activeTab() === 'login'"
                [class.shadow-xs]="activeTab() === 'login'"
                [class.text-neutral-600]="activeTab() !== 'login'"
                [class.hover:text-neutral-900]="activeTab() !== 'login'"
              >
                Entrar
              </button>

              <button
                type="button"
                role="tab"
                id="tab-register"
                [attr.aria-selected]="activeTab() === 'register'"
                [attr.tabindex]="activeTab() === 'register' ? 0 : -1"
                aria-controls="panel-register"
                (click)="setTab('register')"
                (keydown)="handleTabKeydown($event, 'register')"
                class="py-2.5 px-3 text-xs sm:text-sm font-bold rounded-lg transition-all text-center cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#077fbd]"
                [class.bg-white]="activeTab() === 'register'"
                [class.text-neutral-900]="activeTab() === 'register'"
                [class.shadow-xs]="activeTab() === 'register'"
                [class.text-neutral-600]="activeTab() !== 'register'"
                [class.hover:text-neutral-900]="activeTab() !== 'register'"
              >
                Cadastrar
              </button>
            </div>

            @if (activeTab() === 'login') {
              <div
                role="tabpanel"
                id="panel-login"
                aria-labelledby="tab-login"
                tabindex="0"
                class="focus:outline-none"
              >
                <app-login-form
                  [loading]="isLoading()"
                  [errorMessage]="authError()"
                  (loginSubmit)="handleLogin($event)"
                  (switchToRegister)="setTab('register')"
                />
              </div>
            } @else {
              <div
                role="tabpanel"
                id="panel-register"
                aria-labelledby="tab-register"
                tabindex="0"
                class="focus:outline-none"
              >
                <app-register-form
                  [loading]="isLoading()"
                  [errorMessage]="authError()"
                  (registerSubmit)="handleRegister($event)"
                  (switchToLogin)="setTab('login')"
                />
              </div>
            }
          </div>
        }
      </section>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthComponent {
  private readonly router = inject(Router);
  readonly authService = inject(AuthService);

  readonly tab = input<string | undefined>(undefined);
  readonly returnUrl = input<string | undefined>(undefined);

  readonly activeTab = signal<AuthTab>('login');
  readonly isLoading = signal<boolean>(false);
  readonly authError = signal<string | null>(null);

  constructor() {
    effect(() => {
      const tabParam = this.tab()?.toLowerCase();
      if (tabParam === 'register' || tabParam === 'cadastrar') {
        this.activeTab.set('register');
      } else if (tabParam === 'login' || tabParam === 'entrar') {
        this.activeTab.set('login');
      }
    });
  }

  setTab(tab: AuthTab): void {
    this.activeTab.set(tab);
  }

  handleTabKeydown(event: KeyboardEvent, currentTab: AuthTab): void {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      const nextTab: AuthTab = currentTab === 'login' ? 'register' : 'login';
      this.setTab(nextTab);
      this.focusTab(nextTab);
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      const prevTab: AuthTab = currentTab === 'register' ? 'login' : 'register';
      this.setTab(prevTab);
      this.focusTab(prevTab);
    } else if (event.key === 'Home') {
      event.preventDefault();
      this.setTab('login');
      this.focusTab('login');
    } else if (event.key === 'End') {
      event.preventDefault();
      this.setTab('register');
      this.focusTab('register');
    }
  }

  handleLogin(credentials: LoginCredentials): void {
    this.authError.set(null);
    this.isLoading.set(true);

    const success = this.authService.login(credentials);
    this.isLoading.set(false);

    if (!success) {
      this.authError.set('Credenciais inválidas. Verifique seu e-mail e senha.');
      return;
    }

    if (this.authService.isAdmin()) {
      this.router.navigate(['/admin']);
    } else if (this.returnUrl()) {
      this.router.navigateByUrl(this.returnUrl()!);
    } else {
      this.router.navigate(['/catalogo']);
    }
  }

  handleRegister(data: RegisterData): void {
    this.authError.set(null);
    this.isLoading.set(true);

    this.authService.register(data);
    this.isLoading.set(false);

    if (this.returnUrl()) {
      this.router.navigateByUrl(this.returnUrl()!);
    } else {
      this.router.navigate(['/catalogo']);
    }
  }

  handleLogout(): void {
    this.authService.logout();
    this.setTab('login');
  }

  private focusTab(tab: AuthTab): void {
    const tabElement = document.getElementById(`tab-${tab}`);
    tabElement?.focus();
  }
}

