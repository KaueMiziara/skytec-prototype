import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PdpRelatedProductsComponent } from './pdp-related-products.component';
import { Product } from '../../../../../../core/models/product.model';

describe('PdpRelatedProductsComponent', () => {
  let component: PdpRelatedProductsComponent;
  let fixture: ComponentFixture<PdpRelatedProductsComponent>;

  const mockProducts: Product[] = [
    {
      id: 'PROD-1',
      sku: 'SKU-1',
      name: 'Máquina Reta 1',
      brand: 'Jack',
      category: 'Reta',
      price: 3000,
      images: ['assets/mock/prod1.jpg'],
      shortDescription: 'Desc 1',
      differentials: ['Diff 1'],
      specifications: { 'Tipo': 'Reta' }
    },
    {
      id: 'PROD-2',
      sku: 'SKU-2',
      name: 'Máquina Overlock 2',
      brand: 'Sun Special',
      category: 'Overlock',
      price: 3500,
      images: ['assets/mock/prod2.jpg'],
      shortDescription: 'Desc 2',
      differentials: ['Diff 2'],
      specifications: { 'Tipo': 'Overlock' }
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdpRelatedProductsComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(PdpRelatedProductsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('products', mockProducts);
    fixture.componentRef.setInput('currentCategory', 'Reta');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render section title, category, and product cards', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Máquinas e Equipamentos Relacionados');
    expect(text).toContain('Categoria: Reta');
    expect(text).toContain('Máquina Reta 1');
    expect(text).toContain('Máquina Overlock 2');
  });

  it('should emit addToCart when product card emits addedToCart', () => {
    let emittedProduct: Product | undefined;
    component.addToCart.subscribe((prod) => {
      emittedProduct = prod;
    });

    const addButtons = fixture.nativeElement.querySelectorAll('button[aria-label*="Adicionar"]');
    expect(addButtons.length).toBeGreaterThan(0);
    (addButtons[0] as HTMLButtonElement).click();

    expect(emittedProduct).toEqual(mockProducts[0]);
  });

  it('should not render section when products list is empty', () => {
    fixture.componentRef.setInput('products', []);
    fixture.detectChanges();

    const section = fixture.nativeElement.querySelector('section');
    expect(section).toBeNull();
  });
});
