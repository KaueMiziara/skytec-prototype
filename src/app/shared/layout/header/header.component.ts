import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  template: `
    <header class="sticky top-0 z-50 bg-[#101010] text-white border-b border-neutral-800 shadow-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-6">
          <a
            routerLink="/"
            class="flex items-center gap-2.5 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#077fbd] rounded-md p-1"
            aria-label="SKYTEC - Página Inicial"
          >
            <div class="w-9 h-9 rounded-lg bg-[#0573cc] flex items-center justify-center text-white shadow-sm font-black text-xl tracking-tighter">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="w-5 h-5"
                aria-hidden="true"
              >
                <path d="M12 2v20" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <div class="flex flex-col">
              <span class="text-xl sm:text-2xl font-black tracking-tight leading-none text-white">
                SKY<span class="text-[#0573cc]">TEC</span>
              </span>
              <span class="text-[9px] uppercase tracking-widest text-neutral-400 font-semibold leading-tight">
                Máquinas & Insumos
              </span>
            </div>
          </a>

          <form
            (submit)="handleSearchSubmit($event)"
            role="search"
            class="flex-1 max-w-md lg:max-w-lg relative transition-all duration-200"
            [class.lg:max-w-xl]="isSearchFocused()"
          >
            <div class="relative w-full">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="w-4 h-4"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>

              <input
                type="search"
                name="search"
                [value]="searchQuery()"
                (input)="handleSearchInput($event)"
                (focus)="isSearchFocused.set(true)"
                (blur)="isSearchFocused.set(false)"
                placeholder="Buscar máquinas, categorias, marcas..."
                aria-label="Buscar produtos no catálogo"
                class="w-full pl-10 pr-10 py-2 sm:py-2.5 text-xs sm:text-sm bg-neutral-900 text-white placeholder-neutral-400 border border-neutral-700 rounded-lg focus:outline-none focus:border-[#077fbd] focus:ring-2 focus:ring-[#077fbd]/30 transition-all"
              />

              @if (searchQuery()) {
                <button
                  type="button"
                  (click)="clearSearch()"
                  aria-label="Limpar busca"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-white cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="w-4 h-4"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              }
            </div>
          </form>

          <div class="flex items-center gap-2 sm:gap-3 shrink-0">
            <a
              [href]="cartService.generateWhatsAppLink()"
              target="_blank"
              rel="noopener noreferrer"
              class="hidden md:inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white border border-[#25D366]/30 transition-colors text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]"
              aria-label="Falar com consultor via WhatsApp"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="w-4 h-4"
                aria-hidden="true"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>WhatsApp</span>
            </a>

            <a
              routerLink="/conta"
              class="inline-flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#077fbd]"
              aria-label="Minha Conta SKYTEC"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="w-5 h-5"
                aria-hidden="true"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span class="hidden sm:inline">Conta</span>
            </a>

            <button
              type="button"
              (click)="cartService.toggleDrawer()"
              class="relative inline-flex items-center gap-2 p-2 sm:px-3.5 sm:py-2 rounded-lg bg-[#077fbd] hover:bg-[#066a9e] text-white transition-colors text-xs font-semibold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#077fbd]"
              aria-label="Abrir carrinho de cotação"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="w-5 h-5"
                aria-hidden="true"
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <span class="hidden sm:inline">Cotação</span>

              @if (cartService.totalCount() > 0) {
                <span
                  class="absolute -top-1.5 -right-1.5 sm:relative sm:top-0 sm:right-0 bg-white text-[#101010] text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-xs"
                >
                  {{ cartService.totalCount() }}
                </span>
              }
            </button>
          </div>
        </div>

        <nav class="hidden sm:flex items-center gap-6 py-2.5 border-t border-neutral-800/80 text-xs font-medium text-neutral-300">
          <a
            routerLink="/catalogo"
            class="hover:text-white transition-colors py-1 flex items-center gap-1.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
            Catálogo Completo
          </a>
          <a
            routerLink="/catalogo"
            [queryParams]="{ categoria: 'Reta' }"
            class="hover:text-white transition-colors py-1"
          >
            Retas
          </a>
          <a
            routerLink="/catalogo"
            [queryParams]="{ categoria: 'Overlock' }"
            class="hover:text-white transition-colors py-1"
          >
            Overlocks
          </a>
          <a
            routerLink="/catalogo"
            [queryParams]="{ categoria: 'Galoneira' }"
            class="hover:text-white transition-colors py-1"
          >
            Galoneiras
          </a>
          <a
            routerLink="/catalogo"
            [queryParams]="{ categoria: 'Corte' }"
            class="hover:text-white transition-colors py-1"
          >
            Corte & Fardamento
          </a>
          <a
            routerLink="/sobre-nos"
            class="hover:text-white transition-colors py-1 ml-auto"
          >
            Sobre Nós
          </a>
          <a
            routerLink="/admin"
            class="hover:text-neutral-400 text-neutral-500 transition-colors py-1"
          >
            Admin Mock
          </a>
        </nav>
      </div>
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  private readonly router = inject(Router);
  readonly cartService = inject(CartService);

  readonly searchQuery = signal<string>('');
  readonly isSearchFocused = signal<boolean>(false);

  protected handleSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  protected clearSearch(): void {
    this.searchQuery.set('');
  }

  protected handleSearchSubmit(event: Event): void {
    event.preventDefault();
    const query = this.searchQuery().trim();
    if (query) {
      this.router.navigate(['/catalogo'], { queryParams: { q: query } });
    } else {
      this.router.navigate(['/catalogo']);
    }
  }
}
