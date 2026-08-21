import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Product } from '../../../../../../core/models/product.model';

interface ParsedDifferential {
  title: string;
  detail: string;
}

@Component({
  selector: 'app-pdp-description',
  template: `
    <div class="space-y-8">
      <section aria-labelledby="desc-heading" class="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div class="flex items-center gap-3 pb-4 mb-4 border-b border-neutral-100">
          <div class="w-8 h-8 rounded-lg bg-[#0573cc]/10 text-[#0573cc] flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4" aria-hidden="true">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <h2 id="desc-heading" class="text-lg sm:text-xl font-bold text-neutral-900 tracking-tight">
            Descrição do Equipamento
          </h2>
        </div>

        <div class="prose prose-neutral max-w-none text-xs sm:text-sm text-neutral-700 leading-relaxed space-y-3">
          <p>
            A <strong>{{ product().name }}</strong> é desenvolvida para atender às exigências de produtividade e precisão em confecções e ateliês profissionais. Projetada pela {{ product().brand }}, este modelo da categoria {{ product().category }} combina robustez estrutural com tecnologia avançada para proporcionar costuras uniformes e acabamento de alta qualidade.
          </p>
          <p>
            {{ product().shortDescription }}
          </p>
          <p class="text-neutral-500 text-xs">
            Equipamento fornecido completo com bancada industrial reforçada, gaveta e conjunto de ferramentas para montagem inicial e regulagem.
          </p>
        </div>
      </section>

      @if (differentialsList().length > 0) {
        <section aria-labelledby="diff-heading" class="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div class="flex items-center gap-3 pb-4 mb-5 border-b border-neutral-100">
            <div class="w-8 h-8 rounded-lg bg-[#0573cc]/10 text-[#0573cc] flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4" aria-hidden="true">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <h2 id="diff-heading" class="text-lg sm:text-xl font-bold text-neutral-900 tracking-tight">
              Diferenciais Técnicos
            </h2>
          </div>

          <ul class="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0 m-0">
            @for (diff of differentialsList(); track $index) {
              <li class="flex items-start gap-3 p-4 rounded-xl bg-[#f5f5f7] border border-neutral-200/80">
                <div class="w-5 h-5 rounded-full bg-[#0573cc] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <div class="text-xs sm:text-sm">
                  @if (diff.title) {
                    <strong class="text-neutral-900 font-bold block mb-0.5">
                      {{ diff.title }}
                    </strong>
                    <span class="text-neutral-600 leading-normal">
                      {{ diff.detail }}
                    </span>
                  } @else {
                    <span class="text-neutral-900 font-semibold leading-normal">
                      {{ diff.detail }}
                    </span>
                  }
                </div>
              </li>
            }
          </ul>
        </section>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdpDescriptionComponent {
  readonly product = input.required<Product>();

  protected readonly differentialsList = computed<ParsedDifferential[]>(() => {
    const raw = this.product().differentials || [];
    return raw.map((item) => {
      const colonIndex = item.indexOf(':');
      if (colonIndex > -1) {
        return {
          title: item.substring(0, colonIndex).trim(),
          detail: item.substring(colonIndex + 1).trim()
        };
      }
      return {
        title: '',
        detail: item.trim()
      };
    });
  });
}
