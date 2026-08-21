import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../../../core/models/product.model';

export type SortColumn = 'sku' | 'name' | 'brand' | 'category' | 'price' | 'isFeatured';
export type SortDirection = 'asc' | 'desc';

@Component({
  selector: 'app-admin-product-table',
  imports: [RouterLink],
  template: `
    <section class="bg-white border border-neutral-200 rounded-xl shadow-2xs overflow-hidden space-y-0" aria-label="Tabela de Produtos">
      <div class="p-4 sm:p-5 border-b border-neutral-200 bg-white flex flex-col gap-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 class="text-lg font-bold text-neutral-900 leading-tight">Estoque & Catálogo de Produtos</h2>
            <p class="text-xs text-neutral-500 mt-0.5">
              Gerencie os modelos cadastrados no protótipo em tempo real.
            </p>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              (click)="create.emit()"
              class="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-[#077fbd] hover:bg-[#066a9e] text-white transition-colors cursor-pointer shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#077fbd]"
              aria-label="Cadastrar novo produto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4" aria-hidden="true"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
              <span>Novo Produto</span>
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
          <div class="relative">
            <label for="admin-search-input" class="sr-only">Buscar produto</label>
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
            <input
              id="admin-search-input"
              type="search"
              [value]="searchQuery()"
              (input)="handleSearchInput($event)"
              placeholder="Filtrar por nome, SKU, marca..."
              class="w-full pl-9 pr-8 py-2 text-xs bg-[#f5f5f7] border border-neutral-200 rounded-lg text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#077fbd] focus:bg-white transition-all"
            />
            @if (searchQuery()) {
              <button
                type="button"
                (click)="clearSearch()"
                class="absolute inset-y-0 right-0 pr-2.5 flex items-center text-neutral-400 hover:text-neutral-700 cursor-pointer"
                aria-label="Limpar busca"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
              </button>
            }
          </div>

          <div>
            <label for="admin-brand-filter" class="sr-only">Filtrar por marca</label>
            <select
              id="admin-brand-filter"
              [value]="selectedBrand()"
              (change)="handleBrandChange($event)"
              class="w-full py-2 px-3 text-xs bg-[#f5f5f7] border border-neutral-200 rounded-lg text-neutral-800 focus:outline-none focus:border-[#077fbd] focus:bg-white transition-all cursor-pointer"
            >
              <option value="all">Todas as Marcas ({{ brands().length }})</option>
              @for (brand of brands(); track brand) {
                <option [value]="brand">{{ brand }}</option>
              }
            </select>
          </div>

          <div>
            <label for="admin-category-filter" class="sr-only">Filtrar por categoria</label>
            <select
              id="admin-category-filter"
              [value]="selectedCategory()"
              (change)="handleCategoryChange($event)"
              class="w-full py-2 px-3 text-xs bg-[#f5f5f7] border border-neutral-200 rounded-lg text-neutral-800 focus:outline-none focus:border-[#077fbd] focus:bg-white transition-all cursor-pointer"
            >
              <option value="all">Todas as Categorias ({{ categories().length }})</option>
              @for (category of categories(); track category) {
                <option [value]="category">{{ category }}</option>
              }
            </select>
          </div>

          <div class="flex items-center justify-between sm:justify-end gap-2">
            <span class="text-xs text-neutral-500 font-mono">
              {{ filteredProducts().length }} de {{ products().length }} itens
            </span>
            @if (hasActiveFilters()) {
              <button
                type="button"
                (click)="resetFilters()"
                class="text-xs text-[#0573cc] hover:underline font-semibold cursor-pointer"
              >
                Limpar Filtros
              </button>
            }
          </div>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs border-collapse" aria-label="Lista de Produtos do Catálogo">
          <thead>
            <tr class="bg-[#f5f5f7] text-neutral-600 border-b border-neutral-200 font-bold uppercase tracking-wider text-[11px] select-none">
              <th scope="col" class="py-3 px-3.5 w-16">Item</th>
              <th scope="col" class="py-3 px-3.5" [attr.aria-sort]="getAriaSort('sku')">
                <button
                  type="button"
                  (click)="toggleSort('sku')"
                  class="inline-flex items-center gap-1.5 hover:text-neutral-900 transition-colors cursor-pointer font-bold focus-visible:outline-none focus-visible:text-[#077fbd]"
                  aria-label="Ordenar por SKU"
                >
                  <span>SKU</span>
                  <span [class]="getSortIconClass('sku')">
                    @if (sortColumn() === 'sku' && sortDirection() === 'asc') {
                      ▲
                    } @else if (sortColumn() === 'sku' && sortDirection() === 'desc') {
                      ▼
                    } @else {
                      ↕
                    }
                  </span>
                </button>
              </th>
              <th scope="col" class="py-3 px-3.5" [attr.aria-sort]="getAriaSort('name')">
                <button
                  type="button"
                  (click)="toggleSort('name')"
                  class="inline-flex items-center gap-1.5 hover:text-neutral-900 transition-colors cursor-pointer font-bold focus-visible:outline-none focus-visible:text-[#077fbd]"
                  aria-label="Ordenar por Nome do Produto"
                >
                  <span>Produto</span>
                  <span [class]="getSortIconClass('name')">
                    @if (sortColumn() === 'name' && sortDirection() === 'asc') {
                      ▲
                    } @else if (sortColumn() === 'name' && sortDirection() === 'desc') {
                      ▼
                    } @else {
                      ↕
                    }
                  </span>
                </button>
              </th>
              <th scope="col" class="py-3 px-3.5 hidden md:table-cell" [attr.aria-sort]="getAriaSort('brand')">
                <button
                  type="button"
                  (click)="toggleSort('brand')"
                  class="inline-flex items-center gap-1.5 hover:text-neutral-900 transition-colors cursor-pointer font-bold focus-visible:outline-none focus-visible:text-[#077fbd]"
                  aria-label="Ordenar por Marca"
                >
                  <span>Marca</span>
                  <span [class]="getSortIconClass('brand')">
                    @if (sortColumn() === 'brand' && sortDirection() === 'asc') {
                      ▲
                    } @else if (sortColumn() === 'brand' && sortDirection() === 'desc') {
                      ▼
                    } @else {
                      ↕
                    }
                  </span>
                </button>
              </th>
              <th scope="col" class="py-3 px-3.5 hidden sm:table-cell" [attr.aria-sort]="getAriaSort('category')">
                <button
                  type="button"
                  (click)="toggleSort('category')"
                  class="inline-flex items-center gap-1.5 hover:text-neutral-900 transition-colors cursor-pointer font-bold focus-visible:outline-none focus-visible:text-[#077fbd]"
                  aria-label="Ordenar por Categoria"
                >
                  <span>Categoria</span>
                  <span [class]="getSortIconClass('category')">
                    @if (sortColumn() === 'category' && sortDirection() === 'asc') {
                      ▲
                    } @else if (sortColumn() === 'category' && sortDirection() === 'desc') {
                      ▼
                    } @else {
                      ↕
                    }
                  </span>
                </button>
              </th>
              <th scope="col" class="py-3 px-3.5 text-right" [attr.aria-sort]="getAriaSort('price')">
                <button
                  type="button"
                  (click)="toggleSort('price')"
                  class="inline-flex items-center gap-1.5 hover:text-neutral-900 transition-colors cursor-pointer font-bold focus-visible:outline-none focus-visible:text-[#077fbd] ml-auto"
                  aria-label="Ordenar por Preço"
                >
                  <span>Preço</span>
                  <span [class]="getSortIconClass('price')">
                    @if (sortColumn() === 'price' && sortDirection() === 'asc') {
                      ▲
                    } @else if (sortColumn() === 'price' && sortDirection() === 'desc') {
                      ▼
                    } @else {
                      ↕
                    }
                  </span>
                </button>
              </th>
              <th scope="col" class="py-3 px-3.5 text-center w-28">Status</th>
              <th scope="col" class="py-3 px-3.5 text-right w-36">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-200">
            @for (product of paginatedProducts(); track product.id) {
              <tr class="hover:bg-neutral-50/80 transition-colors">
                <td class="py-2.5 px-3.5">
                  <div class="w-10 h-10 rounded bg-[#f5f5f7] border border-neutral-200 flex items-center justify-center overflow-hidden shrink-0">
                    @if (product.images.length > 0) {
                      <img
                        [src]="product.images[0]"
                        [alt]="product.name"
                        class="w-full h-full object-contain p-0.5"
                        loading="lazy"
                      />
                    } @else {
                      <span class="text-[10px] text-neutral-400 font-mono">SEM FOTO</span>
                    }
                  </div>
                </td>
                <td class="py-2.5 px-3.5 font-mono text-[11px] font-bold text-neutral-700 whitespace-nowrap">
                  {{ product.sku }}
                </td>
                <td class="py-2.5 px-3.5">
                  <div class="max-w-xs sm:max-w-sm lg:max-w-md">
                    <a
                      [routerLink]="['/produto', product.id]"
                      target="_blank"
                      class="font-bold text-neutral-900 hover:text-[#0573cc] hover:underline line-clamp-1 leading-snug"
                      [title]="product.name"
                    >
                      {{ product.name }}
                    </a>
                    <span class="text-[11px] text-neutral-500 line-clamp-1 block">
                      {{ product.shortDescription }}
                    </span>
                  </div>
                </td>
                <td class="py-2.5 px-3.5 hidden md:table-cell text-neutral-700 font-medium whitespace-nowrap">
                  <span class="px-2 py-0.5 rounded text-[11px] bg-neutral-100 border border-neutral-200">
                    {{ product.brand }}
                  </span>
                </td>
                <td class="py-2.5 px-3.5 hidden sm:table-cell text-neutral-700 whitespace-nowrap">
                  {{ product.category }}
                </td>
                <td class="py-2.5 px-3.5 text-right font-mono font-bold text-neutral-900 whitespace-nowrap">
                  {{ formatPrice(product.price) }}
                </td>
                <td class="py-2.5 px-3.5 text-center whitespace-nowrap">
                  @if (product.isFeatured) {
                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      ★ Destaque
                    </span>
                  } @else {
                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-neutral-100 text-neutral-600 border border-neutral-200">
                      Padrão
                    </span>
                  }
                </td>
                <td class="py-2.5 px-3.5 text-right whitespace-nowrap">
                  @if (deleteConfirmId() === product.id) {
                    <div class="inline-flex items-center gap-1 bg-red-50 p-1 rounded-lg border border-red-200">
                      <span class="text-[10px] text-red-700 font-bold px-1">Excluir?</span>
                      <button
                        type="button"
                        (click)="confirmDelete(product.id)"
                        class="px-2 py-1 text-[10px] font-bold rounded bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                        aria-label="Confirmar exclusão de produto"
                      >
                        Sim
                      </button>
                      <button
                        type="button"
                        (click)="cancelDelete()"
                        class="px-2 py-1 text-[10px] font-semibold rounded bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-300 cursor-pointer"
                        aria-label="Cancelar exclusão de produto"
                      >
                        Não
                      </button>
                    </div>
                  } @else {
                    <div class="inline-flex items-center gap-1">
                      <button
                        type="button"
                        (click)="edit.emit(product)"
                        class="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#077fbd]"
                        [attr.aria-label]="'Editar ' + product.name"
                        title="Editar Produto"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                      </button>

                      <a
                        [routerLink]="['/produto', product.id]"
                        target="_blank"
                        class="p-1.5 text-neutral-600 hover:text-[#0573cc] hover:bg-neutral-100 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#077fbd]"
                        [attr.aria-label]="'Visualizar ' + product.name + ' na loja'"
                        title="Ver no Catálogo"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
                      </a>

                      <button
                        type="button"
                        (click)="requestDelete(product.id)"
                        class="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                        [attr.aria-label]="'Excluir ' + product.name"
                        title="Excluir Produto"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                      </button>
                    </div>
                  }
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="8" class="py-12 px-4 text-center">
                  <div class="max-w-xs mx-auto space-y-3 text-neutral-500">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="w-10 h-10 mx-auto text-neutral-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    <p class="text-sm font-semibold text-neutral-800">Nenhum produto encontrado</p>
                    <p class="text-xs">Tente ajustar seus termos de busca ou filtros aplicados.</p>
                    @if (hasActiveFilters()) {
                      <button
                        type="button"
                        (click)="resetFilters()"
                        class="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-colors border border-neutral-200 cursor-pointer"
                      >
                        Restaurar Filtros
                      </button>
                    }
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <div class="p-3.5 sm:p-4 border-t border-neutral-200 bg-[#f5f5f7] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div class="flex items-center gap-3 text-neutral-600">
          <span>
            Mostrando
            <strong class="text-neutral-900 font-mono">{{ totalCount() > 0 ? startItemIndex() : 0 }}</strong>
            a
            <strong class="text-neutral-900 font-mono">{{ endItemIndex() }}</strong>
            de
            <strong class="text-neutral-900 font-mono">{{ totalCount() }}</strong>
            registros
          </span>

          <div class="hidden sm:flex items-center gap-1.5 ml-2 pl-3 border-l border-neutral-300">
            <label for="admin-page-size" class="text-neutral-500">Exibir:</label>
            <select
              id="admin-page-size"
              [value]="itemsPerPage()"
              (change)="handlePageSizeChange($event)"
              class="py-1 px-2 text-xs bg-white border border-neutral-200 rounded text-neutral-800 focus:outline-none focus:border-[#077fbd]"
            >
              <option [value]="5">5 por pág.</option>
              <option [value]="10">10 por pág.</option>
              <option [value]="20">20 por pág.</option>
            </select>
          </div>
        </div>

        @if (totalPages() > 1) {
          <nav aria-label="Paginação da Tabela de Produtos" class="inline-flex items-center gap-1">
            <button
              type="button"
              (click)="goToPage(currentPage() - 1)"
              [disabled]="currentPage() === 1"
              class="px-2.5 py-1.5 rounded bg-white hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed border border-neutral-200 font-medium text-neutral-700 cursor-pointer"
              aria-label="Página anterior"
            >
              Anterior
            </button>

            @for (page of pagesArray(); track page) {
              <button
                type="button"
                (click)="goToPage(page)"
                [attr.aria-current]="page === currentPage() ? 'page' : null"
                class="w-7 h-7 rounded font-mono font-bold transition-colors cursor-pointer text-center text-xs"
                [class.bg-[#077fbd]]="page === currentPage()"
                [class.text-white]="page === currentPage()"
                [class.bg-white]="page !== currentPage()"
                [class.text-neutral-800]="page !== currentPage()"
                [class.border]="page !== currentPage()"
                [class.border-neutral-200]="page !== currentPage()"
                [class.hover:bg-neutral-100]="page !== currentPage()"
                [attr.aria-label]="'Ir para página ' + page"
              >
                {{ page }}
              </button>
            }

            <button
              type="button"
              (click)="goToPage(currentPage() + 1)"
              [disabled]="currentPage() === totalPages()"
              class="px-2.5 py-1.5 rounded bg-white hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed border border-neutral-200 font-medium text-neutral-700 cursor-pointer"
              aria-label="Próxima página"
            >
              Próxima
            </button>
          </nav>
        }
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminProductTableComponent {
  readonly products = input<Product[]>([]);
  readonly brands = input<string[]>([]);
  readonly categories = input<string[]>([]);

  readonly edit = output<Product>();
  readonly delete = output<string>();
  readonly create = output<void>();

  readonly searchQuery = signal<string>('');
  readonly selectedBrand = signal<string>('all');
  readonly selectedCategory = signal<string>('all');
  readonly sortColumn = signal<SortColumn>('name');
  readonly sortDirection = signal<SortDirection>('asc');
  readonly currentPage = signal<number>(1);
  readonly itemsPerPage = signal<number>(10);
  readonly deleteConfirmId = signal<string | null>(null);

  readonly hasActiveFilters = computed<boolean>(() => {
    return (
      this.searchQuery().trim().length > 0 ||
      this.selectedBrand() !== 'all' ||
      this.selectedCategory() !== 'all'
    );
  });

  readonly filteredProducts = computed<Product[]>(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const brand = this.selectedBrand();
    const category = this.selectedCategory();
    const col = this.sortColumn();
    const dir = this.sortDirection();

    let result = this.products().filter((product) => {
      const matchesQuery =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query);

      const matchesBrand = brand === 'all' || product.brand === brand;
      const matchesCategory = category === 'all' || product.category === category;

      return matchesQuery && matchesBrand && matchesCategory;
    });

    result = [...result].sort((a, b) => {
      let comparison = 0;
      switch (col) {
        case 'sku':
          comparison = a.sku.localeCompare(b.sku);
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'brand':
          comparison = a.brand.localeCompare(b.brand);
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'isFeatured':
          comparison = (a.isFeatured ? 1 : 0) - (b.isFeatured ? 1 : 0);
          break;
      }
      return dir === 'asc' ? comparison : -comparison;
    });

    return result;
  });

  readonly totalCount = computed<number>(() => this.filteredProducts().length);

  readonly totalPages = computed<number>(() => {
    return Math.ceil(this.totalCount() / this.itemsPerPage()) || 1;
  });

  readonly pagesArray = computed<number[]>(() => {
    const total = this.totalPages();
    return Array.from({ length: total }, (_, i) => i + 1);
  });

  readonly startItemIndex = computed<number>(() => {
    return (this.currentPage() - 1) * this.itemsPerPage() + 1;
  });

  readonly endItemIndex = computed<number>(() => {
    return Math.min(this.currentPage() * this.itemsPerPage(), this.totalCount());
  });

  readonly paginatedProducts = computed<Product[]>(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage();
    return this.filteredProducts().slice(start, start + this.itemsPerPage());
  });

  formatPrice(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  handleSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
    this.currentPage.set(1);
  }

  clearSearch(): void {
    this.searchQuery.set('');
    this.currentPage.set(1);
  }

  handleBrandChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedBrand.set(select.value);
    this.currentPage.set(1);
  }

  handleCategoryChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedCategory.set(select.value);
    this.currentPage.set(1);
  }

  handlePageSizeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.itemsPerPage.set(Number(select.value));
    this.currentPage.set(1);
  }

  toggleSort(column: SortColumn): void {
    if (this.sortColumn() === column) {
      this.sortDirection.update((dir) => (dir === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('asc');
    }
  }

  getAriaSort(column: SortColumn): 'ascending' | 'descending' | 'none' {
    if (this.sortColumn() !== column) {
      return 'none';
    }
    return this.sortDirection() === 'asc' ? 'ascending' : 'descending';
  }

  getSortIconClass(column: SortColumn): string {
    if (this.sortColumn() === column) {
      return 'text-[#077fbd] font-bold text-[10px]';
    }
    return 'text-neutral-400 text-[10px]';
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  resetFilters(): void {
    this.searchQuery.set('');
    this.selectedBrand.set('all');
    this.selectedCategory.set('all');
    this.currentPage.set(1);
  }

  requestDelete(id: string): void {
    this.deleteConfirmId.set(id);
  }

  cancelDelete(): void {
    this.deleteConfirmId.set(null);
  }

  confirmDelete(id: string): void {
    this.delete.emit(id);
    this.deleteConfirmId.set(null);
  }
}
