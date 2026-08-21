import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink],
  template: `
    <article class="group flex flex-col justify-between h-full bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md hover:border-neutral-300 transition-all duration-150">
      <div>
        <div class="relative bg-[#f5f5f7] p-6 flex items-center justify-center border-b border-neutral-100 aspect-4/3 overflow-hidden">
          <div class="absolute top-3 left-3 z-10 flex flex-wrap gap-1">
            <span class="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-neutral-900 text-white">
              {{ product().brand }}
            </span>
            <span class="inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-[#0573cc]/10 text-[#0573cc] border border-[#0573cc]/20">
              {{ product().category }}
            </span>
          </div>

          <div class="absolute top-3 right-3 z-10">
            <span class="text-[10px] font-mono text-neutral-500 font-semibold bg-white/90 px-1.5 py-0.5 rounded border border-neutral-200">
              {{ product().sku }}
            </span>
          </div>

          <a [routerLink]="['/produto', product().id]" class="w-full h-full flex flex-col items-center justify-center focus-visible:outline-none" [attr.aria-label]="product().name">
            @if (hasValidImage()) {
              <img
                [src]="product().images[0]"
                [alt]="product().name"
                (error)="handleImageError()"
                class="max-h-32 sm:max-h-36 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
              />
            } @else {
              <div class="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white border border-neutral-200/80 flex items-center justify-center shadow-inner text-[#0573cc] group-hover:scale-105 transition-transform duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="w-12 h-12 sm:w-14 sm:h-14" aria-hidden="true">
                  <rect x="2" y="6" width="20" height="12" rx="2" />
                  <path d="M6 12h.01" />
                  <path d="M10 12h.01" />
                  <path d="M14 12h.01" />
                  <path d="M18 12h.01" />
                  <path d="M12 2v4" />
                  <path d="M12 18v4" />
                </svg>
              </div>
            }
          </a>
        </div>

        <div class="p-4 sm:p-5 space-y-3">
          <h3 class="text-sm sm:text-base font-bold text-neutral-900 leading-snug line-clamp-2 min-h-11">
            <a [routerLink]="['/produto', product().id]" class="hover:text-[#0573cc] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0573cc] rounded">
              {{ product().name }}
            </a>
          </h3>

          <p class="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
            {{ product().shortDescription }}
          </p>

          <div class="pt-2 border-t border-neutral-100">
            <span class="block text-[10px] uppercase font-semibold text-neutral-400">Preço Estimado</span>
            <div class="flex items-baseline gap-1.5">
              <span class="text-xl sm:text-2xl font-black text-neutral-900">
                {{ formattedPrice() }}
              </span>
            </div>
            <span class="block text-[11px] text-neutral-500 font-medium mt-0.5">
              Faturamento PJ & BNDES
            </span>
          </div>
        </div>
      </div>

      <div class="p-4 sm:p-5 pt-0 space-y-2">
        <button
          type="button"
          (click)="handleAddToCart($event)"
          class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#077fbd] hover:bg-[#066a9e] active:bg-[#055780] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#077fbd]"
          [attr.aria-label]="'Adicionar ' + product().name + ' à cotação'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4" aria-hidden="true">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
            <path d="M3 6h18" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          <span>Adicionar à Cotação</span>
        </button>

        <a
          [routerLink]="['/produto', product().id]"
          class="w-full inline-flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400"
        >
          <span>Ver Ficha Técnica</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5" aria-hidden="true">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </a>
      </div>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCardComponent {
  readonly product = input.required<Product>();
  readonly addedToCart = output<Product>();

  protected readonly imageFailed = signal(false);

  protected readonly hasValidImage = computed(() => {
    const images = this.product().images;
    return Boolean(images && images.length > 0 && !this.imageFailed());
  });

  protected readonly formattedPrice = computed(() => {
    return this.product().price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  });

  protected handleImageError(): void {
    this.imageFailed.set(true);
  }

  protected handleAddToCart(event: MouseEvent): void {
    event.stopPropagation();
    this.addedToCart.emit(this.product());
  }
}
