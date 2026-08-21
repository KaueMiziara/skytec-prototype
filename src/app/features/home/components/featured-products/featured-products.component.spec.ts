import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { FeaturedProductsComponent } from './featured-products.component';
import { ProductService } from '../../../../core/services/product.service';
import { CartService } from '../../../../core/services/cart.service';

describe('FeaturedProductsComponent', () => {
  let component: FeaturedProductsComponent;
  let fixture: ComponentFixture<FeaturedProductsComponent>;
  let cartService: CartService;
  let productService: ProductService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturedProductsComponent],
      providers: [provideRouter([]), ProductService, CartService]
    }).compileComponents();

    productService = TestBed.inject(ProductService);
    cartService = TestBed.inject(CartService);
    fixture = TestBed.createComponent(FeaturedProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render product cards for featured products', () => {
    const cards = fixture.nativeElement.querySelectorAll('app-product-card');
    expect(cards.length).toBe(productService.featuredProducts().length);
    expect(cards.length).toBeGreaterThan(0);
  });

  it('should add item to cart and open drawer when add to cart is triggered', () => {
    const addSpy = vi.spyOn(cartService, 'addItem');
    const drawerSpy = vi.spyOn(cartService, 'openDrawer');
    const firstProduct = productService.featuredProducts()[0];

    const firstCardButton = fixture.nativeElement.querySelector('app-product-card button') as HTMLButtonElement;
    firstCardButton.click();

    expect(addSpy).toHaveBeenCalledWith(firstProduct, 1);
    expect(drawerSpy).toHaveBeenCalled();
  });

  it('should render section heading and link to catalog', () => {
    const heading = fixture.nativeElement.querySelector('h2');
    const catalogLink = fixture.nativeElement.querySelector('a[routerLink="/catalogo"]');

    expect(heading.textContent).toContain('Máquinas Industriais em Destaque');
    expect(catalogLink).toBeTruthy();
  });
});
