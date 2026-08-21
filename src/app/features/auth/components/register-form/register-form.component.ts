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
import { RegisterData } from '../../../../core/models/user.model';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { InputComponent } from '../../../../shared/ui/input/input.component';

@Component({
  selector: 'app-register-form',
  imports: [ReactiveFormsModule, InputComponent, ButtonComponent],
  template: `
    <form (submit)="handleSubmit($event)" novalidate class="space-y-4">
      <div>
        <app-input
          id="register-name"
          name="name"
          type="text"
          label="Nome Completo ou Razão Social"
          placeholder="Ex: Confecções Silva Ltda"
          autocomplete="name"
          [required]="true"
          [formControl]="registerForm.controls.name"
          [error]="getNameError()"
        />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <app-input
            id="register-cnpj-cpf"
            name="cnpjCpf"
            type="text"
            label="CNPJ ou CPF"
            placeholder="00.000.000/0001-00"
            autocomplete="off"
            [required]="true"
            [formControl]="registerForm.controls.cnpjCpf"
            [error]="getCnpjCpfError()"
          />
        </div>

        <div>
          <app-input
            id="register-phone"
            name="phone"
            type="tel"
            label="WhatsApp / Telefone"
            placeholder="(11) 99999-9999"
            autocomplete="tel"
            [required]="true"
            [formControl]="registerForm.controls.phone"
            [error]="getPhoneError()"
          />
        </div>
      </div>

      <div>
        <app-input
          id="register-email"
          name="email"
          type="email"
          label="E-mail Corporativo"
          placeholder="contato@suaempresa.com.br"
          autocomplete="email"
          [required]="true"
          [formControl]="registerForm.controls.email"
          [error]="getEmailError()"
        />
      </div>

      <div class="relative">
        <app-input
          id="register-password"
          name="password"
          [type]="showPassword() ? 'text' : 'password'"
          label="Senha de Acesso"
          placeholder="Crie uma senha (mín. 6 dígitos)"
          autocomplete="new-password"
          customClass="pr-10"
          [required]="true"
          [formControl]="registerForm.controls.password"
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
          ariaLabel="Cadastrar confecção"
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
              Cadastrando...
            </span>
          } @else {
            <span>Criar Conta de Confecção</span>
          }
        </app-button>
      </div>

      <div class="pt-2 text-center text-xs text-neutral-500">
        <span>Já possui uma conta ativa? </span>
        <button
          type="button"
          (click)="switchToLogin.emit()"
          class="text-[#0573cc] font-bold hover:underline cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#077fbd] rounded"
        >
          Acesse sua conta
        </button>
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterFormComponent {
  private readonly fb = inject(NonNullableFormBuilder);

  readonly loading = input<boolean>(false);
  readonly errorMessage = input<string | null>(null);

  readonly registerSubmit = output<RegisterData>();
  readonly switchToLogin = output<void>();

  readonly showPassword = signal<boolean>(false);

  readonly registerForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    cnpjCpf: ['', [Validators.required, Validators.minLength(11)]],
    phone: ['', [Validators.required, Validators.minLength(10)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  toggleShowPassword(): void {
    this.showPassword.update((v) => !v);
  }

  getNameError(): string | null {
    const control = this.registerForm.controls.name;
    if (!control.touched && !control.dirty) {
      return null;
    }
    if (control.hasError('required')) {
      return 'O nome ou razão social é obrigatório.';
    }
    if (control.hasError('minlength')) {
      return 'O nome deve conter no mínimo 3 caracteres.';
    }
    return null;
  }

  getCnpjCpfError(): string | null {
    const control = this.registerForm.controls.cnpjCpf;
    if (!control.touched && !control.dirty) {
      return null;
    }
    if (control.hasError('required')) {
      return 'O CNPJ ou CPF é obrigatório.';
    }
    if (control.hasError('minlength')) {
      return 'Informe um CNPJ ou CPF válido com pelo menos 11 dígitos.';
    }
    return null;
  }

  getPhoneError(): string | null {
    const control = this.registerForm.controls.phone;
    if (!control.touched && !control.dirty) {
      return null;
    }
    if (control.hasError('required')) {
      return 'O telefone / WhatsApp é obrigatório.';
    }
    if (control.hasError('minlength')) {
      return 'Informe um número válido com DDD (mínimo 10 dígitos).';
    }
    return null;
  }

  getEmailError(): string | null {
    const control = this.registerForm.controls.email;
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
    const control = this.registerForm.controls.password;
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

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.registerSubmit.emit(this.registerForm.getRawValue());
  }
}
