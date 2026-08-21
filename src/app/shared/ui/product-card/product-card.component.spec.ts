import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ProductCardComponent } from './product-card.component';
import { Product } from '../../../core/models/product.model';

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;

  const mockProduct: Product = {
    id: 'PROD-TEST-1',
    sku: 'TEST-100',
    name: 'Máquina Reta Teste Direct Drive',
    brand: 'SKYMAK',
    category: 'Reta',
    price: 2500,
    images: ['/assets/mock/test.jpg'],
    shortDescription: 'Descrição teste de máquina industrial.',
    differentials: ['Direct Drive', 'Corte automático'],
    specifications: { 'Tipo': 'Reta' }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCardComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('product', mockProduct);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render product information', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Máquina Reta Teste Direct Drive');
    expect(text).toContain('SKYMAK');
    expect(text).toContain('Reta');
    expect(text).toContain('TEST-100');
    expect(text).toContain('R$');
  });

  it('should emit addedToCart when add to cart button is clicked', () => {
    let emittedProduct: Product | undefined;
    component.addedToCart.subscribe((prod) => {
      emittedProduct = prod;
    });

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    button.click();

    expect(emittedProduct).toEqual(mockProduct);
  });

  it('should fallback to placeholder icon when image fails to load', () => {
    const img = fixture.nativeElement.querySelector('img') as HTMLImageElement;
    if (img) {
      img.dispatchEvent(new Event('error'));
      fixture.detectChanges();
    }
    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg).toBeTruthy();
  });
});
