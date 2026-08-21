import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-cart-drawer',
  imports: [RouterLink],
  template: `
    @if (cartService.isDrawerOpen()) {
      <div
        class="fixed inset-0 bg-black/60 z-50 backdrop-blur-xs transition-opacity duration-200"
        (click)="close()"
        aria-hidden="true"
      ></div>

      <aside
        id="cart-drawer-panel"
        class="fixed inset-y-0 right-0 z-50 w-full sm:max-w-md bg-white shadow-2xl flex flex-col border-l border-neutral-200 transform transition-transform duration-300"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
      >
        <div class="p-4 sm:px-6 py-4 bg-[#101010] text-white flex items-center justify-between border-b border-neutral-800 shrink-0">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-[#077fbd] flex items-center justify-center text-white shadow-xs">
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
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>
            <div>
              <h2 id="cart-drawer-title" class="text-sm sm:text-base font-bold text-white leading-tight">
                Cotação de Equipamentos
              </h2>
              <span class="text-[11px] text-neutral-400 font-mono">
                {{ cartService.totalCount() }} {{ cartService.totalCount() === 1 ? 'item' : 'itens' }}
              </span>
            </div>
          </div>

          <button
            type="button"
            (click)="close()"
            class="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#077fbd]"
            aria-label="Fechar carrinho de cotação"
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
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        @if (cartService.isEmpty()) {
          <div class="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#f5f5f7]">
            <div class="w-20 h-20 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-neutral-400 shadow-inner mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="w-10 h-10"
                aria-hidden="true"
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>
            <h3 class="text-base font-bold text-neutral-900 mb-1">
              Sua cotação está vazia
            </h3>
            <p class="text-xs text-neutral-500 max-w-xs mb-6 leading-relaxed">
              Adicione máquinas industriais e insumos do catálogo para solicitar uma proposta comercial com faturamento PJ.
            </p>
            <button
              type="button"
              (click)="navigateToCatalog()"
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#077fbd] hover:bg-[#066a9e] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#077fbd]"
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
                <rect width="7" height="7" x="3" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="14" rx="1" />
                <rect width="7" height="7" x="3" y="14" rx="1" />
              </svg>
              <span>Ver Catálogo de Máquinas</span>
            </button>
          </div>
        } @else {
          <div class="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#f5f5f7]">
            @for (item of cartService.items(); track item.product.id) {
              <div class="bg-white border border-neutral-200 rounded-xl p-4 shadow-2xs flex gap-3 sm:gap-4 relative">
                <div class="w-20 h-20 sm:w-22 sm:h-22 bg-[#f5f5f7] rounded-lg border border-neutral-100 p-2 shrink-0 flex items-center justify-center overflow-hidden">
                  @if (item.product.images.length > 0 && !hasImageError(item.product.id)) {
                    <img
                      [src]="item.product.images[0]"
                      [alt]="item.product.name"
                      (error)="handleImageError(item.product.id)"
                      class="w-full h-full object-contain"
                    />
                  } @else {
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.5"
                      class="w-8 h-8 text-[#0573cc]"
                      aria-hidden="true"
                    >
                      <rect x="2" y="6" width="20" height="12" rx="2" />
                      <path d="M6 12h.01" />
                      <path d="M10 12h.01" />
                      <path d="M14 12h.01" />
                      <path d="M18 12h.01" />
                      <path d="M12 2v4" />
                      <path d="M12 18v4" />
                    </svg>
                  }
                </div>

                <div class="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div class="flex items-center gap-1.5 mb-1">
                      <span class="text-[10px] font-mono font-bold uppercase tracking-wider bg-neutral-900 text-white px-1.5 py-0.2 rounded">
                        {{ item.product.brand }}
                      </span>
                      <span class="text-[10px] font-mono text-neutral-500 bg-neutral-100 px-1.5 py-0.2 rounded border border-neutral-200">
                        {{ item.product.sku }}
                      </span>
                    </div>

                    <h4 class="text-xs sm:text-sm font-bold text-neutral-900 leading-snug line-clamp-2">
                      <a
                        [routerLink]="['/produto', item.product.id]"
                        (click)="close()"
                        class="hover:text-[#0573cc] transition-colors focus-visible:outline-none focus-visible:underline"
                      >
                        {{ item.product.name }}
                      </a>
                    </h4>

                    <span class="text-[11px] text-neutral-500 font-medium">
                      {{ formatPrice(item.product.price) }} / un.
                    </span>
                  </div>

                  <div class="flex items-center justify-between pt-2 mt-2 border-t border-neutral-100">
                    <div class="inline-flex items-center border border-neutral-300 rounded-lg bg-neutral-50">
                      <button
                        type="button"
                        (click)="decrementQuantity(item.product.id, item.quantity)"
                        class="p-1 sm:p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200 rounded-l-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#077fbd]"
                        [attr.aria-label]="'Diminuir quantidade de ' + item.product.name"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="w-3.5 h-3.5"
                          aria-hidden="true"
                        >
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </button>

                      <span class="px-2.5 sm:px-3 text-xs font-bold text-neutral-900 tabular-nums">
                        {{ item.quantity }}
                      </span>

                      <button
                        type="button"
                        (click)="incrementQuantity(item.product.id, item.quantity)"
                        class="p-1 sm:p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200 rounded-r-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#077fbd]"
                        [attr.aria-label]="'Aumentar quantidade de ' + item.product.name"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="w-3.5 h-3.5"
                          aria-hidden="true"
                        >
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </button>
                    </div>

                    <div class="flex items-center gap-3">
                      <span class="text-xs sm:text-sm font-black text-neutral-900">
                        {{ formatPrice(item.product.price * item.quantity) }}
                      </span>

                      <button
                        type="button"
                        (click)="removeItem(item.product.id)"
                        class="text-neutral-400 hover:text-red-600 p-1 rounded transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-500"
                        [attr.aria-label]="'Remover ' + item.product.name + ' da cotação'"
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
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>

          <div class="p-4 sm:p-6 bg-white border-t border-neutral-200 space-y-4 shrink-0 shadow-lg">
            <div class="space-y-1.5">
              @if (authService.isAuthenticated()) {
                <div class="px-3 py-1.5 bg-neutral-100 rounded-lg text-[11px] text-neutral-600 flex items-center justify-between">
                  <span>Faturamento: <strong class="text-neutral-900">{{ authService.currentUser()?.name }}</strong></span>
                  @if (authService.currentUser()?.cnpjCpf) {
                    <span class="font-mono text-neutral-500">{{ authService.currentUser()?.cnpjCpf }}</span>
                  }
                </div>
              }

              <div class="flex items-center justify-between text-xs text-neutral-500 font-medium">
                <span>Itens na Cotação</span>
                <span class="font-mono">{{ cartService.totalCount() }}</span>
              </div>
              <div class="flex items-baseline justify-between pt-1 border-t border-neutral-100">
                <span class="text-sm font-bold text-neutral-800">Total Estimado</span>
                <span class="text-xl sm:text-2xl font-black text-neutral-900">
                  {{ formatPrice(cartService.subtotal()) }}
                </span>
              </div>
              <p class="text-[11px] text-neutral-500 leading-tight">
                Valores base para faturamento PJ. Frete, impostos e condições BNDES confirmados via consultoria técnica.
              </p>
            </div>

            <div class="space-y-2">
              <a
                [href]="whatsAppQuoteUrl()"
                target="_blank"
                rel="noopener noreferrer"
                class="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]"
                aria-label="Finalizar orçamento via WhatsApp"
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
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span>Finalizar Orçamento via WhatsApp</span>
              </a>

              <div class="flex items-center justify-between pt-1">
                <button
                  type="button"
                  (click)="navigateToCatalog()"
                  class="text-xs font-semibold text-[#077fbd] hover:text-[#055780] transition-colors cursor-pointer py-1 focus-visible:outline-none focus-visible:underline"
                >
                  Adicionar mais máquinas
                </button>

                <button
                  type="button"
                  (click)="clearCart()"
                  class="text-xs font-medium text-neutral-400 hover:text-red-600 transition-colors cursor-pointer py-1 focus-visible:outline-none focus-visible:underline"
                >
                  Limpar tudo
                </button>
              </div>
            </div>
          </div>
        }
      </aside>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown.escape)': 'onEscape()'
  }
})
export class CartDrawerComponent {
  readonly cartService = inject(CartService);
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  private readonly failedImages = signal<Set<string>>(new Set());

  protected readonly whatsAppQuoteUrl = computed(() => {
    const user = this.authService.currentUser();
    return this.cartService.generateWhatsAppLink(
      '5511999999999',
      user ? { name: user.name, cnpjCpf: user.cnpjCpf } : undefined
    );
  });

  protected formatPrice(val: number): string {
    return val.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  protected hasImageError(productId: string): boolean {
    return this.failedImages().has(productId);
  }

  protected handleImageError(productId: string): void {
    this.failedImages.update((set) => {
      const updated = new Set(set);
      updated.add(productId);
      return updated;
    });
  }

  protected close(): void {
    this.cartService.closeDrawer();
  }

  protected onEscape(): void {
    if (this.cartService.isDrawerOpen()) {
      this.close();
    }
  }

  protected incrementQuantity(productId: string, currentQty: number): void {
    this.cartService.updateQuantity(productId, currentQty + 1);
  }

  protected decrementQuantity(productId: string, currentQty: number): void {
    this.cartService.updateQuantity(productId, currentQty - 1);
  }

  protected removeItem(productId: string): void {
    this.cartService.removeItem(productId);
  }

  protected clearCart(): void {
    this.cartService.clearCart();
  }

  protected navigateToCatalog(): void {
    this.close();
    this.router.navigate(['/catalogo']);
  }
}
