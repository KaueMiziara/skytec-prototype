import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HomeComponent } from './home.component';
import { CartService } from '../../core/services/cart.service';
import { ProductService } from '../../core/services/product.service';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [provideRouter([]), CartService, ProductService]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render app-hero component', () => {
    const heroElement = fixture.nativeElement.querySelector('app-hero');
    expect(heroElement).toBeTruthy();
  });

  it('should render app-flagship-banner component', () => {
    const bannerElement = fixture.nativeElement.querySelector('app-flagship-banner');
    expect(bannerElement).toBeTruthy();
  });

  it('should render app-brand-carousel component', () => {
    const carouselElement = fixture.nativeElement.querySelector('app-brand-carousel');
    expect(carouselElement).toBeTruthy();
  });

  it('should render app-featured-products component', () => {
    const featuredElement = fixture.nativeElement.querySelector('app-featured-products');
    expect(featuredElement).toBeTruthy();
  });

  it('should render app-media-section component', () => {
    const mediaElement = fixture.nativeElement.querySelector('app-media-section');
    expect(mediaElement).toBeTruthy();
  });

  it('should render app-institutional-snippet component', () => {
    const snippetElement = fixture.nativeElement.querySelector('app-institutional-snippet');
    expect(snippetElement).toBeTruthy();
  });
});
