import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeroComponent } from './components/hero/hero.component';
import { FlagshipBannerComponent } from './components/flagship-banner/flagship-banner.component';
import { BrandCarouselComponent } from './components/brand-carousel/brand-carousel.component';

@Component({
  selector: 'app-home',
  imports: [HeroComponent, FlagshipBannerComponent, BrandCarouselComponent],
  template: `
    <main class="min-h-screen">
      <app-hero />
      <app-flagship-banner />
      <app-brand-carousel />
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {}

