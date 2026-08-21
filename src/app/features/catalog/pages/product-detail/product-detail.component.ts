import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../../../core/models/product.model';
import { CartService } from '../../../../core/services/cart.service';
import { ProductService } from '../../../../core/services/product.service';
import { PdpBuyBoxComponent } from './components/pdp-buy-box/pdp-buy-box.component';
import { PdpDescriptionComponent } from './components/pdp-description/pdp-description.component';
import { PdpGalleryComponent } from './components/pdp-gallery/pdp-gallery.component';
import { PdpRelatedProductsComponent } from './components/pdp-related-products/pdp-related-products.component';
import { PdpSpecsTableComponent } from './components/pdp-specs-table/pdp-specs-table.component';

@Component({
  selector: 'app-product-detail',
  imports: [
    RouterLink,
    PdpGalleryComponent,
    PdpBuyBoxComponent,
    PdpDescriptionComponent,
    PdpSpecsTableComponent,
    PdpRelatedProductsComponent
  ],
  template: `
    <main class="min-h-screen bg-[#f5f5f7] py-6 sm:py-8 lg:py-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        @if (product(); as currentProduct) {
          <nav aria-label="Breadcrumb" class="mb-6">
            <ol class="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
              <li>
                <a routerLink="/" class="hover:text-neutral-900 transition-colors focus-visible:outline-none focus-visible:underline">
                  Início
                </a>
              </li>
              <li aria-hidden="true" class="text-neutral-400">/</li>
              <li>
                <a routerLink="/catalogo" class="hover:text-neutral-900 transition-colors focus-visible:outline-none focus-visible:underline">
                  Catálogo
                </a>
              </li>
              <li aria-hidden="true" class="text-neutral-400">/</li>
              <li>
                <a
                  [routerLink]="['/catalogo']"
                  [queryParams]="{ categoria: currentProduct.category }"
                  class="hover:text-neutral-900 transition-colors focus-visible:outline-none focus-visible:underline"
                >
                  {{ currentProduct.category }}
                </a>
              </li>
              <li aria-hidden="true" class="text-neutral-400">/</li>
              <li class="font-semibold text-neutral-900 truncate max-w-xs sm:max-w-md" aria-current="page">
                {{ currentProduct.name }}
              </li>
            </ol>
          </nav>

          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-10 sm:mb-12">
            <div class="lg:col-span-6 xl:col-span-7 lg:sticky lg:top-24">
              <app-pdp-gallery
                [images]="currentProduct.images"
                [productName]="currentProduct.name"
                [brand]="currentProduct.brand"
                [category]="currentProduct.category"
                [sku]="currentProduct.sku"
              />
            </div>

            <div class="lg:col-span-6 xl:col-span-5">
              <app-pdp-buy-box
                [product]="currentProduct"
                (addToCart)="handleAddToCart($event)"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-10 sm:mb-12">
            <div class="lg:col-span-6">
              <app-pdp-description [product]="currentProduct" />
            </div>

            <div class="lg:col-span-6">
              <app-pdp-specs-table
                [specifications]="currentProduct.specifications"
                [productName]="currentProduct.name"
              />
            </div>
          </div>

          <app-pdp-related-products
            [products]="relatedProducts()"
            [currentCategory]="currentProduct.category"
            (addToCart)="handleAddToCartSingle($event)"
          />
        } @else {
          <div class="bg-white border border-neutral-200 rounded-2xl p-8 sm:p-14 text-center shadow-xs max-w-xl mx-auto my-12">
            <div class="w-16 h-16 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-400 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>

            <h1 class="text-xl sm:text-2xl font-bold text-neutral-900 mb-2">
              Máquina Não Encontrada
            </h1>
            <p class="text-xs sm:text-sm text-neutral-500 mb-6 leading-relaxed">
              O produto com identificador <strong>"{{ id() }}"</strong> não foi localizado em nossa base de equipamentos industriais.
            </p>

            <a
              routerLink="/catalogo"
              class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#077fbd] hover:bg-[#066a9e] text-white text-xs font-bold uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#077fbd]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4" aria-hidden="true">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              <span>Voltar ao Catálogo de Máquinas</span>
            </a>
          </div>
        }
      </div>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent {
  readonly id = input<string>();

  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);

  constructor() {
    effect(() => {
      this.id();
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });
  }

  protected readonly product = computed<Product | undefined>(() => {
    const currentId = this.id();
    if (!currentId) return undefined;
    return (
      this.productService.getProductById(currentId) ||
      this.productService.getProductBySku(currentId)
    );
  });

  protected readonly relatedProducts = computed<Product[]>(() => {
    const p = this.product();
    if (!p) return [];
    return this.productService.getRelatedProducts(p.id, 4);
  });

  protected handleAddToCart(data: { product: Product; quantity: number }): void {
    this.cartService.addItem(data.product, data.quantity);
    this.cartService.openDrawer();
  }

  protected handleAddToCartSingle(product: Product): void {
    this.cartService.addItem(product, 1);
    this.cartService.openDrawer();
  }
}
