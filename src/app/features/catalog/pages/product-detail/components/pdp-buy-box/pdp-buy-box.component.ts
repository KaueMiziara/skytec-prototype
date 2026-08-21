import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { AuthService } from '../../../../../../core/services/auth.service';
import { CartService } from '../../../../../../core/services/cart.service';
import { Product } from '../../../../../../core/models/product.model';

@Component({
  selector: 'app-pdp-buy-box',
  template: `
    <div class="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col justify-between h-full">
      <div class="space-y-6">
        <div>
          <div class="flex items-center justify-between gap-2 mb-3">
            <div class="flex items-center gap-2">
              <span class="inline-block px-2.5 py-1 rounded text-xs font-mono font-bold uppercase tracking-wider bg-neutral-900 text-white">
                {{ product().brand }}
              </span>
              <span class="inline-block px-2.5 py-1 rounded text-xs font-semibold uppercase tracking-wider bg-[#0573cc]/10 text-[#0573cc] border border-[#0573cc]/20">
                {{ product().category }}
              </span>
            </div>
            <span class="text-xs font-mono text-neutral-500 font-semibold bg-neutral-100 px-2 py-1 rounded border border-neutral-200">
              SKU: {{ product().sku }}
            </span>
          </div>

          <h1 class="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight leading-tight">
            {{ product().name }}
          </h1>

          <p class="text-xs sm:text-sm text-neutral-600 leading-relaxed mt-3">
            {{ product().shortDescription }}
          </p>
        </div>

        <div class="p-4 sm:p-5 bg-[#f5f5f7] border border-neutral-200/80 rounded-xl space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Valor Unitário Estimado
            </span>
            <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              Pronta Entrega
            </span>
          </div>

          <div class="flex items-baseline gap-2">
            <span class="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight">
              {{ formattedPrice() }}
            </span>
            <span class="text-xs text-neutral-500 font-medium">à vista / faturado</span>
          </div>

          <p class="text-xs text-neutral-600 font-medium">
            Em até 12x de <strong class="text-neutral-900">{{ installmentPrice() }}</strong> no cartão ou faturamento direto PJ com condições BNDES / FINAME.
          </p>
        </div>

        <div class="space-y-3">
          <label for="quantity-input" class="block text-xs font-bold uppercase tracking-wider text-neutral-700">
            Quantidade
          </label>
          <div class="flex items-center gap-3">
            <div class="inline-flex items-center border border-neutral-300 rounded-xl bg-white overflow-hidden shadow-xs">
              <button
                type="button"
                (click)="decrementQuantity()"
                [disabled]="quantity() <= 1"
                class="w-11 h-11 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 active:bg-neutral-200 disabled:opacity-40 disabled:hover:bg-white transition-colors cursor-pointer disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#077fbd]"
                aria-label="Diminuir quantidade"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>

              <input
                id="quantity-input"
                type="number"
                min="1"
                [value]="quantity()"
                (change)="onQuantityChange($event)"
                class="w-14 h-11 text-center font-bold text-neutral-900 text-sm focus:outline-none border-x border-neutral-200"
                aria-label="Quantidade de itens"
              />

              <button
                type="button"
                (click)="incrementQuantity()"
                class="w-11 h-11 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 active:bg-neutral-200 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#077fbd]"
                aria-label="Aumentar quantidade"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4" aria-hidden="true">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
            </div>

            <div class="text-xs text-neutral-500 leading-tight">
              <span class="block font-semibold text-neutral-800">Unidade Industrial</span>
              <span>Inclui mesa e montagem</span>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-3 pt-2">
          <button
            type="button"
            (click)="handleAddToCart()"
            class="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-[#077fbd] hover:bg-[#066a9e] active:bg-[#055780] text-white text-sm font-bold uppercase tracking-wider shadow-sm hover:shadow transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#077fbd]"
            [attr.aria-label]="'Adicionar ' + product().name + ' à cotação'"
          >
            @if (addedRecently()) {
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 text-white" aria-hidden="true">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Adicionado com Sucesso!</span>
            } @else {
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5" aria-hidden="true">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <span>Adicionar à Cotação</span>
            }
          </button>

          <a
            [href]="whatsAppLink()"
            target="_blank"
            rel="noopener noreferrer"
            class="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1da850] text-white text-sm font-bold uppercase tracking-wider shadow-xs transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#25D366]"
            aria-label="Falar com consultor via WhatsApp"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5" aria-hidden="true">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span>Consultar Especialista via WhatsApp</span>
          </a>
        </div>
      </div>

      <div class="mt-8 pt-6 border-t border-neutral-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-600">
        <div class="flex items-start gap-2.5">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-[#0573cc] shrink-0 mt-0.5" aria-hidden="true">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <div>
            <strong class="block text-neutral-900 font-semibold">Garantia 12 Meses</strong>
            <span class="text-[11px] text-neutral-500">Garantia oficial de fábrica</span>
          </div>
        </div>

        <div class="flex items-start gap-2.5">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-[#0573cc] shrink-0 mt-0.5" aria-hidden="true">
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <line x1="2" y1="10" x2="22" y2="10" />
          </svg>
          <div>
            <strong class="block text-neutral-900 font-semibold">Faturamento PJ</strong>
            <span class="text-[11px] text-neutral-500">Boleto a prazo e BNDES</span>
          </div>
        </div>

        <div class="flex items-start gap-2.5">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-[#0573cc] shrink-0 mt-0.5" aria-hidden="true">
            <rect x="1" y="3" width="15" height="13" />
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
            <circle cx="5.5" cy="18.5" r="2.5" />
            <circle cx="18.5" cy="18.5" r="2.5" />
          </svg>
          <div>
            <strong class="block text-neutral-900 font-semibold">Logística Segura</strong>
            <span class="text-[11px] text-neutral-500">Transporte dedicado</span>
          </div>
        </div>

        <div class="flex items-start gap-2.5">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-[#0573cc] shrink-0 mt-0.5" aria-hidden="true">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
          <div>
            <strong class="block text-neutral-900 font-semibold">Suporte Técnico</strong>
            <span class="text-[11px] text-neutral-500">Peças e assistência</span>
          </div>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdpBuyBoxComponent {
  private readonly cartService = inject(CartService);
  private readonly authService = inject(AuthService);

  readonly product = input.required<Product>();
  readonly addToCart = output<{ product: Product; quantity: number }>();

  protected readonly quantity = signal<number>(1);
  protected readonly addedRecently = signal<boolean>(false);

  protected readonly formattedPrice = computed(() => {
    return this.product().price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  });

  protected readonly installmentPrice = computed(() => {
    return (this.product().price / 12).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  });

  protected readonly whatsAppLink = computed(() => {
    const user = this.authService.currentUser();
    return this.cartService.generateProductWhatsAppLink(
      this.product(),
      this.quantity(),
      '5511999999999',
      user ? { name: user.name, cnpjCpf: user.cnpjCpf } : undefined
    );
  });

  incrementQuantity(): void {
    this.quantity.update((q) => q + 1);
  }

  decrementQuantity(): void {
    this.quantity.update((q) => Math.max(1, q - 1));
  }

  onQuantityChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = parseInt(target.value, 10);
    if (!isNaN(value) && value >= 1) {
      this.quantity.set(value);
    } else {
      this.quantity.set(1);
      target.value = '1';
    }
  }

  handleAddToCart(): void {
    this.addToCart.emit({
      product: this.product(),
      quantity: this.quantity()
    });
    this.addedRecently.set(true);
    setTimeout(() => {
      this.addedRecently.set(false);
    }, 2000);
  }
}
