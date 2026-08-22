import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../../core/services/cart.service';
import { ProductService } from '../../../../core/services/product.service';

@Component({
  selector: 'app-flagship-banner',
  imports: [RouterLink],
  template: `
    <section class="py-12 sm:py-16 lg:py-20 bg-[#f5f5f7] border-b border-neutral-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-white border border-neutral-200/90 rounded-2xl shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center p-6 sm:p-10 lg:p-14">
          <div class="lg:col-span-6 order-2 lg:order-1 space-y-6">
            <div class="space-y-3">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#0573cc]/10 text-[#0573cc] border border-[#0573cc]/20 text-xs font-bold uppercase tracking-wider">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5" aria-hidden="true">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                Referência em máquinas de costura no Brasil
              </span>

              <h3 class="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-neutral-900 leading-tight">
                Máquina de Costura Industrial Reta Eletrônica Direct Drive SKYMAK R8
              </h3>

              <p class="text-sm sm:text-base text-neutral-600 leading-relaxed font-normal">
                Alta tecnologia e precisão para elevar o nível da sua produção.
              </p>
            </div>

            <div class="grid grid-cols-2 gap-3 py-2 border-y border-neutral-100">
              <div class="flex items-start gap-2.5">
                <div class="w-5 h-5 rounded bg-neutral-100 text-[#0573cc] flex items-center justify-center shrink-0 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div>
                  <span class="block text-xs font-bold text-neutral-900">Motor Direct Drive</span>
                  <span class="block text-[11px] text-neutral-500">Até 70% menos ruído & consumo</span>
                </div>
              </div>

              <div class="flex items-start gap-2.5">
                <div class="w-5 h-5 rounded bg-neutral-100 text-[#0573cc] flex items-center justify-center shrink-0 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div>
                  <span class="block text-xs font-bold text-neutral-900">Corte & Arremate Auto</span>
                  <span class="block text-[11px] text-neutral-500">Acabamento limpo instantâneo</span>
                </div>
              </div>

              <div class="flex items-start gap-2.5">
                <div class="w-5 h-5 rounded bg-neutral-100 text-[#0573cc] flex items-center justify-center shrink-0 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div>
                  <span class="block text-xs font-bold text-neutral-900">Painel Digital Touch</span>
                  <span class="block text-[11px] text-neutral-500">Configuração rápida e precisa</span>
                </div>
              </div>

              <div class="flex items-start gap-2.5">
                <div class="w-5 h-5 rounded bg-neutral-100 text-[#0573cc] flex items-center justify-center shrink-0 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div>
                  <span class="block text-xs font-bold text-neutral-900">Velocidade 5.000 RPM</span>
                  <span class="block text-[11px] text-neutral-500">Alta cadência industrial</span>
                </div>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <a
                [href]="whatsAppLink()"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1da850] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#25D366]"
                aria-label="Consultar um vendedor sobre a SKYMAK R8 via WhatsApp"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                <span>CONSULTAR UM VENDEDOR</span>
              </a>

              <a
                routerLink="/produto/PROD-SKYMAK-R8"
                class="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300 text-neutral-800 font-semibold text-xs uppercase tracking-wider transition-colors border border-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#077fbd]"
              >
                <span>Ver Ficha Técnica</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </a>
            </div>
          </div>

          <div class="lg:col-span-6 order-1 lg:order-2">
            <div class="relative bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-xl border border-neutral-200/80 p-8 sm:p-12 flex flex-col items-center justify-center text-center">
              <div class="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#101010] text-white text-[11px] font-mono font-bold">
                <span>SKU: R8-SKYMAK</span>
              </div>

              <div class="w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-white border border-neutral-200 flex items-center justify-center shadow-sm p-4 my-4 overflow-hidden">
                <img
                  src="assets/skymakr8.avif"
                  alt="Máquina de Costura Industrial Reta Eletrônica Direct Drive SKYMAK R8"
                  class="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div class="space-y-1 mt-2">
                <span class="text-xs uppercase tracking-wider font-semibold text-neutral-500">Valor de Tabela</span>
                <p class="text-2xl sm:text-3xl font-black text-neutral-900">
                  R$ 3.890,00
                </p>
                <span class="inline-block text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  Faturamento B2B & Cartão BNDES Disponíveis
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlagshipBannerComponent {
  readonly cartService = inject(CartService);
  readonly productService = inject(ProductService);

  readonly whatsAppLink = computed(() => {
    const text = encodeURIComponent(
      'Olá! Gostaria de consultar um vendedor da SKYTEC sobre a Máquina de Costura Industrial Reta Eletrônica Direct Drive SKYMAK R8 (SKU: R8-SKYMAK).'
    );
    return `https://wa.me/5511999999999?text=${text}`;
  });
}
