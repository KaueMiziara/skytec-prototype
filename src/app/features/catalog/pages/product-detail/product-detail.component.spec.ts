import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ProductDetailComponent } from './product-detail.component';
import { ProductService } from '../../../../core/services/product.service';
import { CartService } from '../../../../core/services/cart.service';

describe('ProductDetailComponent', () => {
  let component: ProductDetailComponent;
  let fixture: ComponentFixture<ProductDetailComponent>;
  let productService: ProductService;
  let cartService: CartService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    productService = TestBed.inject(ProductService);
    cartService = TestBed.inject(CartService);

    fixture = TestBed.createComponent(ProductDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render product details when valid product ID is provided', () => {
    const firstProduct = productService.products()[0];
    fixture.componentRef.setInput('id', firstProduct.id);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain(firstProduct.name);
    expect(text).toContain(firstProduct.sku);
    expect(text).toContain(firstProduct.brand);
  });

  it('should render product details when valid SKU is provided', () => {
    const firstProduct = productService.products()[0];
    fixture.componentRef.setInput('id', firstProduct.sku);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain(firstProduct.name);
  });

  it('should add product to cart and open drawer on buy box action', () => {
    const firstProduct = productService.products()[0];
    fixture.componentRef.setInput('id', firstProduct.id);
    fixture.detectChanges();

    const cartSpy = vi.spyOn(cartService, 'addItem');
    const drawerSpy = vi.spyOn(cartService, 'openDrawer');

    const addBtn = fixture.nativeElement.querySelector('button[aria-label*="Adicionar"]') as HTMLButtonElement;
    addBtn.click();

    expect(cartSpy).toHaveBeenCalledWith(firstProduct, 1);
    expect(drawerSpy).toHaveBeenCalled();
  });

  it('should show not found state when product ID does not exist', () => {
    fixture.componentRef.setInput('id', 'INVALID-NON-EXISTENT-ID');
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Máquina Não Encontrada');
    expect(text).toContain('INVALID-NON-EXISTENT-ID');
  });
});
