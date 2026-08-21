import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeroComponent } from './components/hero/hero.component';
import { FlagshipBannerComponent } from './components/flagship-banner/flagship-banner.component';
import { BrandCarouselComponent } from './components/brand-carousel/brand-carousel.component';
import { FeaturedProductsComponent } from './components/featured-products/featured-products.component';
import { MediaSectionComponent } from './components/media-section/media-section.component';

@Component({
  selector: 'app-home',
  imports: [
    HeroComponent,
    FlagshipBannerComponent,
    BrandCarouselComponent,
    FeaturedProductsComponent,
    MediaSectionComponent
  ],
  template: `
    <main class="min-h-screen">
      <app-hero />
      <app-flagship-banner />
      <app-brand-carousel />
      <app-featured-products />
      <app-media-section />
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {}

