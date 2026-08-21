import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { HeaderComponent } from './header.component';
import { CartService } from '../../../core/services/cart.service';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let router: Router;
  let cartService: CartService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    router = TestBed.inject(Router);
    cartService = TestBed.inject(CartService);
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update search query on input', () => {
    const input = fixture.nativeElement.querySelector('input[type="search"]') as HTMLInputElement;
    input.value = 'Reta Eletrônica';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.searchQuery()).toBe('Reta Eletrônica');
  });

  it('should navigate to catalog with query parameter on submit', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    component.searchQuery.set('SKYMAK');
    fixture.detectChanges();

    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit'));

    expect(navigateSpy).toHaveBeenCalledWith(['/catalogo'], {
      queryParams: { q: 'SKYMAK' }
    });
  });

  it('should toggle cart drawer when cart button is clicked', () => {
    const toggleSpy = vi.spyOn(cartService, 'toggleDrawer');
    const buttons = fixture.nativeElement.querySelectorAll('button');
    const cartButton = Array.from(buttons).find((btn) =>
      (btn as HTMLElement).getAttribute('aria-label')?.includes('carrinho')
    ) as HTMLButtonElement;

    cartButton.click();
    expect(toggleSpy).toHaveBeenCalled();
  });
});
