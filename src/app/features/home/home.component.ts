import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeroComponent } from './components/hero/hero.component';
import { FlagshipBannerComponent } from './components/flagship-banner/flagship-banner.component';
import { BrandCarouselComponent } from './components/brand-carousel/brand-carousel.component';
import { FeaturedProductsComponent } from './components/featured-products/featured-products.component';
import { MediaSectionComponent } from './components/media-section/media-section.component';
import { InstitutionalSnippetComponent } from './components/institutional-snippet/institutional-snippet.component';

@Component({
  selector: 'app-home',
  imports: [
    HeroComponent,
    FlagshipBannerComponent,
    BrandCarouselComponent,
    FeaturedProductsComponent,
    MediaSectionComponent,
    InstitutionalSnippetComponent
  ],
  template: `
    <main class="min-h-screen">
      <app-hero />
      <app-flagship-banner />
      <app-brand-carousel />
      <app-featured-products />
      <app-media-section />
      <app-institutional-snippet />
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {}

