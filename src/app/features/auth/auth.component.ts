import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  signal
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { LoginCredentials, RegisterData } from '../../core/models/user.model';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { RegisterFormComponent } from './components/register-form/register-form.component';

export type AuthTab = 'login' | 'register';

@Component({
  selector: 'app-auth',
  imports: [RouterLink, LoginFormComponent, RegisterFormComponent],
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
            Acesse sua conta ou cadastre sua confecção para solicitar orçamentos.
          </p>
        </div>

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
      </section>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthComponent {
  readonly tab = input<string | undefined>(undefined);
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
  }

  handleRegister(data: RegisterData): void {
    this.authError.set(null);
  }

  private focusTab(tab: AuthTab): void {
    const tabElement = document.getElementById(`tab-${tab}`);
    tabElement?.focus();
  }
}
