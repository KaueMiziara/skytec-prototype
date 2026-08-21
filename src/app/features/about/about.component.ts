import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-about',
  imports: [RouterLink],
  template: `
    <main class="min-h-screen bg-[#f5f5f7] text-neutral-900 pb-16 sm:pb-24">
      <nav aria-label="Navegação Estrutural" class="bg-white border-b border-neutral-200">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-xs text-neutral-500 flex items-center gap-2">
          <a routerLink="/" class="hover:text-neutral-900 transition-colors">Início</a>
          <span class="text-neutral-400" aria-hidden="true">/</span>
          <span class="text-neutral-900 font-semibold" aria-current="page">Sobre Nós</span>
        </div>
      </nav>

      <header class="bg-[#101010] text-white border-b border-neutral-800 py-14 sm:py-20">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#0573cc]/20 border border-[#0573cc]/40 text-[#0573cc] text-xs font-bold uppercase tracking-wider">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5" aria-hidden="true">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            Institucional SKYTEC
          </div>

          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            Sobre a SKYTEC
          </h1>

          <p class="text-sm sm:text-base lg:text-lg text-neutral-300 font-normal leading-relaxed max-w-2xl mx-auto">
            Parceria estratégica, engenharia de ponta e fornecimento contínuo de máquinas de costura e insumos para a indústria têxtil nacional.
          </p>
        </div>
      </header>

      <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 space-y-10 sm:space-y-12" aria-label="Conteúdo Institucional">
        
        <article class="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xs">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div class="lg:col-span-7 space-y-4">
              <div class="space-y-2">
                <span class="text-[11px] font-mono font-bold uppercase tracking-wider text-[#0573cc]">Origem & Missão</span>
                <h2 class="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight leading-snug">
                  Sua Jornada na Costura Começa Aqui
                </h2>
              </div>

              <p class="text-sm sm:text-base text-neutral-700 leading-relaxed font-normal">
                Seja você um profissional experiente ou iniciante, encontrar o fornecedor certo faz toda a diferença. Nossa missão é entregar os melhores equipamentos e insumos para a sua produção. Entendemos as necessidades de cada cliente, desde pequenos ateliês até confecções de grande porte.
              </p>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div class="p-3 bg-[#f5f5f7] rounded-lg border border-neutral-200/70">
                  <span class="block text-xs font-bold text-neutral-900">Atendimento Especializado</span>
                  <span class="block text-[11px] text-neutral-500 mt-0.5">Desde ateliês até indústrias de grande porte</span>
                </div>
                <div class="p-3 bg-[#f5f5f7] rounded-lg border border-neutral-200/70">
                  <span class="block text-xs font-bold text-neutral-900">Cobertura Nacional</span>
                  <span class="block text-[11px] text-neutral-500 mt-0.5">Entrega garantida para todo o Brasil</span>
                </div>
              </div>
            </div>

            <div class="lg:col-span-5">
              <div class="rounded-xl overflow-hidden border border-neutral-200 bg-neutral-900 text-white p-8 sm:p-10 flex flex-col items-center justify-center text-center relative shadow-sm">
                <div class="w-16 h-16 rounded-xl bg-[#101010] border border-neutral-800 flex items-center justify-center text-[#0573cc] mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8" aria-hidden="true">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <path d="M3 9h18"/>
                    <path d="M9 21V9"/>
                  </svg>
                </div>
                <span class="text-xs font-mono font-bold tracking-wider uppercase text-neutral-300">Infraestrutura & Distribuição</span>
                <span class="text-[11px] text-neutral-400 mt-1">Estoque Centralizado no Bom Retiro - São Paulo/SP</span>
              </div>
            </div>
          </div>
        </article>

        <article class="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xs">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div class="lg:col-span-5 order-2 lg:order-1">
              <div class="rounded-xl overflow-hidden border border-neutral-200 bg-neutral-900 text-white p-8 sm:p-10 flex flex-col items-center justify-center text-center relative shadow-sm">
                <div class="w-16 h-16 rounded-xl bg-[#101010] border border-neutral-800 flex items-center justify-center text-[#0573cc] mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8" aria-hidden="true">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                </div>
                <span class="text-xs font-mono font-bold tracking-wider uppercase text-neutral-300">Engenharia & Mecânica de Alta Precisão</span>
                <span class="text-[11px] text-neutral-400 mt-1">Conjuntos de Transporte e Ajuste para Tecidos Pesados e Leves</span>
              </div>
            </div>

            <div class="lg:col-span-7 order-1 lg:order-2 space-y-4">
              <div class="space-y-2">
                <span class="text-[11px] font-mono font-bold uppercase tracking-wider text-[#0573cc]">Equipamentos Industriais</span>
                <h2 class="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight leading-snug">
                  Soluções Completas em Maquinário
                </h2>
              </div>

              <p class="text-sm sm:text-base text-neutral-700 leading-relaxed font-normal">
                Nosso catálogo reúne máquinas domésticas e modelos industriais de alto desempenho, ideais para quem busca produtividade e acabamento profissional. Trabalhamos com as principais marcas do mercado. Cada equipamento é selecionado com critérios técnicos rigorosos para garantir eficiência na costura de algodão, malha, moletom, jeans e materiais pesados.
              </p>

              <div class="pt-2">
                <a
                  routerLink="/catalogo"
                  class="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-xs font-bold uppercase tracking-wider transition-colors border border-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#077fbd]"
                >
                  <span>Ver Catálogo de Máquinas</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </a>
              </div>
            </div>
          </div>
        </article>

        <article class="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xs">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div class="lg:col-span-7 space-y-4">
              <div class="space-y-2">
                <span class="text-[11px] font-mono font-bold uppercase tracking-wider text-[#0573cc]">Insumos & Suprimentos</span>
                <h2 class="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight leading-snug">
                  Linhas e Aviamentos
                </h2>
              </div>

              <p class="text-sm sm:text-base text-neutral-700 leading-relaxed font-normal">
                O bom acabamento depende dos insumos corretos. Nosso estoque inclui linhas em diversas espessuras, botões, zíperes e elásticos. O objetivo é fornecer os materiais ideais para manter o padrão das suas peças e garantir consistência na produção.
              </p>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div class="p-3 bg-[#f5f5f7] rounded-lg border border-neutral-200/70">
                  <span class="block text-xs font-bold text-neutral-900">Variedade de Espessuras</span>
                  <span class="block text-[11px] text-neutral-500 mt-0.5">Linhas de poliéster, nylon e algodão</span>
                </div>
                <div class="p-3 bg-[#f5f5f7] rounded-lg border border-neutral-200/70">
                  <span class="block text-xs font-bold text-neutral-900">Aviamentos Industriais</span>
                  <span class="block text-[11px] text-neutral-500 mt-0.5">Zíperes, botões e elásticos reforçados</span>
                </div>
              </div>
            </div>

            <div class="lg:col-span-5">
              <div class="rounded-xl overflow-hidden border border-neutral-200 bg-neutral-900 text-white p-8 sm:p-10 flex flex-col items-center justify-center text-center relative shadow-sm">
                <div class="w-16 h-16 rounded-xl bg-[#101010] border border-neutral-800 flex items-center justify-center text-[#0573cc] mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8" aria-hidden="true">
                    <polygon points="12 2 2 7 12 12 22 7 12 2"/>
                    <polyline points="2 17 12 22 22 17"/>
                    <polyline points="2 12 12 17 22 12"/>
                  </svg>
                </div>
                <span class="text-xs font-mono font-bold tracking-wider uppercase text-neutral-300">Cones Industriais & Aviamentos</span>
                <span class="text-[11px] text-neutral-400 mt-1">Padronização de Tensão, Resistência e Alta Tenacidade</span>
              </div>
            </div>
          </div>
        </article>

        <article class="bg-[#101010] text-white border border-neutral-800 rounded-2xl p-8 sm:p-12 lg:p-16 shadow-xl space-y-8 sm:space-y-10">
          <div class="space-y-3 max-w-3xl">
            <span class="text-[11px] font-mono font-bold uppercase tracking-wider text-[#0573cc]">Diferenciais Competitivos</span>
            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Por que escolher a SKYTEC?
            </h2>
            <p class="text-sm sm:text-base lg:text-lg text-neutral-300 leading-relaxed font-normal pt-1">
              Trabalhamos para ser parceiros de longo prazo da sua empresa. Oferecemos atendimento especializado, maquinário de qualidade, logística eficiente e suporte técnico resolutivo.
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div class="p-5 sm:p-6 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2">
              <div class="w-8 h-8 rounded-lg bg-[#0573cc]/20 text-[#0573cc] flex items-center justify-center font-bold text-sm">
                ✓
              </div>
              <div class="text-white font-bold text-sm sm:text-base">
                Atendimento Consultivo
              </div>
              <p class="text-xs text-neutral-400 leading-relaxed">
                Dimensionamento técnico correto para a capacidade produtiva da sua confecção.
              </p>
            </div>

            <div class="p-5 sm:p-6 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2">
              <div class="w-8 h-8 rounded-lg bg-[#0573cc]/20 text-[#0573cc] flex items-center justify-center font-bold text-sm">
                ✓
              </div>
              <div class="text-white font-bold text-sm sm:text-base">
                Logística Integrada
              </div>
              <p class="text-xs text-neutral-400 leading-relaxed">
                Entregas ágeis e seguras com rastreamento e seguro total em âmbito nacional.
              </p>
            </div>

            <div class="p-5 sm:p-6 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2">
              <div class="w-8 h-8 rounded-lg bg-[#0573cc]/20 text-[#0573cc] flex items-center justify-center font-bold text-sm">
                ✓
              </div>
              <div class="text-white font-bold text-sm sm:text-base">
                Garantia & Reposição
              </div>
              <p class="text-xs text-neutral-400 leading-relaxed">
                Peças e insumos originais para operação sem risco de paralisação na linha.
              </p>
            </div>

            <div class="p-5 sm:p-6 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2">
              <div class="w-8 h-8 rounded-lg bg-[#0573cc]/20 text-[#0573cc] flex items-center justify-center font-bold text-sm">
                ✓
              </div>
              <div class="text-white font-bold text-sm sm:text-base">
                Faturamento Flexível
              </div>
              <p class="text-xs text-neutral-400 leading-relaxed">
                Condições comerciais B2B, faturamento PJ via boleto e Cartão BNDES.
              </p>
            </div>
          </div>

          <div class="pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div class="text-xs text-neutral-400 font-mono flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>SEDE: BOM RETIRO / SP • ATENDIMENTO B2B ATIVO</span>
            </div>

            <a
              [href]="cartService.generateWhatsAppLink()"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-lg bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1da850] text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#25D366]"
              aria-label="Falar com um consultor da SKYTEC via WhatsApp"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <span>Fale com um Consultor</span>
            </a>
          </div>
        </article>

      </section>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent {
  readonly cartService = inject(CartService);
}
