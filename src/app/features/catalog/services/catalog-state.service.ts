import { Injectable, computed, inject, signal } from '@angular/core';
import { DEFAULT_FILTER_STATE, Product, ProductFilterState, ProductSortOption } from '../../../core/models/product.model';
import { ProductService } from '../../../core/services/product.service';

@Injectable({
  providedIn: 'root'
})
export class CatalogStateService {
  private readonly productService = inject(ProductService);

  readonly filters = signal<ProductFilterState>(DEFAULT_FILTER_STATE);
  readonly isMobileDrawerOpen = signal<boolean>(false);

  readonly products = this.productService.products;
  readonly availableBrands = this.productService.brands;
  readonly availableCategories = this.productService.categories;

  readonly minPriceBound = computed<number>(() => {
    const list = this.productService.products();
    if (list.length === 0) return 0;
    return Math.min(...list.map((p) => p.price));
  });

  readonly maxPriceBound = computed<number>(() => {
    const list = this.productService.products();
    if (list.length === 0) return 10000;
    const max = Math.max(...list.map((p) => p.price));
    return Math.ceil(max / 100) * 100;
  });

  readonly filteredProducts = computed<Product[]>(() => {
    const list = this.productService.products();
    const { query, brands, categories, minPrice, maxPrice, sortBy } = this.filters();

    const normalizedQuery = query.trim().toLowerCase();

    return list
      .filter((product) => {
        if (normalizedQuery) {
          const matchName = product.name.toLowerCase().includes(normalizedQuery);
          const matchSku = product.sku.toLowerCase().includes(normalizedQuery);
          const matchBrand = product.brand.toLowerCase().includes(normalizedQuery);
          const matchCategory = product.category.toLowerCase().includes(normalizedQuery);
          const matchDescription = product.shortDescription?.toLowerCase().includes(normalizedQuery);
          const matchSpecs = Object.entries(product.specifications || {}).some(
            ([k, v]) => k.toLowerCase().includes(normalizedQuery) || v.toLowerCase().includes(normalizedQuery)
          );

          if (!matchName && !matchSku && !matchBrand && !matchCategory && !matchDescription && !matchSpecs) {
            return false;
          }
        }

        if (brands.length > 0 && !brands.includes(product.brand)) {
          return false;
        }

        if (categories.length > 0 && !categories.includes(product.category)) {
          return false;
        }

        if (minPrice !== null && product.price < minPrice) {
          return false;
        }

        if (maxPrice !== null && product.price > maxPrice) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'price-asc':
            return a.price - b.price;
          case 'price-desc':
            return b.price - a.price;
          case 'name-asc':
            return a.name.localeCompare(b.name, 'pt-BR');
          case 'name-desc':
            return b.name.localeCompare(a.name, 'pt-BR');
          default:
            return 0;
        }
      });
  });

  readonly totalResultsCount = computed<number>(() => this.filteredProducts().length);

  readonly activeFilterCount = computed<number>(() => {
    const f = this.filters();
    let count = 0;
    if (f.query.trim()) count++;
    count += f.brands.length;
    count += f.categories.length;
    if (f.maxPrice !== null) count++;
    if (f.minPrice !== null) count++;
    return count;
  });

  readonly hasActiveFilters = computed<boolean>(() => this.activeFilterCount() > 0);

  setQuery(query: string): void {
    this.filters.update((current) => ({ ...current, query }));
  }

  toggleBrand(brand: string): void {
    this.filters.update((current) => {
      const exists = current.brands.includes(brand);
      return {
        ...current,
        brands: exists ? current.brands.filter((b) => b !== brand) : [...current.brands, brand]
      };
    });
  }

  setBrands(brands: string[]): void {
    this.filters.update((current) => ({ ...current, brands }));
  }

  toggleCategory(category: string): void {
    this.filters.update((current) => {
      const exists = current.categories.includes(category);
      return {
        ...current,
        categories: exists ? current.categories.filter((c) => c !== category) : [...current.categories, category]
      };
    });
  }

  setCategories(categories: string[]): void {
    this.filters.update((current) => ({ ...current, categories }));
  }

  setMaxPrice(maxPrice: number | null): void {
    this.filters.update((current) => ({ ...current, maxPrice }));
  }

  setMinPrice(minPrice: number | null): void {
    this.filters.update((current) => ({ ...current, minPrice }));
  }

  setPriceRange(minPrice: number | null, maxPrice: number | null): void {
    this.filters.update((current) => ({ ...current, minPrice, maxPrice }));
  }

  setSortBy(sortBy: ProductSortOption): void {
    this.filters.update((current) => ({ ...current, sortBy }));
  }

  updateFilters(partial: Partial<ProductFilterState>): void {
    this.filters.update((current) => ({ ...current, ...partial }));
  }

  setFilters(filters: ProductFilterState): void {
    this.filters.set(filters);
  }

  resetFilters(): void {
    this.filters.update((current) => ({
      ...DEFAULT_FILTER_STATE,
      sortBy: current.sortBy
    }));
  }

  openMobileDrawer(): void {
    this.isMobileDrawerOpen.set(true);
  }

  closeMobileDrawer(): void {
    this.isMobileDrawerOpen.set(false);
  }

  toggleMobileDrawer(): void {
    this.isMobileDrawerOpen.update((val) => !val);
  }

  syncFromQueryParams(params: Record<string, unknown>): void {
    this.filters.update((current) => {
      const updated = { ...current };

      if (typeof params['q'] === 'string') {
        updated.query = params['q'];
      }

      if (typeof params['marca'] === 'string' && params['marca']) {
        updated.brands = [params['marca']];
      } else if (Array.isArray(params['marca'])) {
        updated.brands = params['marca'].filter((m): m is string => typeof m === 'string');
      }

      if (typeof params['categoria'] === 'string' && params['categoria']) {
        updated.categories = [params['categoria']];
      } else if (Array.isArray(params['categoria'])) {
        updated.categories = params['categoria'].filter((c): c is string => typeof c === 'string');
      }

      if (params['ordem'] === 'price-asc' || params['ordem'] === 'price-desc' || params['ordem'] === 'name-asc' || params['ordem'] === 'name-desc') {
        updated.sortBy = params['ordem'];
      }

      if (typeof params['precoMax'] === 'string' && !isNaN(Number(params['precoMax']))) {
        updated.maxPrice = Number(params['precoMax']);
      }

      if (typeof params['precoMin'] === 'string' && !isNaN(Number(params['precoMin']))) {
        updated.minPrice = Number(params['precoMin']);
      }

      return updated;
    });
  }
}
