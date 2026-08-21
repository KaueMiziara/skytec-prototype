import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ProductSpecification } from '../../../../../../core/models/product.model';

interface SpecRow {
  key: string;
  value: string;
}

@Component({
  selector: 'app-pdp-specs-table',
  template: `
    <section aria-labelledby="specs-heading" class="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-xs">
      <div class="flex items-center justify-between gap-4 pb-4 mb-5 border-b border-neutral-100">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-[#0573cc]/10 text-[#0573cc] flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="3" y1="15" x2="21" y2="15" />
              <line x1="12" y1="3" x2="12" y2="21" />
            </svg>
          </div>
          <h2 id="specs-heading" class="text-lg sm:text-xl font-bold text-neutral-900 tracking-tight">
            Especificações Técnicas
          </h2>
        </div>

        @if (hasSpecs()) {
          <span class="text-xs font-mono text-neutral-500 font-semibold bg-[#f5f5f7] px-2.5 py-1 rounded-lg border border-neutral-200">
            {{ specsList().length }} {{ specsList().length === 1 ? 'parâmetro' : 'parâmetros' }}
          </span>
        }
      </div>

      @if (hasSpecs()) {
        <div class="overflow-x-auto rounded-xl border border-neutral-200">
          <table class="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr class="bg-neutral-900 text-white font-mono uppercase tracking-wider text-[11px]">
                <th scope="col" class="py-3 px-4 sm:px-6 w-1/3 sm:w-2/5 font-bold">
                  Característica
                </th>
                <th scope="col" class="py-3 px-4 sm:px-6 font-bold">
                  Especificação Técnica
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-200">
              @for (spec of specsList(); track spec.key) {
                <tr
                  class="transition-colors hover:bg-neutral-100/60"
                  [class.bg-white]="$index % 2 === 0"
                  [class.bg-[#f5f5f7]]="$index % 2 !== 0"
                >
                  <th scope="row" class="py-3 sm:py-3.5 px-4 sm:px-6 font-bold text-neutral-900 align-top">
                    {{ spec.key }}
                  </th>
                  <td class="py-3 sm:py-3.5 px-4 sm:px-6 text-neutral-700 font-medium align-top">
                    {{ spec.value }}
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      } @else {
        <div class="p-8 text-center bg-[#f5f5f7] rounded-xl border border-neutral-200/80 text-neutral-500 text-xs sm:text-sm">
          Especificações técnicas detalhadas sob consulta com nossa equipe de engenharia.
        </div>
      }
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdpSpecsTableComponent {
  readonly specifications = input<ProductSpecification>({});
  readonly productName = input<string>('');

  protected readonly specsList = computed<SpecRow[]>(() => {
    const specs = this.specifications();
    if (!specs) return [];
    return Object.entries(specs).map(([key, value]) => ({ key, value }));
  });

  protected readonly hasSpecs = computed<boolean>(() => this.specsList().length > 0);
}
