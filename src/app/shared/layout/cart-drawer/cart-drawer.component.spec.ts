import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { CartDrawerComponent } from './cart-drawer.component';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';
import { Product } from '../../../core/models/product.model';

describe('CartDrawerComponent', () => {
  let component: CartDrawerComponent;
  let fixture: ComponentFixture<CartDrawerComponent>;
  let cartService: CartService;
  let authService: AuthService;
  let router: Router;

  const mockProduct1: Product = {
    id: 'prod-1',
    sku: 'SKU-001',
    name: 'Máquina Reta Industrial Direct Drive',
    brand: 'SKYMAK',
    category: 'Reta',
    price: 3200,
    images: ['img1.jpg'],
    shortDescription: 'Descrição rápida',
    differentials: ['Diferencial 1'],
    specifications: { Velocidade: '5000rpm' }
  };

  const mockProduct2: Product = {
    id: 'prod-2',
    sku: 'SKU-002',
    name: 'Overlock 4 Fios Industrial',
    brand: 'Jack',
    category: 'Overlock',
    price: 4500,
    images: ['img2.jpg'],
    shortDescription: 'Descrição rápida 2',
    differentials: ['Diferencial 2'],
    specifications: { Velocidade: '6000rpm' }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartDrawerComponent],
      providers: [provideRouter([]), CartService, AuthService]
    }).compileComponents();

    cartService = TestBed.inject(CartService);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(CartDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not display anything when drawer is closed', () => {
    const aside = fixture.nativeElement.querySelector('aside');
    expect(aside).toBeNull();
  });

  it('should display empty state when drawer is open and cart is empty', () => {
    cartService.openDrawer();
    fixture.detectChanges();

    const aside = fixture.nativeElement.querySelector('aside');
    expect(aside).not.toBeNull();

    const emptyTitle = fixture.nativeElement.querySelector('h3');
    expect(emptyTitle?.textContent).toContain('Sua cotação está vazia');
  });

  it('should navigate to catalog and close drawer when clicking empty state button', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    cartService.openDrawer();
    fixture.detectChanges();

    const catalogBtn = fixture.nativeElement.querySelector('button[type="button"].inline-flex') as HTMLButtonElement;
    catalogBtn.click();

    expect(cartService.isDrawerOpen()).toBe(false);
    expect(navigateSpy).toHaveBeenCalledWith(['/catalogo']);
  });

  it('should render cart items and calculated subtotal', () => {
    cartService.addItem(mockProduct1, 2);
    cartService.addItem(mockProduct2, 1);
    cartService.openDrawer();
    fixture.detectChanges();

    const itemTitles = fixture.nativeElement.querySelectorAll('h4');
    expect(itemTitles.length).toBe(2);
    expect(itemTitles[0].textContent).toContain('Máquina Reta Industrial Direct Drive');
    expect(itemTitles[1].textContent).toContain('Overlock 4 Fios Industrial');

    const totalText = fixture.nativeElement.textContent;
    expect(totalText).toContain('10.900,00');
  });

  it('should increment item quantity', () => {
    const updateSpy = vi.spyOn(cartService, 'updateQuantity');
    cartService.addItem(mockProduct1, 1);
    cartService.openDrawer();
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    const plusBtn = Array.from(buttons).find((btn) =>
      (btn as HTMLElement).getAttribute('aria-label')?.includes('Aumentar quantidade')
    ) as HTMLButtonElement;

    plusBtn.click();
    expect(updateSpy).toHaveBeenCalledWith('prod-1', 2);
  });

  it('should decrement item quantity', () => {
    const updateSpy = vi.spyOn(cartService, 'updateQuantity');
    cartService.addItem(mockProduct1, 2);
    cartService.openDrawer();
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    const minusBtn = Array.from(buttons).find((btn) =>
      (btn as HTMLElement).getAttribute('aria-label')?.includes('Diminuir quantidade')
    ) as HTMLButtonElement;

    minusBtn.click();
    expect(updateSpy).toHaveBeenCalledWith('prod-1', 1);
  });

  it('should remove item when delete button is clicked', () => {
    const removeSpy = vi.spyOn(cartService, 'removeItem');
    cartService.addItem(mockProduct1, 1);
    cartService.openDrawer();
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    const removeBtn = Array.from(buttons).find((btn) =>
      (btn as HTMLElement).getAttribute('aria-label')?.includes('Remover')
    ) as HTMLButtonElement;

    removeBtn.click();
    expect(removeSpy).toHaveBeenCalledWith('prod-1');
  });

  it('should clear cart when clear button is clicked', () => {
    const clearSpy = vi.spyOn(cartService, 'clearCart');
    cartService.addItem(mockProduct1, 1);
    cartService.openDrawer();
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    const clearBtn = Array.from(buttons).find((btn) =>
      (btn as HTMLElement).textContent?.includes('Limpar tudo')
    ) as HTMLButtonElement;

    clearBtn.click();
    expect(clearSpy).toHaveBeenCalled();
  });

  it('should close drawer when close button or backdrop is clicked', () => {
    const closeSpy = vi.spyOn(cartService, 'closeDrawer');
    cartService.openDrawer();
    fixture.detectChanges();

    const closeBtn = fixture.nativeElement.querySelector('button[aria-label="Fechar carrinho de cotação"]') as HTMLButtonElement;
    closeBtn.click();
    expect(closeSpy).toHaveBeenCalledTimes(1);

    const backdrop = fixture.nativeElement.querySelector('div.fixed.inset-0') as HTMLElement;
    backdrop.click();
    expect(closeSpy).toHaveBeenCalledTimes(2);
  });

  it('should close on Escape key press if open', () => {
    const closeSpy = vi.spyOn(cartService, 'closeDrawer');
    cartService.openDrawer();
    fixture.detectChanges();

    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);

    expect(closeSpy).toHaveBeenCalled();
  });

  it('should render WhatsApp quotation CTA with pre-filled message and user data', () => {
    authService.login({ email: 'cliente@skytec.com.br', password: '123' });
    cartService.addItem(mockProduct1, 2);
    cartService.openDrawer();
    fixture.detectChanges();

    const ctaLink = fixture.nativeElement.querySelector('a[aria-label="Finalizar orçamento via WhatsApp"]') as HTMLAnchorElement;
    expect(ctaLink).toBeTruthy();
    expect(ctaLink.textContent).toContain('Finalizar Orçamento via WhatsApp');
    expect(ctaLink.href).toContain('wa.me');

    const decodedHref = decodeURIComponent(ctaLink.href);
    expect(decodedHref).toContain('SKU-001');
    expect(decodedHref).toContain('SOLICITAÇÃO DE COTAÇÃO B2B');
    expect(decodedHref).toContain('Confecção Modelo');
    expect(decodedHref).toContain('12.345.678/0001-90');
  });
});
