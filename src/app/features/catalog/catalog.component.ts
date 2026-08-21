import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Product, ProductFilterState } from '../../core/models/product.model';
import { CartService } from '../../core/services/cart.service';
import { CatalogFiltersComponent } from './components/catalog-filters/catalog-filters.component';
import { CatalogStateService } from './services/catalog-state.service';
import { ProductCardComponent } from '../../shared/ui/product-card/product-card.component';

@Component({
  selector: 'app-catalog',
  imports: [RouterLink, CatalogFiltersComponent, ProductCardComponent],
  template: `
    <main class="min-h-screen bg-[#f5f5f7] py-6 sm:py-8 lg:py-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" class="mb-4 sm:mb-6">
          <ol class="flex items-center gap-2 text-xs text-neutral-500">
            <li>
              <a routerLink="/" class="hover:text-neutral-900 transition-colors focus-visible:outline-none focus-visible:underline">
                Início
              </a>
            </li>
            <li aria-hidden="true" class="text-neutral-400">/</li>
            <li class="font-semibold text-neutral-900" aria-current="page">
              Catálogo de Máquinas
            </li>
          </ol>
        </nav>

        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-neutral-200">
          <div>
            <h1 class="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
              Catálogo de Máquinas Industriais
            </h1>
            <p class="text-xs sm:text-sm text-neutral-500 mt-1">
              Equipamentos de alta tecnologia revisados com garantia e pronta entrega para todo o Brasil.
            </p>
          </div>

          <div class="flex items-center gap-3">
            <button
              type="button"
              (click)="catalogState.openMobileDrawer()"
              class="lg:hidden inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-neutral-300 text-neutral-900 text-xs font-bold uppercase tracking-wider shadow-xs hover:bg-neutral-50 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#077fbd]"
              aria-label="Abrir filtros"
            >
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
              <span>Filtros</span>
              @if (catalogState.activeFilterCount() > 0) {
                <span class="inline-flex items-center justify-center px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#077fbd] text-white">
                  {{ catalogState.activeFilterCount() }}
                </span>
              }
            </button>

            <span class="text-xs font-medium text-neutral-500">
              <strong class="text-neutral-900 font-bold">{{ catalogState.totalResultsCount() }}</strong>
              {{ catalogState.totalResultsCount() === 1 ? 'produto encontrado' : 'produtos encontrados' }}
            </span>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 items-start">
          <aside class="lg:col-span-1 lg:sticky lg:top-24">
            <app-catalog-filters
              [filters]="catalogState.filters()"
              [availableBrands]="catalogState.availableBrands()"
              [availableCategories]="catalogState.availableCategories()"
              [minPriceBound]="catalogState.minPriceBound()"
              [maxPriceBound]="catalogState.maxPriceBound()"
              [isMobileDrawerOpen]="catalogState.isMobileDrawerOpen()"
              [totalResultsCount]="catalogState.totalResultsCount()"
              (filtersChange)="handleFiltersChange($event)"
              (resetFilters)="handleResetFilters()"
              (closeDrawer)="catalogState.closeMobileDrawer()"
            />
          </aside>

          <div class="lg:col-span-3">
            @if (catalogState.filteredProducts().length > 0) {
              <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                @for (product of catalogState.filteredProducts(); track product.id) {
                  <app-product-card
                    [product]="product"
                    (addedToCart)="handleAddToCart($event)"
                  />
                }
              </div>
            } @else {
              <div class="bg-white border border-neutral-200 rounded-xl p-8 sm:p-12 text-center shadow-xs">
                <div class="w-16 h-16 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-400 flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8" aria-hidden="true">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    <line x1="8" y1="11" x2="14" y2="11" />
                  </svg>
                </div>

                <h2 class="text-lg font-bold text-neutral-900 mb-2">
                  Nenhuma máquina encontrada
                </h2>
                <p class="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto mb-6 leading-relaxed">
                  Não encontramos nenhum equipamento correspondente aos filtros selecionados. Tente ajustar os termos de busca ou remover alguns filtros.
                </p>

                <button
                  type="button"
                  (click)="handleResetFilters()"
                  class="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#077fbd] hover:bg-[#066a9e] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#077fbd]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4" aria-hidden="true">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                  </svg>
                  <span>Limpar Todos os Filtros</span>
                </button>
              </div>
            }
          </div>
        </div>
      </div>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CatalogComponent {
  private readonly route = inject(ActivatedRoute);
  readonly catalogState = inject(CatalogStateService);
  readonly cartService = inject(CartService);

  constructor() {
    this.route.queryParams.pipe(takeUntilDestroyed()).subscribe((params) => {
      if (Object.keys(params).length > 0) {
        this.catalogState.syncFromQueryParams(params);
      }
    });
  }

  protected handleFiltersChange(filters: ProductFilterState): void {
    this.catalogState.setFilters(filters);
  }

  protected handleResetFilters(): void {
    this.catalogState.resetFilters();
  }

  protected handleAddToCart(product: Product): void {
    this.cartService.addItem(product, 1);
    this.cartService.openDrawer();
  }
}
