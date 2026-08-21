import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  signal
} from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { LoginCredentials } from '../../../../core/models/user.model';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { InputComponent } from '../../../../shared/ui/input/input.component';

@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule, InputComponent, ButtonComponent],
  template: `
    <form (submit)="handleSubmit($event)" novalidate class="space-y-5">
      <div class="space-y-4">
        <div>
          <app-input
            id="login-email"
            name="email"
            type="email"
            label="E-mail Corporativo"
            placeholder="exemplo@empresa.com.br"
            autocomplete="email"
            [required]="true"
            [formControl]="loginForm.controls.email"
            [error]="getEmailError()"
          />
        </div>

        <div class="relative">
          <app-input
            id="login-password"
            name="password"
            [type]="showPassword() ? 'text' : 'password'"
            label="Senha de Acesso"
            placeholder="Digite sua senha"
            autocomplete="current-password"
            customClass="pr-10"
            [required]="true"
            [formControl]="loginForm.controls.password"
            [error]="getPasswordError()"
          />
          <button
            type="button"
            (click)="toggleShowPassword()"
            class="absolute right-2.5 top-[27px] p-1.5 text-neutral-400 hover:text-neutral-700 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#077fbd] rounded"
            [attr.aria-label]="showPassword() ? 'Ocultar senha' : 'Exibir senha'"
          >
            @if (showPassword()) {
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="w-4 h-4"
                aria-hidden="true"
              >
                <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                <line x1="2" x2="22" y1="2" y2="22" />
              </svg>
            } @else {
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="w-4 h-4"
                aria-hidden="true"
              >
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            }
          </button>
        </div>
      </div>

      @if (errorMessage()) {
        <div
          role="alert"
          class="p-3 bg-red-50 border border-red-200 rounded-lg text-xs font-medium text-red-700 flex items-start gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="w-4 h-4 text-red-600 shrink-0 mt-0.5"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{{ errorMessage() }}</span>
        </div>
      }

      <div class="pt-2">
        <app-button
          type="submit"
          variant="primary"
          size="lg"
          [fullWidth]="true"
          [disabled]="loading()"
          ariaLabel="Entrar na conta"
        >
          @if (loading()) {
            <span class="inline-flex items-center gap-2">
              <svg
                class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Entrando...
            </span>
          } @else {
            <span>Entrar na Conta</span>
          }
        </app-button>
      </div>

      <div class="p-3.5 bg-[#f5f5f7] border border-neutral-200/80 rounded-xl space-y-1 text-xs text-neutral-600">
        <div class="font-bold text-neutral-900 flex items-center justify-between">
          <span>Acesso de Demonstração B2B:</span>
          <span class="font-mono text-[10px] bg-neutral-200 text-neutral-800 px-1.5 py-0.5 rounded font-semibold">MOCK</span>
        </div>
        <p class="font-mono text-[11px] text-neutral-700">
          Cliente: <span class="font-semibold text-neutral-900">cliente&#64;skytec.com.br</span> / <span class="text-neutral-900">123456</span>
        </p>
        <p class="font-mono text-[11px] text-neutral-700">
          Admin: <span class="font-semibold text-neutral-900">admin&#64;skytec.com.br</span> / <span class="text-neutral-900">123456</span>
        </p>
      </div>

      <div class="pt-2 text-center text-xs text-neutral-500">
        <span>Não possui uma conta? </span>
        <button
          type="button"
          (click)="switchToRegister.emit()"
          class="text-[#0573cc] font-bold hover:underline cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#077fbd] rounded"
        >
          Cadastre sua confecção
        </button>
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginFormComponent {
  private readonly fb = inject(NonNullableFormBuilder);

  readonly loading = input<boolean>(false);
  readonly errorMessage = input<string | null>(null);

  readonly loginSubmit = output<LoginCredentials>();
  readonly switchToRegister = output<void>();

  readonly showPassword = signal<boolean>(false);

  readonly loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  toggleShowPassword(): void {
    this.showPassword.update((v) => !v);
  }

  getEmailError(): string | null {
    const control = this.loginForm.controls.email;
    if (!control.touched && !control.dirty) {
      return null;
    }
    if (control.hasError('required')) {
      return 'O e-mail é obrigatório.';
    }
    if (control.hasError('email')) {
      return 'Informe um e-mail válido.';
    }
    return null;
  }

  getPasswordError(): string | null {
    const control = this.loginForm.controls.password;
    if (!control.touched && !control.dirty) {
      return null;
    }
    if (control.hasError('required')) {
      return 'A senha é obrigatória.';
    }
    if (control.hasError('minlength')) {
      return 'A senha deve ter no mínimo 6 caracteres.';
    }
    return null;
  }

  handleSubmit(event: Event): void {
    event.preventDefault();

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loginSubmit.emit(this.loginForm.getRawValue());
  }
}
