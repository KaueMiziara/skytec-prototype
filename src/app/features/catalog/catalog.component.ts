import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-catalog',
  template: `
    <main class="min-h-screen">
      <section class="max-w-7xl mx-auto px-4 py-8">
        <h1 class="text-2xl font-bold text-dark-surface">Catálogo</h1>
      </section>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CatalogComponent {}
