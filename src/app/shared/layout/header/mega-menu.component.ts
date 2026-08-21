import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';

export interface CategoryGroup {
  title: string;
  items: { label: string; query: { categoria?: string; marca?: string } }[];
}

@Component({
  selector: 'app-mega-menu',
  imports: [RouterLink],
  template: `
    @if (isOpen()) {
      <div
        class="absolute left-0 right-0 top-full bg-[#141414] border-b border-neutral-800 shadow-2xl text-white z-50 py-8 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-150"
        (mouseleave)="close.emit()"
        role="menu"
        aria-label="Menu de Categorias e Marcas"
      >
        <div class="max-w-7xl mx-auto">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 class="text-xs font-bold uppercase tracking-wider text-[#0573cc] mb-4 pb-2 border-b border-neutral-800 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                Costura Industrial
              </h3>
              <ul class="space-y-2 text-sm">
                @for (item of industrialCategories; track item.label) {
                  <li>
                    <a
                      routerLink="/catalogo"
                      [queryParams]="item.query"
                      (click)="close.emit()"
                      class="text-neutral-300 hover:text-white hover:translate-x-1 inline-block transition-all py-1 focus-visible:outline-none focus-visible:text-[#0573cc]"
                      role="menuitem"
                    >
                      {{ item.label }}
                    </a>
                  </li>
                }
              </ul>
            </div>

            <div>
              <h3 class="text-xs font-bold uppercase tracking-wider text-[#0573cc] mb-4 pb-2 border-b border-neutral-800 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                Especiais & Automação
              </h3>
              <ul class="space-y-2 text-sm">
                @for (item of specialCategories; track item.label) {
                  <li>
                    <a
                      routerLink="/catalogo"
                      [queryParams]="item.query"
                      (click)="close.emit()"
                      class="text-neutral-300 hover:text-white hover:translate-x-1 inline-block transition-all py-1 focus-visible:outline-none focus-visible:text-[#0573cc]"
                      role="menuitem"
                    >
                      {{ item.label }}
                    </a>
                  </li>
                }
              </ul>
            </div>

            <div>
              <h3 class="text-xs font-bold uppercase tracking-wider text-[#0573cc] mb-4 pb-2 border-b border-neutral-800 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                Marcas Parceiras
              </h3>
              <ul class="space-y-2 text-sm">
                @for (brand of productService.brands(); track brand) {
                  <li>
                    <a
                      routerLink="/catalogo"
                      [queryParams]="{ marca: brand }"
                      (click)="close.emit()"
                      class="text-neutral-300 hover:text-white hover:translate-x-1 inline-block transition-all py-1 focus-visible:outline-none focus-visible:text-[#0573cc]"
                      role="menuitem"
                    >
                      Máquinas {{ brand }}
                    </a>
                  </li>
                }
              </ul>
            </div>

            <div class="bg-neutral-900/90 rounded-xl p-5 border border-neutral-800 flex flex-col justify-between">
              <div>
                <span class="inline-block text-[10px] font-bold uppercase tracking-widest text-[#0573cc] bg-[#0573cc]/10 px-2 py-0.5 rounded mb-2">
                  Destaque Técnico
                </span>
                <h4 class="text-base font-bold text-white mb-2">
                  SKYMAK Direct Drive
                </h4>
                <p class="text-xs text-neutral-400 leading-relaxed mb-4">
                  Alta precisão com economia de energia de até 70%. Projetada para escala industrial contínua.
                </p>
              </div>

              <div class="space-y-2">
                <a
                  routerLink="/catalogo"
                  (click)="close.emit()"
                  class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#077fbd] hover:bg-[#066a9e] text-white text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Explorar Catálogo
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown.escape)': 'onEscape()'
  }
})
export class MegaMenuComponent {
  readonly isOpen = input<boolean>(false);
  readonly close = output<void>();

  readonly productService = inject(ProductService);

  protected readonly industrialCategories = [
    { label: 'Máquinas Retas Industriais', query: { categoria: 'Reta' } },
    { label: 'Overlocks & Interlocks', query: { categoria: 'Overlock' } },
    { label: 'Galoneiras / Colaretes', query: { categoria: 'Galoneira' } },
    { label: 'Pespontadeiras 2 Agulhas', query: { categoria: 'Pespontadeira' } },
    { label: 'Equipamentos de Corte', query: { categoria: 'Corte' } }
  ];

  protected readonly specialCategories = [
    { label: 'Travetes Eletrônicos', query: { categoria: 'Travete' } },
    { label: 'Botoneiras Eletrônicas', query: { categoria: 'Botoneira' } },
    { label: 'Caseadeiras Industriais', query: { categoria: 'Caseadeira' } },
    { label: 'Peças & Insumos Gerais', query: { categoria: 'Outros' } }
  ];

  protected onEscape(): void {
    if (this.isOpen()) {
      this.close.emit();
    }
  }
}
