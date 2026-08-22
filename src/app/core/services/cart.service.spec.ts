import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { Product } from '../models/product.model';

describe('CartService', () => {
  let service: CartService;

  const mockProduct1: Product = {
    id: 'PROD-1',
    sku: 'SKU-001',
    name: 'Máquina Reta Teste 1',
    brand: 'Jack',
    category: 'Reta',
    price: 3000,
    images: ['/test1.jpg'],
    shortDescription: 'Desc 1',
    differentials: ['Diff 1'],
    specifications: { Speed: '5000rpm' }
  };

  const mockProduct2: Product = {
    id: 'PROD-2',
    sku: 'SKU-002',
    name: 'Máquina Overlock Teste 2',
    brand: 'Sun Special',
    category: 'Overlock',
    price: 4500,
    images: ['/test2.jpg'],
    shortDescription: 'Desc 2',
    differentials: ['Diff 2'],
    specifications: { Speed: '6000rpm' }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CartService]
    });
    service = TestBed.inject(CartService);
  });

  it('should start with an empty cart', () => {
    expect(service.items()).toEqual([]);
    expect(service.totalCount()).toBe(0);
    expect(service.subtotal()).toBe(0);
    expect(service.isEmpty()).toBe(true);
  });

  it('should add items to cart and increment count if added again', () => {
    service.addItem(mockProduct1, 1);
    expect(service.items().length).toBe(1);
    expect(service.totalCount()).toBe(1);
    expect(service.subtotal()).toBe(3000);
    expect(service.isEmpty()).toBe(false);

    service.addItem(mockProduct1, 2);
    expect(service.items().length).toBe(1);
    expect(service.items()[0].quantity).toBe(3);
    expect(service.totalCount()).toBe(3);
    expect(service.subtotal()).toBe(9000);

    service.addItem(mockProduct2, 1);
    expect(service.items().length).toBe(2);
    expect(service.totalCount()).toBe(4);
    expect(service.subtotal()).toBe(13500);
  });

  it('should update item quantity and remove if quantity is 0', () => {
    service.addItem(mockProduct1, 2);
    service.updateQuantity('PROD-1', 5);
    expect(service.items()[0].quantity).toBe(5);
    expect(service.totalCount()).toBe(5);

    service.updateQuantity('PROD-1', 0);
    expect(service.items().length).toBe(0);
    expect(service.totalCount()).toBe(0);
  });

  it('should remove item by id', () => {
    service.addItem(mockProduct1, 1);
    service.addItem(mockProduct2, 1);
    service.removeItem('PROD-1');

    expect(service.items().length).toBe(1);
    expect(service.items()[0].product.id).toBe('PROD-2');
  });

  it('should clear all items in cart', () => {
    service.addItem(mockProduct1, 2);
    service.addItem(mockProduct2, 3);
    service.clearCart();

    expect(service.items()).toEqual([]);
    expect(service.totalCount()).toBe(0);
    expect(service.subtotal()).toBe(0);
  });

  it('should manage drawer open and close state', () => {
    expect(service.isDrawerOpen()).toBe(false);
    service.openDrawer();
    expect(service.isDrawerOpen()).toBe(true);
    service.closeDrawer();
    expect(service.isDrawerOpen()).toBe(false);
    service.toggleDrawer();
    expect(service.isDrawerOpen()).toBe(true);
  });

  it('should generate pre-filled WhatsApp link with empty message when cart is empty', () => {
    const link = service.generateWhatsAppLink('5511988887777');
    expect(link).toContain('https://wa.me/5511988887777?text=');
    expect(decodeURIComponent(link)).toContain('Olá! Gostaria de falar com um consultor da SKYTEC Máquinas.');
  });

  it('should generate pre-filled WhatsApp link with full cart payload and customer data', () => {
    service.addItem(mockProduct1, 2);
    service.addItem(mockProduct2, 1);
    const link = service.generateWhatsAppLink('5511988887777', {
      name: 'Confecções Silva Ltda',
      cnpjCpf: '12.345.678/0001-90'
    });

    const decoded = decodeURIComponent(link);
    expect(link).toContain('https://wa.me/5511988887777?text=');
    expect(decoded).toContain('SOLICITAÇÃO DE COTAÇÃO B2B - SKYTEC MÁQUINAS');
    expect(decoded).toContain('Confecções Silva Ltda');
    expect(decoded).toContain('12.345.678/0001-90');
    expect(decoded).toContain('SKU-001');
    expect(decoded).toContain('Máquina Reta Teste 1');
    expect(decoded).toContain('Qtd: 2');
    expect(decoded).toContain('SKU-002');
    expect(decoded).toContain('VALOR TOTAL ESTIMADO');
    expect(decoded).toContain('10.500,00');
  });

  it('should generate single product WhatsApp quote link', () => {
    const link = service.generateProductWhatsAppLink(mockProduct1, 3, '5511999999999', {
      name: 'Ateliê Central'
    });

    const decoded = decodeURIComponent(link);
    expect(link).toContain('https://wa.me/5511999999999?text=');
    expect(decoded).toContain('CONSULTA TÉCNICA / COTAÇÃO - SKYTEC MÁQUINAS');
    expect(decoded).toContain('Ateliê Central');
    expect(decoded).toContain('SKU-001');
    expect(decoded).toContain('Máquina Reta Teste 1');
    expect(decoded).toContain('3');
    expect(decoded).toContain('9.000,00');
  });
});
