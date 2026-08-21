import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterFormComponent } from './register-form.component';

describe('RegisterFormComponent', () => {
  let component: RegisterFormComponent;
  let fixture: ComponentFixture<RegisterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterFormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with an invalid empty form', () => {
    expect(component.registerForm.valid).toBe(false);
    expect(component.registerForm.controls.name.value).toBe('');
    expect(component.registerForm.controls.cnpjCpf.value).toBe('');
    expect(component.registerForm.controls.phone.value).toBe('');
    expect(component.registerForm.controls.email.value).toBe('');
    expect(component.registerForm.controls.password.value).toBe('');
  });

  it('should display errors for all fields when submitted empty', () => {
    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(component.getNameError()).toBe('O nome ou razão social é obrigatório.');
    expect(component.getCnpjCpfError()).toBe('O CNPJ ou CPF é obrigatório.');
    expect(component.getPhoneError()).toBe('O telefone / WhatsApp é obrigatório.');
    expect(component.getEmailError()).toBe('O e-mail é obrigatório.');
    expect(component.getPasswordError()).toBe('A senha é obrigatória.');
  });

  it('should validate minimum length for name and cnpjCpf', () => {
    component.registerForm.controls.name.setValue('Ab');
    component.registerForm.controls.name.markAsTouched();
    expect(component.getNameError()).toBe('O nome deve conter no mínimo 3 caracteres.');

    component.registerForm.controls.cnpjCpf.setValue('123456');
    component.registerForm.controls.cnpjCpf.markAsTouched();
    expect(component.getCnpjCpfError()).toBe('Informe um CNPJ ou CPF válido com pelo menos 11 dígitos.');
  });

  it('should validate phone minimum length and email format', () => {
    component.registerForm.controls.phone.setValue('11999');
    component.registerForm.controls.phone.markAsTouched();
    expect(component.getPhoneError()).toBe('Informe um número válido com DDD (mínimo 10 dígitos).');

    component.registerForm.controls.email.setValue('invalid-email');
    component.registerForm.controls.email.markAsTouched();
    expect(component.getEmailError()).toBe('Informe um e-mail válido.');
  });

  it('should toggle password visibility on click', () => {
    const toggleButton = fixture.nativeElement.querySelector('button[aria-label="Exibir senha"]') as HTMLButtonElement;
    expect(toggleButton).toBeTruthy();
    expect(component.showPassword()).toBe(false);

    toggleButton.click();
    fixture.detectChanges();

    expect(component.showPassword()).toBe(true);
    const hideButton = fixture.nativeElement.querySelector('button[aria-label="Ocultar senha"]');
    expect(hideButton).toBeTruthy();
  });

  it('should emit registerSubmit when form is valid', () => {
    let emittedData: any = null;
    component.registerSubmit.subscribe((data) => {
      emittedData = data;
    });

    component.registerForm.setValue({
      name: 'Confecções Sky Ltda',
      cnpjCpf: '12.345.678/0001-90',
      phone: '11987654321',
      email: 'contato@confeccoessky.com.br',
      password: 'strongPassword123'
    });
    fixture.detectChanges();

    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit'));

    expect(emittedData).toEqual({
      name: 'Confecções Sky Ltda',
      cnpjCpf: '12.345.678/0001-90',
      phone: '11987654321',
      email: 'contato@confeccoessky.com.br',
      password: 'strongPassword123'
    });
  });

  it('should display error message alert when provided', () => {
    fixture.componentRef.setInput('errorMessage', 'Este CNPJ já está cadastrado.');
    fixture.detectChanges();

    const alert = fixture.nativeElement.querySelector('[role="alert"]');
    expect(alert).toBeTruthy();
    expect(alert.textContent).toContain('Este CNPJ já está cadastrado.');
  });

  it('should show loading state and disable submit button when loading', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('Cadastrando...');
  });

  it('should emit switchToLogin when login link is clicked', () => {
    let clicked = false;
    component.switchToLogin.subscribe(() => {
      clicked = true;
    });

    const buttons = fixture.nativeElement.querySelectorAll('button');
    const switchButton = Array.from(buttons).find((b: any) =>
      b.textContent.includes('Acesse sua conta')
    ) as HTMLButtonElement;

    expect(switchButton).toBeTruthy();
    switchButton.click();
    expect(clicked).toBe(true);
  });
});
