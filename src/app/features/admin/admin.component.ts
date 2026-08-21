import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-admin',
  template: `
    <main class="min-h-screen">
      <section class="p-8">
        <h1 class="text-2xl font-bold text-dark-surface">Painel Administrativo</h1>
      </section>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminComponent {}
