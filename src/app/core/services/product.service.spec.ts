import { TestBed } from '@angular/core/testing';
import { ProductService } from './product.service';
import { Product } from '../models/product.model';

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductService]
    });
    service = TestBed.inject(ProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load initial products from json mock', () => {
    expect(service.products().length).toBeGreaterThan(0);
  });

  it('should compute categories and brands', () => {
    expect(service.categories().length).toBeGreaterThan(0);
    expect(service.brands().length).toBeGreaterThan(0);
  });

  it('should find product by id', () => {
    const firstProduct = service.products()[0];
    const found = service.getProductById(firstProduct.id);
    expect(found).toEqual(firstProduct);
  });

  it('should find product by sku ignoring case', () => {
    const firstProduct = service.products()[0];
    const found = service.getProductBySku(firstProduct.sku.toLowerCase());
    expect(found).toEqual(firstProduct);
  });

  it('should retrieve related products excluding the current product', () => {
    const firstProduct = service.products()[0];
    const related = service.getRelatedProducts(firstProduct.id, 2);
    expect(related.every((p) => p.id !== firstProduct.id)).toBe(true);
  });

  it('should support adding, updating and deleting products in-memory', () => {
    const testProduct: Product = {
      id: 'TEST-1',
      sku: 'TEST-SKU',
      name: 'Test Machine',
      brand: 'Jack',
      category: 'Reta',
      price: 1999,
      images: ['/test.jpg'],
      shortDescription: 'Test description',
      differentials: ['Fast'],
      specifications: { Speed: '5000rpm' }
    };

    service.addProduct(testProduct);
    expect(service.getProductById('TEST-1')).toBeDefined();

    service.updateProduct('TEST-1', { price: 2499 });
    expect(service.getProductById('TEST-1')?.price).toBe(2499);

    service.deleteProduct('TEST-1');
    expect(service.getProductById('TEST-1')).toBeUndefined();
  });
});
