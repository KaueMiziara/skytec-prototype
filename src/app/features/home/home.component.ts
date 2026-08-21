import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeroComponent } from './components/hero/hero.component';
import { FlagshipBannerComponent } from './components/flagship-banner/flagship-banner.component';

@Component({
  selector: 'app-home',
  imports: [HeroComponent, FlagshipBannerComponent],
  template: `
    <main class="min-h-screen">
      <app-hero />
      <app-flagship-banner />
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {}

