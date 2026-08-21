import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-about',
  template: `
    <main class="min-h-screen">
      <section class="max-w-prose mx-auto px-4 py-8">
        <h1 class="text-2xl font-bold text-dark-surface">Sobre Nós</h1>
      </section>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent {}
