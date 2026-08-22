import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PdpBuyBoxComponent } from './pdp-buy-box.component';
import { Product } from '../../../../../../core/models/product.model';
import { CartService } from '../../../../../../core/services/cart.service';
import { AuthService } from '../../../../../../core/services/auth.service';

describe('PdpBuyBoxComponent', () => {
  let component: PdpBuyBoxComponent;
  let fixture: ComponentFixture<PdpBuyBoxComponent>;

  const mockProduct: Product = {
    id: 'PROD-TEST-1',
    sku: 'TEST-100',
    name: 'Máquina Reta Teste Direct Drive',
    brand: 'SKYMAK',
    category: 'Reta',
    price: 2400,
    images: ['assets/mock/test.jpg'],
    shortDescription: 'Descrição teste de máquina industrial.',
    differentials: ['Direct Drive', 'Corte automático'],
    specifications: { 'Tipo': 'Reta' }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdpBuyBoxComponent],
      providers: [CartService, AuthService]
    }).compileComponents();

    fixture = TestBed.createComponent(PdpBuyBoxComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('product', mockProduct);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render product name, brand, category, sku, and price', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Máquina Reta Teste Direct Drive');
    expect(text).toContain('SKYMAK');
    expect(text).toContain('Reta');
    expect(text).toContain('SKU: TEST-100');
    expect(text).toContain('R$');
  });

  it('should increment and decrement quantity', () => {
    component.incrementQuantity();
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input[type="number"]') as HTMLInputElement;
    expect(input.value).toBe('2');

    component.decrementQuantity();
    fixture.detectChanges();
    expect(input.value).toBe('1');

    component.decrementQuantity();
    fixture.detectChanges();
    expect(input.value).toBe('1');
  });

  it('should handle manual quantity changes', () => {
    const input = fixture.nativeElement.querySelector('input[type="number"]') as HTMLInputElement;
    input.value = '5';
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(input.value).toBe('5');

    input.value = '-2';
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(input.value).toBe('1');
  });

  it('should emit addToCart event when clicking add button', () => {
    let emittedData: { product: Product; quantity: number } | undefined;
    component.addToCart.subscribe((data) => {
      emittedData = data;
    });

    component.incrementQuantity();
    component.incrementQuantity();
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button[aria-label*="Adicionar"]') as HTMLButtonElement;
    button.click();

    expect(emittedData).toBeDefined();
    expect(emittedData?.product).toEqual(mockProduct);
    expect(emittedData?.quantity).toBe(3);
  });

  it('should have a WhatsApp consult link with product info', () => {
    const link = fixture.nativeElement.querySelector('a[aria-label*="WhatsApp"]') as HTMLAnchorElement;
    expect(link).toBeTruthy();
    expect(link.href).toContain('wa.me');
    expect(decodeURIComponent(link.href)).toContain('TEST-100');
    expect(decodeURIComponent(link.href)).toContain('CONSULTA TÉCNICA');
  });
});
