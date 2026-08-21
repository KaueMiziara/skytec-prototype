import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CatalogFiltersComponent, DEFAULT_FILTER_STATE } from './catalog-filters.component';
import { ProductFilterState } from '../../../../core/models/product.model';

describe('CatalogFiltersComponent', () => {
  let component: CatalogFiltersComponent;
  let fixture: ComponentFixture<CatalogFiltersComponent>;

  const mockCategories = ['Reta', 'Overlock', 'Galoneira'];
  const mockBrands = ['SKYMAK', 'Jack', 'Siruba'];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogFiltersComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CatalogFiltersComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('availableCategories', mockCategories);
    fixture.componentRef.setInput('availableBrands', mockBrands);
    fixture.componentRef.setInput('minPriceBound', 1000);
    fixture.componentRef.setInput('maxPriceBound', 5000);
    fixture.componentRef.setInput('filters', DEFAULT_FILTER_STATE);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render categories and brands lists', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Reta');
    expect(text).toContain('Overlock');
    expect(text).toContain('SKYMAK');
    expect(text).toContain('Jack');
  });

  it('should emit updated filters when toggling a brand', () => {
    let updated: ProductFilterState | undefined;
    component.filtersChange.subscribe((f) => {
      updated = f;
    });

    const checkboxes = fixture.nativeElement.querySelectorAll('input[type="checkbox"]');
    const brandCheckbox = Array.from(checkboxes).find(
      (cb: any) => cb.closest('label')?.textContent?.includes('SKYMAK')
    ) as HTMLInputElement;

    expect(brandCheckbox).toBeTruthy();
    brandCheckbox.click();

    expect(updated?.brands).toContain('SKYMAK');
  });

  it('should emit updated filters when toggling a category', () => {
    let updated: ProductFilterState | undefined;
    component.filtersChange.subscribe((f) => {
      updated = f;
    });

    const checkboxes = fixture.nativeElement.querySelectorAll('input[type="checkbox"]');
    const catCheckbox = Array.from(checkboxes).find(
      (cb: any) => cb.closest('label')?.textContent?.includes('Overlock')
    ) as HTMLInputElement;

    expect(catCheckbox).toBeTruthy();
    catCheckbox.click();

    expect(updated?.categories).toContain('Overlock');
  });

  it('should emit updated filters when changing search query', () => {
    let updated: ProductFilterState | undefined;
    component.filtersChange.subscribe((f) => {
      updated = f;
    });

    const searchInput = fixture.nativeElement.querySelector('input[type="search"]') as HTMLInputElement;
    searchInput.value = 'direct drive';
    searchInput.dispatchEvent(new Event('input'));

    expect(updated?.query).toBe('direct drive');
  });

  it('should emit updated filters when changing sort option', () => {
    let updated: ProductFilterState | undefined;
    component.filtersChange.subscribe((f) => {
      updated = f;
    });

    const select = fixture.nativeElement.querySelector('select') as HTMLSelectElement;
    select.value = 'name-asc';
    select.dispatchEvent(new Event('change'));

    expect(updated?.sortBy).toBe('name-asc');
  });

  it('should emit updated filters when changing max price slider', () => {
    let updated: ProductFilterState | undefined;
    component.filtersChange.subscribe((f) => {
      updated = f;
    });

    const range = fixture.nativeElement.querySelector('input[type="range"]') as HTMLInputElement;
    range.value = '3500';
    range.dispatchEvent(new Event('input'));

    expect(updated?.maxPrice).toBe(3500);
  });

  it('should show active filter chips when filters are applied', () => {
    fixture.componentRef.setInput('filters', {
      ...DEFAULT_FILTER_STATE,
      query: 'jack',
      brands: ['Jack'],
      categories: ['Reta'],
      maxPrice: 4000
    });
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('"jack"');
    expect(text).toContain('Jack');
    expect(text).toContain('Reta');
  });

  it('should open mobile drawer when isMobileDrawerOpen is true and handle close', () => {
    let closed = false;
    component.closeDrawer.subscribe(() => {
      closed = true;
    });

    fixture.componentRef.setInput('isMobileDrawerOpen', true);
    fixture.detectChanges();

    const drawer = fixture.nativeElement.querySelector('[role="dialog"]');
    expect(drawer).toBeTruthy();

    const closeBtn = fixture.nativeElement.querySelector('button[aria-label="Fechar filtros"]') as HTMLButtonElement;
    closeBtn.click();

    expect(closed).toBe(true);
  });

  it('should close mobile drawer when escape key is pressed', () => {
    let closed = false;
    component.closeDrawer.subscribe(() => {
      closed = true;
    });

    fixture.componentRef.setInput('isMobileDrawerOpen', true);
    fixture.detectChanges();

    window.document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(closed).toBe(true);
  });

  it('should reset all filters when Limpar tudo is clicked', () => {
    let resetCalled = false;
    let updated: ProductFilterState | undefined;

    component.resetFilters.subscribe(() => {
      resetCalled = true;
    });
    component.filtersChange.subscribe((f) => {
      updated = f;
    });

    fixture.componentRef.setInput('filters', {
      ...DEFAULT_FILTER_STATE,
      brands: ['Jack'],
      categories: ['Reta']
    });
    fixture.detectChanges();

    const resetBtn = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    resetBtn.click();

    expect(resetCalled).toBe(true);
    expect(updated?.brands.length).toBe(0);
    expect(updated?.categories.length).toBe(0);
  });
});
