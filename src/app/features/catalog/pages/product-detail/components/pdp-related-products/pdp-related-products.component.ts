import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../../../../../core/models/product.model';
import { ProductCardComponent } from '../../../../../../shared/ui/product-card/product-card.component';

@Component({
  selector: 'app-pdp-related-products',
  imports: [RouterLink, ProductCardComponent],
  template: `
    @if (products().length > 0) {
      <section aria-labelledby="related-heading" class="pt-10 sm:pt-12 border-t border-neutral-200">
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div class="flex items-center gap-2 mb-1.5">
              <span class="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#0573cc]/10 text-[#0573cc] border border-[#0573cc]/20">
                Recomendações Técnicas
              </span>
              @if (currentCategory()) {
                <span class="text-xs text-neutral-500 font-medium">
                  Categoria: {{ currentCategory() }}
                </span>
              }
            </div>
            <h2 id="related-heading" class="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
              Máquinas e Equipamentos Relacionados
            </h2>
            <p class="text-xs sm:text-sm text-neutral-500 mt-1">
              Modelos com especificações e aplicações complementares para aumentar a produtividade da sua confecção.
            </p>
          </div>

          <a
            routerLink="/catalogo"
            class="inline-flex items-center gap-1.5 text-xs font-bold text-[#0573cc] hover:text-[#077fbd] transition-colors focus-visible:outline-none focus-visible:underline shrink-0"
          >
            <span>Ver Catálogo Completo</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4" aria-hidden="true">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </a>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          @for (product of products(); track product.id) {
            <app-product-card
              [product]="product"
              (addedToCart)="handleAddToCart($event)"
            />
          }
        </div>
      </section>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdpRelatedProductsComponent {
  readonly products = input<Product[]>([]);
  readonly currentCategory = input<string | undefined>(undefined);

  readonly addToCart = output<Product>();

  protected handleAddToCart(product: Product): void {
    this.addToCart.emit(product);
  }
}
