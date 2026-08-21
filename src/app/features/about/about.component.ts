import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  imports: [RouterLink],
  template: `
    <main class="min-h-screen bg-[#f5f5f7] text-neutral-900 pb-16 sm:pb-24">
      <nav aria-label="Navegação Estrutural" class="bg-white border-b border-neutral-200">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 py-3 text-xs text-neutral-500 flex items-center gap-2">
          <a routerLink="/" class="hover:text-neutral-900 transition-colors">Início</a>
          <span class="text-neutral-400" aria-hidden="true">/</span>
          <span class="text-neutral-900 font-semibold" aria-current="page">Sobre Nós</span>
        </div>
      </nav>

      <header class="bg-[#101010] text-white border-b border-neutral-800 py-12 sm:py-16">
        <div class="max-w-prose mx-auto px-4 sm:px-6 text-center space-y-4">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#0573cc]/20 border border-[#0573cc]/40 text-[#0573cc] text-xs font-bold uppercase tracking-wider">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5" aria-hidden="true">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            Institucional SKYTEC
          </div>

          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            Sobre a SKYTEC
          </h1>

          <p class="text-sm sm:text-base text-neutral-300 font-normal leading-relaxed">
            Parceria estratégica, engenharia de ponta e fornecimento contínuo de máquinas de costura e insumos para a indústria têxtil nacional.
          </p>
        </div>
      </header>

      <section class="max-w-prose mx-auto px-4 sm:px-6 pt-10 sm:pt-14" aria-label="Conteúdo Institucional">
        <article class="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-10 shadow-xs space-y-12">
          <div class="space-y-4">
            <h2 class="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
              Sua Jornada na Costura Começa Aqui
            </h2>
            <p class="text-sm sm:text-base text-neutral-700 leading-relaxed">
              Seja você um profissional experiente ou iniciante, encontrar o fornecedor certo faz toda a diferença. Nossa missão é entregar os melhores equipamentos e insumos para a sua produção. Entendemos as necessidades de cada cliente, desde pequenos ateliês até confecções de grande porte.
            </p>
          </div>
        </article>
      </section>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent {}
