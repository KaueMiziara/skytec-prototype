import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginFormComponent } from './login-form.component';

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginFormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with an invalid empty form', () => {
    expect(component.loginForm.valid).toBe(false);
    expect(component.loginForm.controls.email.value).toBe('');
    expect(component.loginForm.controls.password.value).toBe('');
  });

  it('should show validation errors when submitted empty', () => {
    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(component.loginForm.controls.email.touched).toBe(true);
    expect(component.loginForm.controls.password.touched).toBe(true);
    expect(component.getEmailError()).toBe('O e-mail é obrigatório.');
    expect(component.getPasswordError()).toBe('A senha é obrigatória.');

    const errorParagraphs = fixture.nativeElement.querySelectorAll('p[id$="-error"]');
    expect(errorParagraphs.length).toBeGreaterThanOrEqual(2);
  });

  it('should validate invalid email format', () => {
    component.loginForm.controls.email.setValue('invalid-email');
    component.loginForm.controls.email.markAsTouched();
    fixture.detectChanges();

    expect(component.getEmailError()).toBe('Informe um e-mail válido.');
  });

  it('should validate short password length', () => {
    component.loginForm.controls.password.setValue('123');
    component.loginForm.controls.password.markAsTouched();
    fixture.detectChanges();

    expect(component.getPasswordError()).toBe('A senha deve ter no mínimo 6 caracteres.');
  });

  it('should toggle password visibility when clicking toggle button', () => {
    const toggleButton = fixture.nativeElement.querySelector('button[aria-label="Exibir senha"]') as HTMLButtonElement;
    expect(toggleButton).toBeTruthy();
    expect(component.showPassword()).toBe(false);

    toggleButton.click();
    fixture.detectChanges();

    expect(component.showPassword()).toBe(true);
    const hideButton = fixture.nativeElement.querySelector('button[aria-label="Ocultar senha"]');
    expect(hideButton).toBeTruthy();
  });

  it('should emit loginSubmit when form is valid', () => {
    let emittedCredentials: { email: string; password: string } | null = null;
    component.loginSubmit.subscribe((credentials) => {
      emittedCredentials = credentials;
    });

    component.loginForm.setValue({
      email: 'cliente@skytec.com.br',
      password: 'secretPassword123'
    });
    fixture.detectChanges();

    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit'));

    expect(emittedCredentials).toEqual({
      email: 'cliente@skytec.com.br',
      password: 'secretPassword123'
    });
  });

  it('should display error message alert when provided', () => {
    fixture.componentRef.setInput('errorMessage', 'Credenciais inválidas. Verifique seu e-mail e senha.');
    fixture.detectChanges();

    const alert = fixture.nativeElement.querySelector('[role="alert"]');
    expect(alert).toBeTruthy();
    expect(alert.textContent).toContain('Credenciais inválidas');
  });

  it('should show loading state and disable submit button when loading', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('Entrando...');
  });

  it('should emit switchToRegister when register link is clicked', () => {
    let clicked = false;
    component.switchToRegister.subscribe(() => {
      clicked = true;
    });

    const buttons = fixture.nativeElement.querySelectorAll('button');
    const switchButton = Array.from(buttons).find((b: any) =>
      b.textContent.includes('Cadastre sua confecção')
    ) as HTMLButtonElement;

    expect(switchButton).toBeTruthy();
    switchButton.click();
    expect(clicked).toBe(true);
  });
});
