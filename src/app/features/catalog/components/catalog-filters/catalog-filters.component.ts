import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { ProductFilterState, ProductSortOption } from '../../../../core/models/product.model';

export const DEFAULT_FILTER_STATE: ProductFilterState = {
  query: '',
  brands: [],
  categories: [],
  minPrice: null,
  maxPrice: null,
  sortBy: 'price-asc'
};

@Component({
  selector: 'app-catalog-filters',
  template: `
    <div class="hidden lg:block bg-white border border-neutral-200 rounded-xl p-5 shadow-xs">
      <div class="flex items-center justify-between pb-4 border-b border-neutral-200">
        <div class="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-[#077fbd]" aria-hidden="true">
            <line x1="4" x2="4" y1="21" y2="14" />
            <line x1="4" x2="4" y1="10" y2="3" />
            <line x1="12" x2="12" y1="21" y2="12" />
            <line x1="12" x2="12" y1="8" y2="3" />
            <line x1="20" x2="20" y1="21" y2="16" />
            <line x1="20" x2="20" y1="12" y2="3" />
            <line x1="1" x2="7" y1="14" y2="14" />
            <line x1="9" x2="15" y1="8" y2="8" />
            <line x1="17" x2="23" y1="16" y2="16" />
          </svg>
          <h3 class="text-sm font-bold uppercase tracking-wider text-neutral-900">Filtros</h3>
        </div>

        @if (hasActiveFilters()) {
          <button
            type="button"
            (click)="handleResetAll()"
            class="text-xs font-semibold text-[#077fbd] hover:text-[#055780] transition-colors cursor-pointer focus-visible:outline-none focus-visible:underline"
          >
            Limpar tudo
          </button>
        }
      </div>

      @if (hasActiveFilters()) {
        <div class="py-3 border-b border-neutral-200 flex flex-wrap gap-1.5" aria-label="Filtros ativos">
          @if (filters().query.trim()) {
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-neutral-100 text-neutral-800 border border-neutral-200">
              <span>"{{ filters().query }}"</span>
              <button
                type="button"
                (click)="handleRemoveQuery()"
                class="hover:text-red-600 focus-visible:outline-none cursor-pointer"
                aria-label="Remover busca por termo"
              >
                ✕
              </button>
            </span>
          }

          @for (brand of filters().brands; track brand) {
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-[#0573cc]/10 text-[#0573cc] border border-[#0573cc]/20">
              <span>{{ brand }}</span>
              <button
                type="button"
                (click)="handleToggleBrand(brand)"
                class="hover:text-red-600 focus-visible:outline-none cursor-pointer"
                [attr.aria-label]="'Remover filtro marca ' + brand"
              >
                ✕
              </button>
            </span>
          }

          @for (category of filters().categories; track category) {
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-neutral-900 text-white">
              <span>{{ category }}</span>
              <button
                type="button"
                (click)="handleToggleCategory(category)"
                class="hover:text-red-400 focus-visible:outline-none cursor-pointer"
                [attr.aria-label]="'Remover filtro categoria ' + category"
              >
                ✕
              </button>
            </span>
          }

          @if (filters().maxPrice !== null) {
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-neutral-100 text-neutral-800 border border-neutral-200">
              <span>Até {{ formatPrice(filters().maxPrice!) }}</span>
              <button
                type="button"
                (click)="handleRemovePrice()"
                class="hover:text-red-600 focus-visible:outline-none cursor-pointer"
                aria-label="Remover filtro de preço"
              >
                ✕
              </button>
            </span>
          }
        </div>
      }

      <div class="py-4 border-b border-neutral-200 space-y-2">
        <label for="catalog-search-input" class="block text-xs font-bold uppercase tracking-wider text-neutral-700">
          Buscar no Catálogo
        </label>
        <div class="relative">
          <input
            id="catalog-search-input"
            type="search"
            [value]="filters().query"
            (input)="handleQueryInput($event)"
            placeholder="Nome, SKU ou especificação..."
            class="w-full pl-9 pr-3 py-2 text-xs bg-white text-neutral-900 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#077fbd] focus:ring-1 focus:ring-[#077fbd]"
          />
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" x2="16.65" y1="21" y2="16.65" />
          </svg>
        </div>
      </div>

      <div class="py-4 border-b border-neutral-200 space-y-2">
        <label for="catalog-sort-select" class="block text-xs font-bold uppercase tracking-wider text-neutral-700">
          Ordenar Por
        </label>
        <select
          id="catalog-sort-select"
          [value]="filters().sortBy"
          (change)="handleSortChange($event)"
          class="w-full px-3 py-2 text-xs bg-white text-neutral-900 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#077fbd] focus:ring-1 focus:ring-[#077fbd] cursor-pointer"
        >
          <option value="price-asc">Menor Preço</option>
          <option value="price-desc">Maior Preço</option>
          <option value="name-asc">Nome (A - Z)</option>
          <option value="name-desc">Nome (Z - A)</option>
        </select>
      </div>

      <div class="py-4 border-b border-neutral-200 space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-wider text-neutral-700">Tipo de Máquina / Ponto</span>
          <span class="text-[11px] font-mono text-neutral-400">({{ availableCategories().length }})</span>
        </div>
        <div class="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          @for (category of availableCategories(); track category) {
            <label class="flex items-center justify-between gap-2 py-1 text-xs text-neutral-700 hover:text-neutral-900 cursor-pointer select-none">
              <div class="flex items-center gap-2">
                <input
                  type="checkbox"
                  [checked]="isCategorySelected(category)"
                  (change)="handleToggleCategory(category)"
                  class="w-4 h-4 rounded border-neutral-300 text-[#077fbd] focus:ring-[#077fbd] cursor-pointer"
                />
                <span>{{ category }}</span>
              </div>
            </label>
          }
        </div>
      </div>

      <div class="py-4 border-b border-neutral-200 space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-wider text-neutral-700">Fabricante / Marca</span>
          <span class="text-[11px] font-mono text-neutral-400">({{ availableBrands().length }})</span>
        </div>
        <div class="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          @for (brand of availableBrands(); track brand) {
            <label class="flex items-center justify-between gap-2 py-1 text-xs text-neutral-700 hover:text-neutral-900 cursor-pointer select-none">
              <div class="flex items-center gap-2">
                <input
                  type="checkbox"
                  [checked]="isBrandSelected(brand)"
                  (change)="handleToggleBrand(brand)"
                  class="w-4 h-4 rounded border-neutral-300 text-[#077fbd] focus:ring-[#077fbd] cursor-pointer"
                />
                <span>{{ brand }}</span>
              </div>
            </label>
          }
        </div>
      </div>

      <div class="pt-4 space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-wider text-neutral-700">Preço Máximo</span>
          <span class="text-xs font-bold text-[#077fbd]">
            {{ formatPrice(currentEffectiveMaxPrice()) }}
          </span>
        </div>

        <input
          type="range"
          [min]="minPriceBound()"
          [max]="maxPriceBound()"
          [step]="50"
          [value]="currentEffectiveMaxPrice()"
          (input)="handlePriceSlider($event)"
          aria-label="Filtro de preço máximo"
          class="w-full accent-[#077fbd] cursor-pointer"
        />

        <div class="flex items-center justify-between text-[10px] font-mono text-neutral-400">
          <span>{{ formatPrice(minPriceBound()) }}</span>
          <span>{{ formatPrice(maxPriceBound()) }}</span>
        </div>
      </div>
    </div>

    @if (isMobileDrawerOpen()) {
      <div class="lg:hidden fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Filtros do Catálogo">
        <div
          class="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          (click)="handleCloseDrawer()"
          aria-hidden="true"
        ></div>

        <div class="relative w-full max-w-sm bg-white h-full flex flex-col shadow-2xl z-10">
          <div class="flex items-center justify-between px-5 py-4 border-b border-neutral-200 bg-[#101010] text-white">
            <div class="flex items-center gap-2">
              <h2 class="text-sm font-bold uppercase tracking-wider">Filtros do Catálogo</h2>
              @if (activeFilterCount() > 0) {
                <span class="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#077fbd] text-white">
                  {{ activeFilterCount() }}
                </span>
              }
            </div>

            <button
              type="button"
              (click)="handleCloseDrawer()"
              class="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
              aria-label="Fechar filtros"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div class="flex-1 overflow-y-auto p-5 space-y-6">
            @if (hasActiveFilters()) {
              <div class="flex items-center justify-between pb-3 border-b border-neutral-200">
                <span class="text-xs font-bold uppercase tracking-wider text-neutral-900">Filtros Ativos</span>
                <button
                  type="button"
                  (click)="handleResetAll()"
                  class="text-xs font-semibold text-[#077fbd] hover:text-[#055780] transition-colors cursor-pointer"
                >
                  Limpar tudo
                </button>
              </div>

              <div class="flex flex-wrap gap-1.5 pb-2">
                @if (filters().query.trim()) {
                  <span class="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-neutral-100 text-neutral-800 border border-neutral-200">
                    <span>"{{ filters().query }}"</span>
                    <button type="button" (click)="handleRemoveQuery()" class="hover:text-red-600 cursor-pointer">✕</button>
                  </span>
                }

                @for (brand of filters().brands; track brand) {
                  <span class="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-[#0573cc]/10 text-[#0573cc] border border-[#0573cc]/20">
                    <span>{{ brand }}</span>
                    <button type="button" (click)="handleToggleBrand(brand)" class="hover:text-red-600 cursor-pointer">✕</button>
                  </span>
                }

                @for (category of filters().categories; track category) {
                  <span class="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-neutral-900 text-white">
                    <span>{{ category }}</span>
                    <button type="button" (click)="handleToggleCategory(category)" class="hover:text-red-400 cursor-pointer">✕</button>
                  </span>
                }

                @if (filters().maxPrice !== null) {
                  <span class="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-neutral-100 text-neutral-800 border border-neutral-200">
                    <span>Até {{ formatPrice(filters().maxPrice!) }}</span>
                    <button type="button" (click)="handleRemovePrice()" class="hover:text-red-600 cursor-pointer">✕</button>
                  </span>
                }
              </div>
            }

            <div class="space-y-2">
              <label for="mobile-catalog-search" class="block text-xs font-bold uppercase tracking-wider text-neutral-700">
                Buscar
              </label>
              <input
                id="mobile-catalog-search"
                type="search"
                [value]="filters().query"
                (input)="handleQueryInput($event)"
                placeholder="Nome, SKU ou especificação..."
                class="w-full px-3.5 py-2.5 text-sm bg-white text-neutral-900 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#077fbd] focus:ring-1 focus:ring-[#077fbd]"
              />
            </div>

            <div class="space-y-2">
              <label for="mobile-catalog-sort" class="block text-xs font-bold uppercase tracking-wider text-neutral-700">
                Ordenar Por
              </label>
              <select
                id="mobile-catalog-sort"
                [value]="filters().sortBy"
                (change)="handleSortChange($event)"
                class="w-full px-3.5 py-2.5 text-sm bg-white text-neutral-900 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#077fbd] focus:ring-1 focus:ring-[#077fbd]"
              >
                <option value="price-asc">Menor Preço</option>
                <option value="price-desc">Maior Preço</option>
                <option value="name-asc">Nome (A - Z)</option>
                <option value="name-desc">Nome (Z - A)</option>
              </select>
            </div>

            <div class="space-y-3">
              <span class="block text-xs font-bold uppercase tracking-wider text-neutral-700">Tipo de Máquina</span>
              <div class="space-y-2">
                @for (category of availableCategories(); track category) {
                  <label class="flex items-center gap-3 py-1 text-sm text-neutral-800 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      [checked]="isCategorySelected(category)"
                      (change)="handleToggleCategory(category)"
                      class="w-5 h-5 rounded border-neutral-300 text-[#077fbd] focus:ring-[#077fbd] cursor-pointer"
                    />
                    <span>{{ category }}</span>
                  </label>
                }
              </div>
            </div>

            <div class="space-y-3">
              <span class="block text-xs font-bold uppercase tracking-wider text-neutral-700">Fabricante</span>
              <div class="space-y-2">
                @for (brand of availableBrands(); track brand) {
                  <label class="flex items-center gap-3 py-1 text-sm text-neutral-800 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      [checked]="isBrandSelected(brand)"
                      (change)="handleToggleBrand(brand)"
                      class="w-5 h-5 rounded border-neutral-300 text-[#077fbd] focus:ring-[#077fbd] cursor-pointer"
                    />
                    <span>{{ brand }}</span>
                  </label>
                }
              </div>
            </div>

            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold uppercase tracking-wider text-neutral-700">Preço Máximo</span>
                <span class="text-sm font-bold text-[#077fbd]">
                  {{ formatPrice(currentEffectiveMaxPrice()) }}
                </span>
              </div>
              <input
                type="range"
                [min]="minPriceBound()"
                [max]="maxPriceBound()"
                [step]="50"
                [value]="currentEffectiveMaxPrice()"
                (input)="handlePriceSlider($event)"
                aria-label="Filtro de preço máximo mobile"
                class="w-full accent-[#077fbd] cursor-pointer h-2"
              />
            </div>
          </div>

          <div class="p-4 border-t border-neutral-200 bg-neutral-50 flex items-center gap-3">
            <button
              type="button"
              (click)="handleResetAll()"
              class="flex-1 py-3 px-4 rounded-lg border border-neutral-300 bg-white hover:bg-neutral-100 text-xs font-bold uppercase tracking-wider text-neutral-800 transition-colors cursor-pointer"
            >
              Limpar
            </button>
            <button
              type="button"
              (click)="handleCloseDrawer()"
              class="flex-2 py-3 px-4 rounded-lg bg-[#077fbd] hover:bg-[#066a9e] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Ver {{ totalResultsCount() }} Resultados
            </button>
          </div>
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown.escape)': 'onEscapeKeyDown()'
  }
})
export class CatalogFiltersComponent {
  readonly filters = input<ProductFilterState>(DEFAULT_FILTER_STATE);
  readonly availableBrands = input<string[]>([]);
  readonly availableCategories = input<string[]>([]);
  readonly minPriceBound = input<number>(0);
  readonly maxPriceBound = input<number>(10000);
  readonly isMobileDrawerOpen = input<boolean>(false);
  readonly totalResultsCount = input<number>(0);

  readonly filtersChange = output<ProductFilterState>();
  readonly closeDrawer = output<void>();
  readonly resetFilters = output<void>();

  protected readonly currentEffectiveMaxPrice = computed(() => {
    return this.filters().maxPrice ?? this.maxPriceBound();
  });

  protected readonly activeFilterCount = computed(() => {
    const f = this.filters();
    let count = 0;
    if (f.query.trim()) count++;
    count += f.brands.length;
    count += f.categories.length;
    if (f.maxPrice !== null) count++;
    return count;
  });

  protected readonly hasActiveFilters = computed(() => this.activeFilterCount() > 0);

  protected formatPrice(val: number): string {
    return val.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    });
  }

  protected isBrandSelected(brand: string): boolean {
    return this.filters().brands.includes(brand);
  }

  protected isCategorySelected(category: string): boolean {
    return this.filters().categories.includes(category);
  }

  protected handleToggleBrand(brand: string): void {
    const current = this.filters().brands;
    const nextBrands = current.includes(brand)
      ? current.filter((b) => b !== brand)
      : [...current, brand];

    this.filtersChange.emit({
      ...this.filters(),
      brands: nextBrands
    });
  }

  protected handleToggleCategory(category: string): void {
    const current = this.filters().categories;
    const nextCategories = current.includes(category)
      ? current.filter((c) => c !== category)
      : [...current, category];

    this.filtersChange.emit({
      ...this.filters(),
      categories: nextCategories
    });
  }

  protected handlePriceSlider(event: Event): void {
    const val = Number((event.target as HTMLInputElement).value);
    const maxBound = this.maxPriceBound();
    const newMax = val >= maxBound ? null : val;

    this.filtersChange.emit({
      ...this.filters(),
      maxPrice: newMax
    });
  }

  protected handleRemovePrice(): void {
    this.filtersChange.emit({
      ...this.filters(),
      maxPrice: null
    });
  }

  protected handleQueryInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.filtersChange.emit({
      ...this.filters(),
      query: val
    });
  }

  protected handleRemoveQuery(): void {
    this.filtersChange.emit({
      ...this.filters(),
      query: ''
    });
  }

  protected handleSortChange(event: Event): void {
    const val = (event.target as HTMLInputElement).value as ProductSortOption;
    this.filtersChange.emit({
      ...this.filters(),
      sortBy: val
    });
  }

  protected handleResetAll(): void {
    this.resetFilters.emit();
    this.filtersChange.emit({
      ...DEFAULT_FILTER_STATE,
      sortBy: this.filters().sortBy
    });
  }

  protected handleCloseDrawer(): void {
    this.closeDrawer.emit();
  }

  protected onEscapeKeyDown(): void {
    if (this.isMobileDrawerOpen()) {
      this.handleCloseDrawer();
    }
  }
}
