import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';
import { ProductService } from '../../../core/services/product.service';
import { MegaMenuComponent } from './mega-menu.component';

@Component({
  selector: 'app-header',
  imports: [RouterLink, MegaMenuComponent],
  template: `
    <header class="sticky top-0 z-50 bg-[#101010] text-white border-b border-neutral-800 shadow-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-6">
          <button
            type="button"
            (click)="toggleMobileMenu()"
            class="lg:hidden p-2 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#077fbd]"
            [attr.aria-expanded]="isMobileMenuOpen()"
            aria-controls="mobile-navigation"
            aria-label="Abrir menu de navegação"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="w-6 h-6"
              aria-hidden="true"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </button>

          <a
            routerLink="/"
            (click)="closeAllMenus()"
            class="flex items-center shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#077fbd] rounded-md p-1"
            aria-label="SKYTEC - Página Inicial"
          >
            <img
              src="/assets/LOGO-SKYTEC.avif"
              alt="SKYTEC Máquinas de Costura"
              class="h-10 sm:h-12 w-auto object-contain"
            />
          </a>

          <form
            (submit)="handleSearchSubmit($event)"
            role="search"
            class="hidden sm:block flex-1 max-w-md lg:max-w-lg relative transition-all duration-200"
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
              (click)="closeAllMenus()"
              class="inline-flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#077fbd]"
              aria-label="Minha Conta SKYTEC"
            >
              <div class="relative">
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
                @if (authService.isAuthenticated()) {
                  <span
                    class="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#101010]"
                    aria-hidden="true"
                  ></span>
                }
              </div>
              <span class="hidden sm:inline">
                {{ authService.isAuthenticated() ? (authService.currentUser()?.name?.split(' ')?.[0] || 'Conta') : 'Conta' }}
              </span>
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

        <nav class="hidden lg:flex items-center gap-8 py-2.5 border-t border-neutral-800/80 text-xs font-medium text-neutral-300">
          <button
            type="button"
            (click)="toggleMegaMenu()"
            (mouseenter)="isMegaMenuOpen.set(true)"
            [attr.aria-expanded]="isMegaMenuOpen()"
            aria-haspopup="true"
            class="hover:text-white transition-colors py-1 flex items-center gap-2 font-semibold text-white cursor-pointer focus-visible:outline-none focus-visible:text-[#0573cc]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            <span>Todas as Máquinas</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="w-3.5 h-3.5 transition-transform duration-200"
              [class.rotate-180]="isMegaMenuOpen()"
            >
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </button>

          <a
            routerLink="/catalogo"
            [queryParams]="{ categoria: 'Reta' }"
            (click)="closeAllMenus()"
            class="hover:text-white transition-colors py-1"
          >
            Retas Industriais
          </a>
          <a
            routerLink="/catalogo"
            [queryParams]="{ categoria: 'Overlock' }"
            (click)="closeAllMenus()"
            class="hover:text-white transition-colors py-1"
          >
            Overlocks
          </a>
          <a
            routerLink="/catalogo"
            [queryParams]="{ categoria: 'Galoneira' }"
            (click)="closeAllMenus()"
            class="hover:text-white transition-colors py-1"
          >
            Galoneiras
          </a>
          <a
            routerLink="/catalogo"
            [queryParams]="{ categoria: 'Corte' }"
            (click)="closeAllMenus()"
            class="hover:text-white transition-colors py-1"
          >
            Corte & Fardamento
          </a>
          <a
            routerLink="/catalogo"
            [queryParams]="{ marca: 'SKYMAK' }"
            (click)="closeAllMenus()"
            class="text-[#0573cc] font-bold hover:text-white transition-colors py-1 flex items-center gap-1"
          >
            Linha SKYMAK
          </a>

          <a
            routerLink="/sobre-nos"
            (click)="closeAllMenus()"
            class="hover:text-white transition-colors py-1 ml-auto"
          >
            Sobre Nós
          </a>
          <a
            routerLink="/admin"
            (click)="closeAllMenus()"
            class="hover:text-neutral-400 text-neutral-500 transition-colors py-1"
          >
            Admin Mock
          </a>
        </nav>
      </div>

      <app-mega-menu
        [isOpen]="isMegaMenuOpen()"
        (close)="isMegaMenuOpen.set(false)"
      />

      @if (isMobileMenuOpen()) {
        <div
          class="fixed inset-0 bg-black/70 z-50 lg:hidden backdrop-blur-xs transition-opacity duration-200"
          (click)="closeMobileMenu()"
          aria-hidden="true"
        ></div>

        <div
          id="mobile-navigation"
          class="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-[#101010] text-white z-50 lg:hidden shadow-2xl flex flex-col border-r border-neutral-800 transform transition-transform duration-300"
          role="dialog"
          aria-modal="true"
          aria-label="Menu de Navegação Principal"
        >
          <div class="p-4 border-b border-neutral-800 flex items-center justify-between">
            <a routerLink="/" (click)="closeMobileMenu()" class="flex items-center" aria-label="SKYTEC - Página Inicial">
              <img
                src="/assets/LOGO-SKYTEC.avif"
                alt="SKYTEC Máquinas de Costura"
                class="h-9 w-auto object-contain"
              />
            </a>

            <button
              type="button"
              (click)="closeMobileMenu()"
              class="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#077fbd]"
              aria-label="Fechar menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>

          <div class="p-4 border-b border-neutral-800">
            <form (submit)="handleSearchSubmit($event)" role="search">
              <input
                type="search"
                [value]="searchQuery()"
                (input)="handleSearchInput($event)"
                placeholder="Buscar máquinas..."
                class="w-full px-3.5 py-2 text-sm bg-neutral-900 text-white placeholder-neutral-400 border border-neutral-700 rounded-lg focus:outline-none focus:border-[#077fbd]"
              />
            </form>
          </div>

          <div class="flex-1 overflow-y-auto p-4 space-y-6">
            <div>
              <p class="text-[11px] font-bold uppercase tracking-wider text-[#0573cc] mb-3">
                Categorias Principais
              </p>
              <ul class="space-y-2 text-sm font-medium">
                <li>
                  <a
                    routerLink="/catalogo"
                    (click)="closeMobileMenu()"
                    class="block py-2 text-neutral-300 hover:text-white"
                  >
                    Ver Catálogo Completo
                  </a>
                </li>
                <li>
                  <a
                    routerLink="/catalogo"
                    [queryParams]="{ categoria: 'Reta' }"
                    (click)="closeMobileMenu()"
                    class="block py-2 text-neutral-300 hover:text-white"
                  >
                    Máquinas Retas Industriais
                  </a>
                </li>
                <li>
                  <a
                    routerLink="/catalogo"
                    [queryParams]="{ categoria: 'Overlock' }"
                    (click)="closeMobileMenu()"
                    class="block py-2 text-neutral-300 hover:text-white"
                  >
                    Overlocks & Interlocks
                  </a>
                </li>
                <li>
                  <a
                    routerLink="/catalogo"
                    [queryParams]="{ categoria: 'Galoneira' }"
                    (click)="closeMobileMenu()"
                    class="block py-2 text-neutral-300 hover:text-white"
                  >
                    Galoneiras / Colaretes
                  </a>
                </li>
                <li>
                  <a
                    routerLink="/catalogo"
                    [queryParams]="{ categoria: 'Corte' }"
                    (click)="closeMobileMenu()"
                    class="block py-2 text-neutral-300 hover:text-white"
                  >
                    Equipamentos de Corte
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p class="text-[11px] font-bold uppercase tracking-wider text-[#0573cc] mb-3">
                Marcas
              </p>
              <div class="flex flex-wrap gap-2">
                @for (brand of productService.brands(); track brand) {
                  <a
                    routerLink="/catalogo"
                    [queryParams]="{ marca: brand }"
                    (click)="closeMobileMenu()"
                    class="px-2.5 py-1 text-xs rounded-md bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700"
                  >
                    {{ brand }}
                  </a>
                }
              </div>
            </div>

            <div class="pt-4 border-t border-neutral-800 space-y-2 text-sm">
              <a
                routerLink="/sobre-nos"
                (click)="closeMobileMenu()"
                class="block py-2 text-neutral-300 hover:text-white font-medium"
              >
                Sobre Nós
              </a>
              <a
                routerLink="/conta"
                (click)="closeMobileMenu()"
                class="block py-2 text-neutral-300 hover:text-white font-medium"
              >
                Minha Conta
              </a>
              <a
                routerLink="/admin"
                (click)="closeMobileMenu()"
                class="block py-2 text-neutral-500 hover:text-neutral-400 font-medium"
              >
                Admin Mock
              </a>
            </div>
          </div>

          <div class="p-4 border-t border-neutral-800">
            <a
              [href]="cartService.generateWhatsAppLink()"
              target="_blank"
              rel="noopener noreferrer"
              class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#25D366] text-white text-xs font-bold uppercase tracking-wider"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              Consultor WhatsApp
            </a>
          </div>
        </div>
      }
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown.escape)': 'closeAllMenus()'
  }
})
export class HeaderComponent {
  private readonly router = inject(Router);
  readonly cartService = inject(CartService);
  readonly productService = inject(ProductService);
  readonly authService = inject(AuthService);

  readonly searchQuery = signal<string>('');
  readonly isSearchFocused = signal<boolean>(false);
  readonly isMegaMenuOpen = signal<boolean>(false);
  readonly isMobileMenuOpen = signal<boolean>(false);

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
    this.closeAllMenus();
    if (query) {
      this.router.navigate(['/catalogo'], { queryParams: { q: query } });
    } else {
      this.router.navigate(['/catalogo']);
    }
  }

  protected toggleMegaMenu(): void {
    this.isMegaMenuOpen.update((state) => !state);
  }

  protected toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((state) => !state);
  }

  protected closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  protected closeAllMenus(): void {
    this.isMegaMenuOpen.set(false);
    this.isMobileMenuOpen.set(false);
  }
}
