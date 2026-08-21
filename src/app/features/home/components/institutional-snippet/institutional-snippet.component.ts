import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../../core/services/cart.service';

@Component({
  selector: 'app-institutional-snippet',
  imports: [RouterLink],
  template: `
    <section class="py-12 sm:py-16 lg:py-20 bg-white border-b border-neutral-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div class="lg:col-span-7 space-y-6">
            <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#0573cc]/10 text-[#0573cc] text-xs font-bold uppercase tracking-wider border border-[#0573cc]/20">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5" aria-hidden="true">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Estrutura & Parceria B2B
            </div>

            <div class="space-y-3">
              <h2 class="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-900 tracking-tight leading-tight">
                Sua Jornada na Costura Começa Aqui
              </h2>
              <p class="text-sm sm:text-base text-neutral-600 leading-relaxed font-normal">
                Seja você um profissional experiente ou iniciante, encontrar o fornecedor certo faz toda a diferença. A SKYTEC entrega os melhores equipamentos, peças e insumos para a sua produção têxtil, atendendo desde ateliês até confecções de grande porte em todo o território nacional.
              </p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div class="p-4 rounded-xl bg-[#f5f5f7] border border-neutral-200/80 space-y-1">
                <div class="flex items-center gap-2 text-neutral-900 font-bold text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-[#0573cc]"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Equipamentos Testados</span>
                </div>
                <p class="text-xs text-neutral-500 leading-normal">
                  Todas as máquinas são revisadas e ajustadas tecnicamente antes da entrega.
                </p>
              </div>

              <div class="p-4 rounded-xl bg-[#f5f5f7] border border-neutral-200/80 space-y-1">
                <div class="flex items-center gap-2 text-neutral-900 font-bold text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-[#0573cc]"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Suporte Especializado</span>
                </div>
                <p class="text-xs text-neutral-500 leading-normal">
                  Consultores técnicos prontos para indicar o maquinário exato para o seu tecido.
                </p>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <a
                routerLink="/sobre-nos"
                class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#101010] hover:bg-neutral-800 active:bg-black text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#101010]"
              >
                <span>Conhecer a Empresa</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </a>

              <a
                [href]="cartService.generateWhatsAppLink()"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold uppercase tracking-wider transition-colors border border-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#25D366]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-[#25D366]"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <span>Fale com um Consultor</span>
              </a>
            </div>
          </div>

          <div class="lg:col-span-5">
            <div class="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 text-white space-y-6 shadow-xl">
              <div class="space-y-1">
                <span class="text-[10px] font-mono uppercase tracking-widest text-[#0573cc] font-bold">Distribuição & Garantia</span>
                <h3 class="text-xl font-bold">Por que escolher a SKYTEC?</h3>
              </div>

              <ul class="space-y-3.5 text-xs text-neutral-300">
                <li class="flex items-start gap-3">
                  <div class="w-5 h-5 rounded bg-[#0573cc]/20 text-[#0573cc] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">✓</div>
                  <div>
                    <strong class="text-white block">Logística Ágil e Segura</strong>
                    <span>Envio com seguro total para confecções em todo o Brasil.</span>
                  </div>
                </li>

                <li class="flex items-start gap-3">
                  <div class="w-5 h-5 rounded bg-[#0573cc]/20 text-[#0573cc] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">✓</div>
                  <div>
                    <strong class="text-white block">Faturamento Facilitado para Empresas</strong>
                    <span>Condições sob medida via boleto faturado PJ e Cartão BNDES.</span>
                  </div>
                </li>

                <li class="flex items-start gap-3">
                  <div class="w-5 h-5 rounded bg-[#0573cc]/20 text-[#0573cc] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">✓</div>
                  <div>
                    <strong class="text-white block">Peças Originais em Estoque</strong>
                    <span>Garantia de reposição contínua sem paralisação da sua fábrica.</span>
                  </div>
                </li>
              </ul>

              <div class="pt-4 border-t border-neutral-800 text-[11px] text-neutral-400 font-mono flex items-center justify-between">
                <span>SEDE: BOM RETIRO / SP</span>
                <span class="text-emerald-400">● ATENDIMENTO ATIVO</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InstitutionalSnippetComponent {
  readonly cartService = inject(CartService);
}
