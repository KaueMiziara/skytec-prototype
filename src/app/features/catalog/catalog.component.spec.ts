import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CatalogComponent } from './catalog.component';
import { CatalogStateService } from './services/catalog-state.service';
import { CartService } from '../../core/services/cart.service';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product.model';

describe('CatalogComponent', () => {
  let component: CatalogComponent;
  let fixture: ComponentFixture<CatalogComponent>;
  let catalogState: CatalogStateService;
  let cartService: CartService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogComponent],
      providers: [
        provideRouter([]),
        CatalogStateService,
        CartService,
        ProductService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CatalogComponent);
    component = fixture.componentInstance;
    catalogState = TestBed.inject(CatalogStateService);
    cartService = TestBed.inject(CartService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render catalog title and product cards', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Catálogo de Máquinas Industriais');

    const cards = fixture.nativeElement.querySelectorAll('app-product-card');
    expect(cards.length).toBeGreaterThan(0);
  });

  it('should render empty state when no products match filters and handle reset', () => {
    catalogState.setQuery('xyznonexistentquery999');
    fixture.detectChanges();

    const emptyText = fixture.nativeElement.textContent;
    expect(emptyText).toContain('Nenhuma máquina encontrada');

    const buttons = fixture.nativeElement.querySelectorAll('button');
    const resetBtn = Array.from(buttons).find(
      (btn: any) => btn.textContent?.includes('Limpar Todos os Filtros')
    ) as HTMLButtonElement;
    expect(resetBtn).toBeTruthy();
    resetBtn.click();
    fixture.detectChanges();

    expect(catalogState.filters().query).toBe('');
    expect(fixture.nativeElement.querySelectorAll('app-product-card').length).toBeGreaterThan(0);
  });

  it('should handle add to cart from product card', () => {
    const addItemSpy = vi.spyOn(cartService, 'addItem');
    const openDrawerSpy = vi.spyOn(cartService, 'openDrawer');

    const mockProduct: Product = catalogState.products()[0];
    (component as any).handleAddToCart(mockProduct);

    expect(addItemSpy).toHaveBeenCalledWith(mockProduct, 1);
    expect(openDrawerSpy).toHaveBeenCalled();
  });

  it('should open mobile drawer when mobile filter button is clicked', () => {
    const openSpy = vi.spyOn(catalogState, 'openMobileDrawer');
    const mobileBtn = fixture.nativeElement.querySelector('button[aria-label="Abrir filtros"]') as HTMLButtonElement;

    expect(mobileBtn).toBeTruthy();
    mobileBtn.click();

    expect(openSpy).toHaveBeenCalled();
  });
});
