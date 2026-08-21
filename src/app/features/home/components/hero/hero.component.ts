import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../../core/services/cart.service';

@Component({
  selector: 'app-hero',
  imports: [RouterLink],
  template: `
    <section class="relative bg-[#101010] text-white overflow-hidden border-b border-neutral-800">
      <div class="absolute inset-0 opacity-10 pointer-events-none" aria-hidden="true">
        <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="industrial-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" stroke-width="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#industrial-grid)" />
        </svg>
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div class="lg:col-span-7 space-y-6 sm:space-y-8">
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#0573cc]/15 border border-[#0573cc]/30 text-[#0573cc] text-xs font-bold uppercase tracking-wider">
              <span class="w-2 h-2 rounded-full bg-[#0573cc]"></span>
              Máquinas Industriais & Automação Têxtil
            </div>

            <div class="space-y-4">
              <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight sm:leading-none">
                Invista em produtividade: sua confecção merece a máquina certa para crescer!
              </h1>
              <h2 class="text-base sm:text-lg lg:text-xl text-neutral-300 font-normal leading-relaxed max-w-2xl">
                Tecnologia que transforma costura em resultado. Garanta já a sua máquina.
              </h2>
            </div>

            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <a
                routerLink="/catalogo"
                class="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg bg-[#077fbd] hover:bg-[#066a9e] active:bg-[#055780] text-white font-bold text-sm tracking-wide transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#077fbd]"
              >
                <span>Ver Catálogo Completo</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </a>

              <a
                [href]="cartService.generateWhatsAppLink()"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 active:bg-neutral-950 text-neutral-200 hover:text-white border border-neutral-700 font-semibold text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#25D366]"
                aria-label="Falar com um consultor via WhatsApp"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-[#25D366]" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                <span>Consultor WhatsApp</span>
              </a>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-6 border-t border-neutral-800/80 text-neutral-400">
              <div class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-[#0573cc] shrink-0" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span class="text-xs font-medium text-neutral-300">Pronta Entrega</span>
              </div>
              <div class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-[#0573cc] shrink-0" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span class="text-xs font-medium text-neutral-300">Faturamento PJ & BNDES</span>
              </div>
              <div class="flex items-center gap-2 col-span-2 sm:col-span-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-[#0573cc] shrink-0" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span class="text-xs font-medium text-neutral-300">Garantia Nacional</span>
              </div>
            </div>
          </div>

          <div class="lg:col-span-5 relative">
            <div class="relative bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 overflow-hidden shadow-2xl">
              <div class="flex items-center justify-between pb-4 border-b border-neutral-800">
                <div class="flex items-center gap-2">
                  <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span class="text-xs font-mono font-bold uppercase tracking-wider text-neutral-300">Linha Direta de Produção</span>
                </div>
                <span class="text-[11px] font-mono text-[#0573cc] bg-[#0573cc]/10 px-2 py-0.5 rounded border border-[#0573cc]/20 font-bold">
                  B2B DIRECT
                </span>
              </div>

              <div class="py-8 flex flex-col items-center justify-center text-center">
                <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#101010] border border-neutral-800 flex items-center justify-center text-[#0573cc] mb-4 shadow-inner">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="w-12 h-12" aria-hidden="true">
                    <rect x="2" y="6" width="20" height="12" rx="2"></rect>
                    <path d="M6 12h.01"></path>
                    <path d="M10 12h.01"></path>
                    <path d="M14 12h.01"></path>
                    <path d="M18 12h.01"></path>
                    <path d="M12 2v4"></path>
                    <path d="M12 18v4"></path>
                  </svg>
                </div>
                <h3 class="text-lg font-black text-white tracking-tight">Equipamentos de Alta Performance</h3>
                <p class="text-xs text-neutral-400 mt-1 max-w-xs leading-relaxed">
                  Retas eletrônicas, overlocks, galoneiras e automações com tecnologia Direct Drive.
                </p>
              </div>

              <div class="grid grid-cols-2 gap-2 pt-4 border-t border-neutral-800">
                <div class="p-3 bg-[#101010] rounded-lg border border-neutral-800/80">
                  <span class="block text-[10px] uppercase font-mono text-neutral-500">Eficiência</span>
                  <span class="text-sm font-black text-emerald-400">Até 70% menos energia</span>
                </div>
                <div class="p-3 bg-[#101010] rounded-lg border border-neutral-800/80">
                  <span class="block text-[10px] uppercase font-mono text-neutral-500">Velocidade</span>
                  <span class="text-sm font-black text-white">Até 6.000 RPM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroComponent {
  readonly cartService = inject(CartService);
}
