import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminProductModalComponent } from './admin-product-modal.component';
import { Product } from '../../../../core/models/product.model';

describe('AdminProductModalComponent', () => {
  let component: AdminProductModalComponent;
  let fixture: ComponentFixture<AdminProductModalComponent>;

  const mockProduct: Product = {
    id: 'prod-123',
    sku: 'SKY-TEST-01',
    name: 'Máquina Reta Teste',
    brand: 'SKYMAK',
    category: 'Reta',
    price: 4990,
    images: ['/test.jpg'],
    shortDescription: 'Descrição teste de alta qualidade',
    differentials: ['Direct Drive', 'Corte Automático'],
    specifications: { 'Velocidade': '5000 rpm' },
    isFeatured: true
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminProductModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminProductModalComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not render dialog when isOpen is false', () => {
    fixture.componentRef.setInput('isOpen', false);
    fixture.detectChanges();

    const dialog = fixture.nativeElement.querySelector('[role="dialog"]');
    expect(dialog).toBeNull();
  });

  it('should render dialog when isOpen is true in creation mode', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('product', null);
    fixture.detectChanges();

    const dialog = fixture.nativeElement.querySelector('[role="dialog"]');
    expect(dialog).toBeTruthy();

    const title = fixture.nativeElement.querySelector('#modal-product-title');
    expect(title.textContent).toContain('Cadastrar Nova Máquina');
  });

  it('should render dialog in edit mode with populated product data', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('product', mockProduct);
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector('#modal-product-title');
    expect(title.textContent).toContain('Editar Máquina Industrial');

    expect(component.productForm.controls.name.value).toBe('Máquina Reta Teste');
    expect(component.productForm.controls.sku.value).toBe('SKY-TEST-01');
    expect(component.productForm.controls.brand.value).toBe('SKYMAK');
    expect(component.productForm.controls.category.value).toBe('Reta');
    expect(component.productForm.controls.price.value).toBe(4990);
    expect(component.productForm.controls.isFeatured.value).toBe(true);
  });

  it('should validate required fields and prevent invalid submission', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('product', null);
    fixture.detectChanges();

    let savedPayload: Product | undefined;
    component.save.subscribe((p) => (savedPayload = p));

    component.productForm.controls.name.setValue('');
    component.productForm.controls.sku.setValue('');
    component.productForm.controls.price.setValue(0);
    component.productForm.controls.shortDescription.setValue('');

    const form = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(savedPayload).toBeUndefined();
    expect(component.getNameError()).toContain('obrigatório');
    expect(component.getSkuError()).toContain('obrigatório');
    expect(component.getPriceError()).toContain('superior a R$ 0,00');
    expect(component.getDescriptionError()).toContain('obrigatória');
  });

  it('should emit save event with new product on valid create submission', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('product', null);
    fixture.detectChanges();

    let savedPayload: Product | undefined;
    component.save.subscribe((p) => (savedPayload = p));

    component.productForm.setValue({
      name: 'Nova Overlock Direct Drive',
      sku: 'SKU-NEW-99',
      brand: 'Jack',
      category: 'Overlock',
      price: 5500,
      imageUrl: '/images/new.webp',
      shortDescription: 'Overlock industrial rápida',
      differentials: 'Lubrificação Automática\nMotor Silencioso',
      isFeatured: false
    });

    const form = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(savedPayload).toBeDefined();
    expect(savedPayload?.name).toBe('Nova Overlock Direct Drive');
    expect(savedPayload?.sku).toBe('SKU-NEW-99');
    expect(savedPayload?.brand).toBe('Jack');
    expect(savedPayload?.category).toBe('Overlock');
    expect(savedPayload?.price).toBe(5500);
    expect(savedPayload?.differentials.length).toBe(2);
    expect(savedPayload?.id).toContain('prod-');
  });

  it('should emit save event with existing product ID on valid edit submission', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('product', mockProduct);
    fixture.detectChanges();

    let savedPayload: Product | undefined;
    component.save.subscribe((p) => (savedPayload = p));

    component.productForm.controls.price.setValue(6000);

    const form = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(savedPayload).toBeDefined();
    expect(savedPayload?.id).toBe('prod-123');
    expect(savedPayload?.price).toBe(6000);
  });

  it('should emit cancel event when Cancel button is clicked', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    let cancelled = false;
    component.cancel.subscribe(() => (cancelled = true));

    const cancelBtn = fixture.nativeElement.querySelector('button[aria-label="Cancelar edição"]');
    expect(cancelBtn).toBeTruthy();
    cancelBtn.click();

    expect(cancelled).toBe(true);
  });

  it('should emit cancel event when backdrop is clicked', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    let cancelled = false;
    component.cancel.subscribe(() => (cancelled = true));

    const backdrop = fixture.nativeElement.querySelector('[role="dialog"]');
    backdrop.click();

    expect(cancelled).toBe(true);
  });

  it('should emit cancel event on Escape key', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    let cancelled = false;
    component.cancel.subscribe(() => (cancelled = true));

    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);

    expect(cancelled).toBe(true);
  });
});
