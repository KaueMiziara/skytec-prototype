import { TestBed } from '@angular/core/testing';
import { CatalogStateService } from './catalog-state.service';
import { ProductService } from '../../../core/services/product.service';

describe('CatalogStateService', () => {
  let service: CatalogStateService;
  let productService: ProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CatalogStateService, ProductService]
    });
    service = TestBed.inject(CatalogStateService);
    productService = TestBed.inject(ProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have initial products and default filter values', () => {
    expect(service.products().length).toBeGreaterThan(0);
    expect(service.filteredProducts().length).toBe(service.products().length);
    expect(service.filters().query).toBe('');
    expect(service.filters().brands.length).toBe(0);
    expect(service.filters().categories.length).toBe(0);
    expect(service.hasActiveFilters()).toBe(false);
  });

  it('should filter products by query string matching name, sku, or description', () => {
    service.setQuery('skymak');
    expect(service.filteredProducts().length).toBeGreaterThan(0);
    expect(service.filteredProducts().every((p) => p.name.toLowerCase().includes('skymak') || p.brand.toLowerCase().includes('skymak') || p.sku.toLowerCase().includes('skymak'))).toBe(true);

    service.setQuery('nonexistentproductxyz');
    expect(service.filteredProducts().length).toBe(0);
    expect(service.totalResultsCount()).toBe(0);
  });

  it('should filter products by brand', () => {
    service.toggleBrand('Jack');
    expect(service.filters().brands).toContain('Jack');
    expect(service.filteredProducts().every((p) => p.brand === 'Jack')).toBe(true);

    service.toggleBrand('Jack');
    expect(service.filters().brands).not.toContain('Jack');
  });

  it('should filter products by category', () => {
    service.toggleCategory('Reta');
    expect(service.filters().categories).toContain('Reta');
    expect(service.filteredProducts().every((p) => p.category === 'Reta')).toBe(true);

    service.toggleCategory('Reta');
    expect(service.filters().categories).not.toContain('Reta');
  });

  it('should filter products by max price', () => {
    service.setMaxPrice(3500);
    expect(service.filteredProducts().every((p) => p.price <= 3500)).toBe(true);

    service.setMaxPrice(null);
    expect(service.filteredProducts().length).toBe(service.products().length);
  });

  it('should sort products by price ascending and descending', () => {
    service.setSortBy('price-asc');
    const asc = service.filteredProducts();
    for (let i = 0; i < asc.length - 1; i++) {
      expect(asc[i].price).toBeLessThanOrEqual(asc[i + 1].price);
    }

    service.setSortBy('price-desc');
    const desc = service.filteredProducts();
    for (let i = 0; i < desc.length - 1; i++) {
      expect(desc[i].price).toBeGreaterThanOrEqual(desc[i + 1].price);
    }
  });

  it('should sort products by name ascending and descending', () => {
    service.setSortBy('name-asc');
    const asc = service.filteredProducts();
    for (let i = 0; i < asc.length - 1; i++) {
      expect(asc[i].name.localeCompare(asc[i + 1].name, 'pt-BR')).toBeLessThanOrEqual(0);
    }

    service.setSortBy('name-desc');
    const desc = service.filteredProducts();
    for (let i = 0; i < desc.length - 1; i++) {
      expect(desc[i].name.localeCompare(desc[i + 1].name, 'pt-BR')).toBeGreaterThanOrEqual(0);
    }
  });

  it('should reset filters to default state', () => {
    service.setQuery('test');
    service.setBrands(['Jack']);
    service.setCategories(['Overlock']);
    service.setMaxPrice(3000);

    expect(service.hasActiveFilters()).toBe(true);

    service.resetFilters();

    expect(service.filters().query).toBe('');
    expect(service.filters().brands.length).toBe(0);
    expect(service.filters().categories.length).toBe(0);
    expect(service.filters().maxPrice).toBeNull();
    expect(service.hasActiveFilters()).toBe(false);
  });

  it('should manage mobile drawer state', () => {
    expect(service.isMobileDrawerOpen()).toBe(false);

    service.openMobileDrawer();
    expect(service.isMobileDrawerOpen()).toBe(true);

    service.closeMobileDrawer();
    expect(service.isMobileDrawerOpen()).toBe(false);

    service.toggleMobileDrawer();
    expect(service.isMobileDrawerOpen()).toBe(true);
  });

  it('should sync state from query parameters', () => {
    service.syncFromQueryParams({
      q: 'overlock',
      marca: 'Siruba',
      categoria: 'Overlock',
      ordem: 'price-desc',
      precoMax: '4500',
      precoMin: '1000'
    });

    expect(service.filters().query).toBe('overlock');
    expect(service.filters().brands).toEqual(['Siruba']);
    expect(service.filters().categories).toEqual(['Overlock']);
    expect(service.filters().sortBy).toBe('price-desc');
    expect(service.filters().maxPrice).toBe(4500);
    expect(service.filters().minPrice).toBe(1000);
  });
});
