import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-auth',
  template: `
    <main class="min-h-screen">
      <section class="max-w-md mx-auto px-4 py-8">
        <h1 class="text-2xl font-bold text-dark-surface">Minha conta SKYTEC</h1>
      </section>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthComponent {}
