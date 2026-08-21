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
});
