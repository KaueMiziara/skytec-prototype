import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../../core/services/product.service';
import { CartService } from '../../../../core/services/cart.service';
import { ProductCardComponent } from '../../../../shared/ui/product-card/product-card.component';
import { Product } from '../../../../core/models/product.model';

@Component({
  selector: 'app-featured-products',
  imports: [RouterLink, ProductCardComponent],
  template: `
    <section class="py-12 sm:py-16 lg:py-20 bg-[#f5f5f7] border-b border-neutral-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#0573cc]/10 text-[#0573cc] text-xs font-bold uppercase tracking-wider mb-2 border border-[#0573cc]/20">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5" aria-hidden="true">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              Mais Vendidos para Confecções
            </div>
            <h2 class="text-xl sm:text-2xl lg:text-3xl font-black text-neutral-900 tracking-tight">
              Máquinas Industriais em Destaque
            </h2>
            <p class="text-xs sm:text-sm text-neutral-500 mt-1">
              Equipamentos de alta performance testados e revisados para pronta entrega.
            </p>
          </div>

          <a
            routerLink="/catalogo"
            class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider transition-colors self-start md:self-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#077fbd]"
          >
            <span>Ver Catálogo Completo</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          @for (product of productService.featuredProducts(); track product.id) {
            <app-product-card
              [product]="product"
              (addedToCart)="onAddToCart($event)"
            />
          }
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeaturedProductsComponent {
  readonly productService = inject(ProductService);
  readonly cartService = inject(CartService);

  protected onAddToCart(product: Product): void {
    this.cartService.addItem(product, 1);
    this.cartService.openDrawer();
  }
}
