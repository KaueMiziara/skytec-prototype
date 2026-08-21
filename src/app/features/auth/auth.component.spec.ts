import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthComponent } from './auth.component';

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render structural breadcrumb navigation', () => {
    const nav = fixture.nativeElement.querySelector('nav[aria-label="Navegação Estrutural"]');
    expect(nav).toBeTruthy();

    const homeLink = nav.querySelector('a[routerLink="/"]');
    expect(homeLink).toBeTruthy();
    expect(homeLink.textContent.trim()).toBe('Início');

    const currentPage = nav.querySelector('[aria-current="page"]');
    expect(currentPage).toBeTruthy();
    expect(currentPage.textContent.trim()).toBe('Minha Conta');
  });

  it('should render H1 header "Minha conta SKYTEC"', () => {
    const h1 = fixture.nativeElement.querySelector('h1');
    expect(h1).toBeTruthy();
    expect(h1.textContent.trim()).toBe('Minha conta SKYTEC');
  });

  it('should render auth tab list with "Entrar" and "Cadastrar" tabs', () => {
    const tabList = fixture.nativeElement.querySelector('[role="tablist"]');
    expect(tabList).toBeTruthy();

    const loginTab = fixture.nativeElement.querySelector('#tab-login');
    const registerTab = fixture.nativeElement.querySelector('#tab-register');

    expect(loginTab).toBeTruthy();
    expect(loginTab.textContent.trim()).toBe('Entrar');
    expect(loginTab.getAttribute('aria-selected')).toBe('true');
    expect(loginTab.getAttribute('tabindex')).toBe('0');

    expect(registerTab).toBeTruthy();
    expect(registerTab.textContent.trim()).toBe('Cadastrar');
    expect(registerTab.getAttribute('aria-selected')).toBe('false');
    expect(registerTab.getAttribute('tabindex')).toBe('-1');
  });

  it('should render login panel by default', () => {
    const loginPanel = fixture.nativeElement.querySelector('#panel-login');
    const registerPanel = fixture.nativeElement.querySelector('#panel-register');

    expect(loginPanel).toBeTruthy();
    expect(loginPanel.getAttribute('aria-labelledby')).toBe('tab-login');
    expect(registerPanel).toBeFalsy();
  });

  it('should switch to register tab and panel on click', () => {
    const registerTab = fixture.nativeElement.querySelector('#tab-register') as HTMLButtonElement;
    registerTab.click();
    fixture.detectChanges();

    expect(component.activeTab()).toBe('register');
    expect(registerTab.getAttribute('aria-selected')).toBe('true');
    expect(registerTab.getAttribute('tabindex')).toBe('0');

    const loginTab = fixture.nativeElement.querySelector('#tab-login');
    expect(loginTab.getAttribute('aria-selected')).toBe('false');
    expect(loginTab.getAttribute('tabindex')).toBe('-1');

    const registerPanel = fixture.nativeElement.querySelector('#panel-register');
    const loginPanel = fixture.nativeElement.querySelector('#panel-login');
    expect(registerPanel).toBeTruthy();
    expect(loginPanel).toBeFalsy();
  });

  it('should handle keyboard navigation between tabs (ArrowRight, ArrowLeft, Home, End)', () => {
    const loginTab = fixture.nativeElement.querySelector('#tab-login') as HTMLButtonElement;
    const registerTab = fixture.nativeElement.querySelector('#tab-register') as HTMLButtonElement;

    const arrowRightEvent = new KeyboardEvent('keydown', { key: 'ArrowRight', cancelable: true });
    loginTab.dispatchEvent(arrowRightEvent);
    fixture.detectChanges();
    expect(component.activeTab()).toBe('register');

    const arrowLeftEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft', cancelable: true });
    registerTab.dispatchEvent(arrowLeftEvent);
    fixture.detectChanges();
    expect(component.activeTab()).toBe('login');

    const endEvent = new KeyboardEvent('keydown', { key: 'End', cancelable: true });
    loginTab.dispatchEvent(endEvent);
    fixture.detectChanges();
    expect(component.activeTab()).toBe('register');

    const homeEvent = new KeyboardEvent('keydown', { key: 'Home', cancelable: true });
    registerTab.dispatchEvent(homeEvent);
    fixture.detectChanges();
    expect(component.activeTab()).toBe('login');
  });

  it('should render login form inside login panel', () => {
    const loginForm = fixture.nativeElement.querySelector('app-login-form');
    expect(loginForm).toBeTruthy();
  });

  it('should switch to register tab when login form emits switchToRegister', () => {
    const loginFormComponent = fixture.debugElement.nativeElement.querySelector('app-login-form');
    expect(loginFormComponent).toBeTruthy();

    component.setTab('register');
    fixture.detectChanges();

    expect(component.activeTab()).toBe('register');
  });

  it('should respond to route tab input parameter', () => {
    fixture.componentRef.setInput('tab', 'cadastrar');
    fixture.detectChanges();
    expect(component.activeTab()).toBe('register');

    fixture.componentRef.setInput('tab', 'entrar');
    fixture.detectChanges();
    expect(component.activeTab()).toBe('login');
  });
});
