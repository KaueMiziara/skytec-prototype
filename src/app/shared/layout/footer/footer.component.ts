import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  template: `
    <footer class="bg-[#101010] text-neutral-300 border-t border-neutral-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div class="space-y-4">
            <a
              routerLink="/"
              class="flex items-center gap-2.5 inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#077fbd] rounded"
              aria-label="SKYTEC - Página Inicial"
            >
              <div class="w-8 h-8 rounded bg-[#0573cc] flex items-center justify-center text-white font-black text-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="w-4 h-4"
                  aria-hidden="true"
                >
                  <path d="M12 2v20" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <span class="text-xl font-black tracking-tight text-white">
                SKY<span class="text-[#0573cc]">TEC</span>
              </span>
            </a>

            <p class="text-xs text-neutral-400 leading-relaxed">
              Referência em máquinas de costura industriais, automação fabril e insumos de alta produtividade para confecções em todo o Brasil.
            </p>

            <div class="space-y-1 text-xs text-neutral-500">
              <p>CNPJ: 12.345.678/0001-90</p>
              <p>Inscrição Estadual: 123.456.789.110</p>
              <p>Bom Retiro — São Paulo / SP</p>
            </div>
          </div>

          <div>
            <h3 class="text-xs font-bold uppercase tracking-wider text-white mb-4 pb-2 border-b border-neutral-800">
              Departamentos
            </h3>
            <ul class="space-y-2.5 text-xs">
              <li>
                <a
                  routerLink="/catalogo"
                  [queryParams]="{ categoria: 'Reta' }"
                  class="hover:text-white transition-colors"
                >
                  Máquinas Retas Industriais
                </a>
              </li>
              <li>
                <a
                  routerLink="/catalogo"
                  [queryParams]="{ categoria: 'Overlock' }"
                  class="hover:text-white transition-colors"
                >
                  Overlocks & Interlocks
                </a>
              </li>
              <li>
                <a
                  routerLink="/catalogo"
                  [queryParams]="{ categoria: 'Galoneira' }"
                  class="hover:text-white transition-colors"
                >
                  Galoneiras & Colaretes
                </a>
              </li>
              <li>
                <a
                  routerLink="/catalogo"
                  [queryParams]="{ categoria: 'Travete' }"
                  class="hover:text-white transition-colors"
                >
                  Travetes & Especiais
                </a>
              </li>
              <li>
                <a
                  routerLink="/catalogo"
                  [queryParams]="{ categoria: 'Corte' }"
                  class="hover:text-white transition-colors"
                >
                  Equipamentos de Corte
                </a>
              </li>
              <li>
                <a
                  routerLink="/catalogo"
                  [queryParams]="{ marca: 'SKYMAK' }"
                  class="text-[#0573cc] font-semibold hover:text-white transition-colors"
                >
                  Linha SKYMAK Direct Drive
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 class="text-xs font-bold uppercase tracking-wider text-white mb-4 pb-2 border-b border-neutral-800">
              Atendimento B2B
            </h3>
            <ul class="space-y-3 text-xs">
              <li class="flex items-start gap-2.5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-[#077fbd] shrink-0 mt-0.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <div>
                  <span class="block text-white font-medium">(11) 99999-9999</span>
                  <span class="text-neutral-500 text-[11px]">WhatsApp Consultoria Técnica</span>
                </div>
              </li>
              <li class="flex items-start gap-2.5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-[#077fbd] shrink-0 mt-0.5"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                <div>
                  <span class="block text-white font-medium">contato&#64;skytecmaquinas.com.br</span>
                  <span class="text-neutral-500 text-[11px]">Cotações & Faturamento PJ</span>
                </div>
              </li>
              <li class="flex items-start gap-2.5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-[#077fbd] shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <div>
                  <span class="block text-white font-medium">Segunda a Sexta</span>
                  <span class="text-neutral-500 text-[11px]">08:00 às 18:00 (Horário de Brasília)</span>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h3 class="text-xs font-bold uppercase tracking-wider text-white mb-4 pb-2 border-b border-neutral-800">
              Institucional & Segurança
            </h3>
            <ul class="space-y-2.5 text-xs mb-6">
              <li>
                <a routerLink="/sobre-nos" class="hover:text-white transition-colors">
                  Sobre a Empresa
                </a>
              </li>
              <li>
                <a routerLink="/conta" class="hover:text-white transition-colors">
                  Área do Cliente
                </a>
              </li>
              <li>
                <a routerLink="/admin" class="text-neutral-500 hover:text-neutral-400 transition-colors">
                  Painel Administrativo
                </a>
              </li>
            </ul>

            <div class="p-3 bg-neutral-900 border border-neutral-800 rounded-lg space-y-2">
              <div class="flex items-center gap-2 text-xs font-bold text-white">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-emerald-400"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <span>Faturamento B2B & Cartão BNDES</span>
              </div>
              <p class="text-[11px] text-neutral-400">
                Condições especiais para confecções, faturamento PJ e garantia técnica nacional.
              </p>
            </div>
          </div>
        </div>

        <div class="mt-12 pt-8 border-t border-neutral-800 text-center space-y-3">
          <p class="text-xs text-neutral-500">
            &copy; 2026 SKYTEC Máquinas de Costura. Todos os direitos reservados.
          </p>
          <p class="text-xs font-mono text-neutral-400">
            Created by: Kaue Miziara — ⟨ Quantum Computing | † | Software Engineering ⟩
          </p>
        </div>
      </div>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {}
