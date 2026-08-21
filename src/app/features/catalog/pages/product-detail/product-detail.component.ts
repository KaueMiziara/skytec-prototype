import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-product-detail',
  template: `
    <main class="min-h-screen">
      <section class="max-w-7xl mx-auto px-4 py-8">
        <h1 class="text-2xl font-bold text-dark-surface">Produto: {{ id() }}</h1>
      </section>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent {
  readonly id = input<string>();
}
