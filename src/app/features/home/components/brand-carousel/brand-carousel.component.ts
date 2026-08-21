import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../../core/services/product.service';

export interface BrandItem {
  name: string;
  tagline: string;
  isFlagship?: boolean;
}

@Component({
  selector: 'app-brand-carousel',
  imports: [RouterLink],
  template: `
    <section class="py-12 sm:py-16 bg-white border-b border-neutral-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-neutral-100 text-neutral-700 text-xs font-bold uppercase tracking-wider mb-2 border border-neutral-200">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5 text-[#0573cc]" aria-hidden="true">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              Distribuição Oficial
            </div>
            <h2 class="text-xl sm:text-2xl lg:text-3xl font-black text-neutral-900 tracking-tight">
              Marcas Líderes em Costura Industrial
            </h2>
            <p class="text-xs sm:text-sm text-neutral-500 mt-1">
              Selecione uma marca para filtrar instantaneamente as máquinas disponíveis no catálogo.
            </p>
          </div>

          <a
            routerLink="/catalogo"
            class="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0573cc] hover:text-[#077fbd] transition-colors self-start md:self-auto py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0573cc] rounded"
          >
            <span>Ver Todas as Marcas</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4" role="list" aria-label="Lista de marcas parceiras">
          @for (brand of partnerBrands; track brand.name) {
            <a
              routerLink="/catalogo"
              [queryParams]="{ marca: brand.name }"
              class="group relative flex flex-col justify-between p-4 sm:p-5 rounded-xl border transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0573cc]"
              [class]="brand.isFlagship ? 'bg-neutral-950 text-white border-neutral-800 hover:border-[#0573cc]' : 'bg-[#f5f5f7] text-neutral-900 border-neutral-200/90 hover:bg-white hover:border-[#0573cc] hover:shadow-xs'"
              role="listitem"
              [attr.aria-label]="'Filtrar catálogo pela marca ' + brand.name"
            >
              <div class="space-y-1">
                @if (brand.isFlagship) {
                  <span class="inline-block text-[9px] font-mono font-bold uppercase tracking-wider text-[#0573cc] bg-[#0573cc]/20 px-1.5 py-0.5 rounded">
                    Destaque
                  </span>
                }
                <div class="flex items-center justify-between">
                  <h3 class="text-base sm:text-lg font-black tracking-tight group-hover:text-[#0573cc] transition-colors" [class.text-white]="brand.isFlagship">
                    {{ brand.name }}
                  </h3>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-neutral-400 group-hover:text-[#0573cc] group-hover:translate-x-0.5 transition-all" aria-hidden="true">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              </div>

              <span class="text-[11px] mt-3 font-medium leading-tight" [class]="brand.isFlagship ? 'text-neutral-400' : 'text-neutral-500'">
                {{ brand.tagline }}
              </span>
            </a>
          }
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrandCarouselComponent {
  readonly productService = inject(ProductService);

  readonly partnerBrands: BrandItem[] = [
    { name: 'SKYMAK', tagline: 'Automação & Direct Drive', isFlagship: true },
    { name: 'Jack', tagline: 'Eletrônicas & Tecnologia' },
    { name: 'Sun Special', tagline: 'Overlocks & Retas' },
    { name: 'Siruba', tagline: 'Tradição em Interlocks' },
    { name: 'Zoje', tagline: 'Soluções Industriais' },
    { name: 'Sansei', tagline: 'Especiais & Travetes' },
    { name: 'Brother', tagline: 'Precisão & Bordado' },
    { name: 'Singer', tagline: 'Linha Tradicional' },
    { name: 'Lanmax', tagline: 'Máquinas & Insumos' }
  ];
}
