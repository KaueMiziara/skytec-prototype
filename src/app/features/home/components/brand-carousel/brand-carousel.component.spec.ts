import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BrandCarouselComponent } from './brand-carousel.component';
import { ProductService } from '../../../../core/services/product.service';

describe('BrandCarouselComponent', () => {
  let component: BrandCarouselComponent;
  let fixture: ComponentFixture<BrandCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandCarouselComponent],
      providers: [provideRouter([]), ProductService]
    }).compileComponents();

    fixture = TestBed.createComponent(BrandCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render partner brands list', () => {
    const brandElements = fixture.nativeElement.querySelectorAll('h3');
    const brandNames = Array.from(brandElements).map((el) => (el as HTMLElement).textContent?.trim());

    expect(brandNames).toContain('SKYMAK');
    expect(brandNames).toContain('Jack');
    expect(brandNames).toContain('Sun Special');
    expect(brandNames).toContain('Siruba');
  });

  it('should have brand links with queryParams directing to catalog', () => {
    const brandLinks = fixture.nativeElement.querySelectorAll('a[routerLink="/catalogo"]');
    expect(brandLinks.length).toBeGreaterThan(component.partnerBrands.length);
  });

  it('should render section title and subtitle', () => {
    const h2 = fixture.nativeElement.querySelector('h2') as HTMLHeadingElement;
    expect(h2).toBeTruthy();
    expect(h2.textContent).toContain('Marcas Líderes em Costura Industrial');
  });
});
