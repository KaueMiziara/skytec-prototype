import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PdpDescriptionComponent } from './pdp-description.component';
import { Product } from '../../../../../../core/models/product.model';

describe('PdpDescriptionComponent', () => {
  let component: PdpDescriptionComponent;
  let fixture: ComponentFixture<PdpDescriptionComponent>;

  const mockProduct: Product = {
    id: 'PROD-TEST-1',
    sku: 'TEST-100',
    name: 'Máquina Reta Teste Direct Drive',
    brand: 'SKYMAK',
    category: 'Reta',
    price: 2400,
    images: ['/assets/mock/test.jpg'],
    shortDescription: 'Descrição curta de teste para máquina industrial.',
    differentials: [
      'Motor Direct Drive Integrado: Menos ruído e menor consumo de energia.',
      'Corte de Linha Automático: Maior velocidade e produtividade.'
    ],
    specifications: { 'Tipo': 'Reta' }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdpDescriptionComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PdpDescriptionComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('product', mockProduct);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render description section with product info', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Descrição do Equipamento');
    expect(text).toContain('Máquina Reta Teste Direct Drive');
    expect(text).toContain('SKYMAK');
    expect(text).toContain('Reta');
    expect(text).toContain('Descrição curta de teste para máquina industrial.');
  });

  it('should render differentials with parsed titles and details', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Diferenciais Técnicos');
    expect(text).toContain('Motor Direct Drive Integrado');
    expect(text).toContain('Menos ruído e menor consumo de energia.');
    expect(text).toContain('Corte de Linha Automático');
    expect(text).toContain('Maior velocidade e produtividade.');
  });

  it('should handle product with empty differentials', () => {
    const productWithoutDiffs: Product = {
      ...mockProduct,
      differentials: []
    };
    fixture.componentRef.setInput('product', productWithoutDiffs);
    fixture.detectChanges();

    const diffSection = fixture.nativeElement.querySelector('section[aria-labelledby="diff-heading"]');
    expect(diffSection).toBeNull();
  });
});
